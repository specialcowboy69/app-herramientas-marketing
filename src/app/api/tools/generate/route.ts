import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { generateJSON } from '@/lib/ai/gemini';
import { sanitizeInputObject } from '@/lib/security/sanitize';

export async function POST(req: NextRequest) {
  try {
    let userId = null;
    const authHeader = req.headers.get('Authorization');
    
    let decodedToken = null;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const idToken = authHeader.split('Bearer ')[1];
        decodedToken = await adminAuth.verifyIdToken(idToken);
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

    if (decodedToken && !decodedToken.email_verified && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Debes verificar tu correo electrónico para utilizar las herramientas de IA.' }, { status: 403 });
    }




    // Backend Premium & Free Limit Check
    const userDocRef = adminDb.collection('users').doc(userId);
    const userDoc = await userDocRef.get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'Usuario no encontrado.' }, { status: 404 });
    }

    const userData = userDoc.data() || {};
    const isPremium = userData.subscriptionStatus === 'active';
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    
    let { dailyGenerationsCount = 0, lastGenerationDate = '' } = userData;

    // Resetear el contador si es un nuevo día
    if (lastGenerationDate !== today) {
      dailyGenerationsCount = 0;
    }

    // Límite de seguridad: 1000 para Premium (anti-bots), 5 para Free
    const MAX_DAILY_LIMIT = isPremium ? 1000 : 5;

    if (dailyGenerationsCount >= MAX_DAILY_LIMIT) {
      const errorMessage = isPremium 
        ? 'Límite de seguridad diario alcanzado. Contacta con soporte si necesitas más volumen.'
        : 'Has alcanzado el límite de 5 usos gratuitos diarios. Suscríbete para acceso ilimitado.';
      return NextResponse.json({ error: errorMessage }, { status: 403 });
    }

    // 1. Create the generation document with 'processing' status
    const genRef = await adminDb.collection('generations').add({
      userId,
      projectId: projectId || 'anonymous',
      productId: productId || null,
      toolSlug,
      inputPayload: input,
      status: 'processing',
      isFavorite: false,
      createdAt: new Date(),
    });

    const jobId = genRef.id;

    // 2. Prepare Context (needed for the background task)
    let projectContext = null;
    let isolatedContext = null;

    if (userId && projectId && projectId !== 'anonymous') {
      const projectDoc = await adminDb.collection('projects').doc(projectId).get();
      const projectData = projectDoc.data();
      
      if (projectDoc.exists && projectData?.userId === userId) {
        projectContext = projectData;
        if (productId && projectData.products?.[productId]) {
          const product = projectData.products[productId];
          isolatedContext = {
            ...projectData,
            productName: product.name,
            productUsp: product.usp,
            targetAudience: product.targetAudience || projectData.targetAudience,
            aiKnowledge: product.aiKnowledge || {},
            isProductSpecific: true
          };
        } else {
          isolatedContext = projectData;
        }
      }
    }

    // 3. Trigger Background Task (Non-blocking)
    // Using a self-executing async function. In Vercel, this is "best-effort" unless using waitUntil.
    (async () => {
      try {
        let output;
        const context = isolatedContext || {};

        if (['ads-generator', 'cta-generator', 'naming-slogan', 'product-description', 'amazon-product', 'framework-pas'].includes(toolSlug)) {
          const { CopywriterAgent } = await import('@/lib/agents/copywriter/copywriter_tools');
          let system, user;
          
          if (toolSlug === 'ads-generator') ({ system, user } = await CopywriterAgent.prepareAdsPrompt(input, context));
          else if (toolSlug === 'cta-generator') ({ system, user } = await CopywriterAgent.prepareCTAPrompt(input, context));
          else if (toolSlug === 'naming-slogan') ({ system, user } = await CopywriterAgent.prepareNamingPrompt(input, context));
          else if (toolSlug === 'amazon-product') ({ system, user } = await CopywriterAgent.prepareAmazonProductPrompt(input, context));
          else if (toolSlug === 'framework-pas') ({ system, user } = await CopywriterAgent.prepareFrameworkPASPrompt(input, context));
          else ({ system, user } = await CopywriterAgent.prepareProductDescriptionPrompt(input, context));
          
          output = await generateJSON(user, undefined, system);
        } else if (['seo-brief', 'blog-toolkit'].includes(toolSlug)) {
          const { SEOSpecialistAgent } = await import('@/lib/agents/seo_specialist/seo_tools');
          let system, user;
          if (toolSlug === 'seo-brief') ({ system, user } = await SEOSpecialistAgent.prepareSEOBriefPrompt(input, context));
          else ({ system, user } = await SEOSpecialistAgent.prepareBlogToolkitPrompt(input, context));
          output = await generateJSON(user, undefined, system);
        } else if (['youtube-script', 'youtube-seo'].includes(toolSlug)) {
          const { CreatorAgent } = await import('@/lib/agents/content_creator/creator_tools');
          let system, user;
          if (toolSlug === 'youtube-script') ({ system, user } = await CreatorAgent.prepareYouTubeScriptPrompt(input, context));
          else ({ system, user } = await CreatorAgent.prepareYouTubeSEOPrompt(input, context));
          output = await generateJSON(user, undefined, system);
        } else if (['business-idea', 'customer-avatar', 'pain-points'].includes(toolSlug)) {
          const { BusinessStrategistAgent } = await import('@/lib/agents/business_strategist/strategist_tools');
          let system, user;
          if (toolSlug === 'business-idea') ({ system, user } = await BusinessStrategistAgent.prepareBusinessIdeaPrompt(input, context));
          else if (toolSlug === 'customer-avatar') ({ system, user } = await BusinessStrategistAgent.prepareCustomerAvatarPrompt(input, context));
          else ({ system, user } = await BusinessStrategistAgent.preparePainPointsPrompt(input, context));
          output = await generateJSON(user, undefined, system);
        }

        // Update document with result
        await genRef.update({
          status: 'completed',
          outputPayload: output,
          finishedAt: new Date()
        });

        // Update user counters
        await userDocRef.update({
          dailyGenerationsCount: dailyGenerationsCount + 1,
          lastGenerationDate: today
        });

      } catch (error: any) {
        console.error('[BACKGROUND ERROR]:', error);
        await genRef.update({
          status: 'error',
          error: error.message,
          finishedAt: new Date()
        });
      }
    })();

    // 4. Return immediately with jobId
    return NextResponse.json({
      success: true,
      jobId
    });
  } catch (error: any) {
    console.error('[CRITICAL ERROR]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
