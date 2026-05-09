import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { TOOL_PROMPTS } from '@/lib/prompts';
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
    const { projectId, toolSlug } = body;
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

    if (userId && projectId && projectId !== 'anonymous') {
      // Validate project ownership
      const projectDoc = await adminDb.collection('projects').doc(projectId).get();
      if (!projectDoc.exists || projectDoc.data()?.userId !== userId) {
        return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 });
      }
      projectContext = projectDoc.data();
    }

    let output;
    
    if (toolSlug === 'ads-generator' || toolSlug === 'cta-generator' || toolSlug === 'naming-slogan' || toolSlug === 'product-description') {
      // AGENTE: Copywriter
      const { CopywriterAgent } = await import('@/lib/agents/copywriter/copywriter_tools');
      let system, user;
      
      if (toolSlug === 'ads-generator') {
        ({ system, user } = await CopywriterAgent.prepareAdsPrompt(input, projectContext || {}));
      } else if (toolSlug === 'cta-generator') {
        ({ system, user } = await CopywriterAgent.prepareCTAPrompt(input, projectContext || {}));
      } else if (toolSlug === 'naming-slogan') {
        ({ system, user } = await CopywriterAgent.prepareNamingPrompt(input, projectContext || {}));
      } else {
        ({ system, user } = await CopywriterAgent.prepareProductDescriptionPrompt(input, projectContext || {}));
      }
      
      output = await generateJSON(user, "gemini-2.5-flash", system);
    } else if (toolSlug === 'seo-brief' || toolSlug === 'blog-toolkit') {
      // AGENTE: SEO Specialist
      const { SEOSpecialistAgent } = await import('@/lib/agents/seo_specialist/seo_tools');
      let system, user;
      
      if (toolSlug === 'seo-brief') {
        ({ system, user } = await SEOSpecialistAgent.prepareSEOBriefPrompt(input, projectContext || {}));
      } else {
        ({ system, user } = await SEOSpecialistAgent.prepareBlogToolkitPrompt(input, projectContext || {}));
      }
      
      output = await generateJSON(user, "gemini-2.5-flash", system);
    } else if (toolSlug === 'business-idea' || toolSlug === 'customer-avatar' || toolSlug === 'pain-points') {
      // AGENTE: Business Strategist
      const { BusinessStrategistAgent } = await import('@/lib/agents/business_strategist/strategist_tools');
      let system, user;
      
      if (toolSlug === 'business-idea') {
        ({ system, user } = await BusinessStrategistAgent.prepareBusinessIdeaPrompt(input, projectContext || {}));
      } else if (toolSlug === 'customer-avatar') {
        ({ system, user } = await BusinessStrategistAgent.prepareCustomerAvatarPrompt(input, projectContext || {}));
      } else {
        ({ system, user } = await BusinessStrategistAgent.preparePainPointsPrompt(input, projectContext || {}));
      }
      
      output = await generateJSON(user, "gemini-2.5-flash", system);
    } else {
      // Legacy Architecture
      const promptFunc = (TOOL_PROMPTS as any)[toolSlug];
      if (!promptFunc) {
        return NextResponse.json({ error: 'Invalid tool slug' }, { status: 400 });
      }
      const prompt = promptFunc(input, projectContext || {});
      output = await generateJSON(prompt);
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
    }

    return NextResponse.json({
      success: true,
      generationId,
      output,
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
