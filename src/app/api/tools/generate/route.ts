import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { generateJSON } from '@/lib/ai/gemini';
import { sanitizeInputObject } from '@/lib/security/sanitize';

export async function POST(req: NextRequest) {
  try {
    let userId = null;
    const authHeader = req.headers.get('Authorization');
    
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        userId = decodedToken.uid;
      } catch (e) {
        console.error('Invalid token', e);
      }
    }

    const body = await req.json();
    const { projectId, productId, toolSlug } = body;
    // Sanitize all user-provided input fields before they reach the AI prompt
    const input = sanitizeInputObject(body.input ?? {});

    if (!toolSlug || !input) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'Debes iniciar sesión para usar la IA.' }, { status: 401 });
    }


    // Backend Premium & Free Limit Check
    const userDocRef = adminDb.collection('users').doc(userId);
    const userDoc = await userDocRef.get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'Usuario no encontrado.' }, { status: 404 });
    }

    const userData = userDoc.data() || {};
    const isPremium = userData.subscriptionStatus === 'active';
    
    if (!isPremium) {
      const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
      let { dailyGenerationsCount = 0, lastGenerationDate = '' } = userData;

      if (lastGenerationDate !== today) {
        dailyGenerationsCount = 0;
      }

      if (dailyGenerationsCount >= 5) {
        return NextResponse.json({ error: 'Has alcanzado el límite de 5 usos gratuitos diarios. Suscríbete para acceso ilimitado.' }, { status: 403 });
      }

      // We will increment the count after successful generation, wait, actually let's do it after generateJSON finishes
      userData.dailyGenerationsCount = dailyGenerationsCount;
      userData.lastGenerationDate = today;
    }

    let projectContext = null;
    let isolatedContext = null;

    if (userId && projectId && projectId !== 'anonymous') {
      // Validate project ownership
      const projectDoc = await adminDb.collection('projects').doc(projectId).get();
      const projectData = projectDoc.data();
      
      if (!projectDoc.exists || projectData?.userId !== userId) {
        return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 });
      }
      
      projectContext = projectData;

      // Logic for Isolated Context (Products)
      if (productId && projectData.products?.[productId]) {
        const product = projectData.products[productId];
        isolatedContext = {
          ...projectData,
          // Product-specific overrides
          productName: product.name,
          productUsp: product.usp,
          // Use product audience if available, else fallback to project audience
          targetAudience: product.targetAudience || projectData.targetAudience,
          aiKnowledge: product.aiKnowledge || {},
          isProductSpecific: true
        };
      } else {
        isolatedContext = projectData;
      }
    }

    let output;
    
    if (toolSlug === 'ads-generator' || toolSlug === 'cta-generator' || toolSlug === 'naming-slogan' || toolSlug === 'product-description' || toolSlug === 'amazon-product' || toolSlug === 'framework-pas') {
      // AGENTE: Copywriter
      const { CopywriterAgent } = await import('@/lib/agents/copywriter/copywriter_tools');
      let system, user;
      
      const context = isolatedContext || {};
      
      if (toolSlug === 'ads-generator') {
        ({ system, user } = await CopywriterAgent.prepareAdsPrompt(input, context));
      } else if (toolSlug === 'cta-generator') {
        ({ system, user } = await CopywriterAgent.prepareCTAPrompt(input, context));
      } else if (toolSlug === 'naming-slogan') {
        ({ system, user } = await CopywriterAgent.prepareNamingPrompt(input, context));
      } else if (toolSlug === 'amazon-product') {
        ({ system, user } = await CopywriterAgent.prepareAmazonProductPrompt(input, context));
      } else if (toolSlug === 'framework-pas') {
        ({ system, user } = await CopywriterAgent.prepareFrameworkPASPrompt(input, context));
      } else {
        ({ system, user } = await CopywriterAgent.prepareProductDescriptionPrompt(input, context));
      }
      
      output = await generateJSON(user, undefined, system);
    } else if (toolSlug === 'seo-brief' || toolSlug === 'blog-toolkit') {
      // AGENTE: SEO Specialist
      const { SEOSpecialistAgent } = await import('@/lib/agents/seo_specialist/seo_tools');
      let system, user;
      
      const context = isolatedContext || {};
      
      if (toolSlug === 'seo-brief') {
        ({ system, user } = await SEOSpecialistAgent.prepareSEOBriefPrompt(input, context));
      } else {
        ({ system, user } = await SEOSpecialistAgent.prepareBlogToolkitPrompt(input, context));
      }
      
      output = await generateJSON(user, undefined, system);
    } else if (toolSlug === 'youtube-script' || toolSlug === 'youtube-seo') {
      // AGENTE: Content Creator
      const { CreatorAgent } = await import('@/lib/agents/content_creator/creator_tools');
      let system, user;
      
      const context = isolatedContext || {};
      
      if (toolSlug === 'youtube-script') {
        ({ system, user } = await CreatorAgent.prepareYouTubeScriptPrompt(input, context));
      } else {
        ({ system, user } = await CreatorAgent.prepareYouTubeSEOPrompt(input, context));
      }
      
      output = await generateJSON(user, undefined, system);
    } else if (toolSlug === 'business-idea' || toolSlug === 'customer-avatar' || toolSlug === 'pain-points') {
      // AGENTE: Business Strategist
      const { BusinessStrategistAgent } = await import('@/lib/agents/business_strategist/strategist_tools');
      let system, user;
      
      const context = isolatedContext || {};
      
      if (toolSlug === 'business-idea') {
        ({ system, user } = await BusinessStrategistAgent.prepareBusinessIdeaPrompt(input, context));
      } else if (toolSlug === 'customer-avatar') {
        ({ system, user } = await BusinessStrategistAgent.prepareCustomerAvatarPrompt(input, context));
      } else {
        ({ system, user } = await BusinessStrategistAgent.preparePainPointsPrompt(input, context));
      }
      
      output = await generateJSON(user, undefined, system);
    } else {
      return NextResponse.json({ error: 'Invalid tool slug' }, { status: 400 });
    }

    let generationId = 'anon-' + Date.now();

    // Save generation to Firestore subcollection only if user and project exist
    if (userId && projectId && projectId !== 'anonymous') {
      const genRef = await adminDb
        .collection('generations')
        .add({
          userId,
          projectId,
          toolSlug,
          inputPayload: input,
          outputPayload: output,
          isFavorite: false,
          createdAt: new Date(),
        });
      generationId = genRef.id;

      // Update free user limits
      if (!isPremium) {
        await userDocRef.update({
          dailyGenerationsCount: userData.dailyGenerationsCount + 1,
          lastGenerationDate: userData.lastGenerationDate
        });
      }

      // NEW: Update AI Knowledge in the specific product if productId is present
      if (productId) {
        let updateField = '';
        if (toolSlug === 'customer-avatar') updateField = `products.${productId}.aiKnowledge.lastAvatar`;
        else if (toolSlug === 'pain-points') updateField = `products.${productId}.aiKnowledge.painPoints`;
        else if (toolSlug === 'business-idea') updateField = `products.${productId}.aiKnowledge.businessModel`;

        if (updateField) {
          try {
            await adminDb.collection('projects').doc(projectId).update({
              [updateField]: output
            });
            console.log(`Updated aiKnowledge for product ${productId} in project ${projectId}`);
          } catch (err) {
            console.error('Error updating product aiKnowledge:', err);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      generationId,
      output,
    });
  } catch (error: any) {
    console.error('[ERROR GEMINI DETALLADO]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
