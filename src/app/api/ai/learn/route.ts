import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    
    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const { projectId, productId, toolSlug, content } = await req.json();

    if (!projectId || !productId || !toolSlug || !content) {
      return NextResponse.json({ success: true, message: 'Faltan datos, ignorado' });
    }

    // Mapa dinámico de herramientas hacia las claves de memoria del producto
    const knowledgeMap: Record<string, string> = {
      'business-idea': 'businessModel',
      'customer-avatar': 'lastAvatar',
      'pain-points': 'painPoints',
      'naming-slogan': 'brandIdentity',
      'framework-pas': 'pasFramework',
      'product-description': 'productDescription',
      'amazon-product': 'amazonListing',
      'ads-generator': 'savedAds',
      'cta-generator': 'savedCtas',
      'seo-brief': 'seoStrategy',
      'blog-toolkit': 'blogDrafts',
      'youtube-script': 'youtubeScripts',
      'youtube-seo': 'youtubeSeo',
      'text-to-speech': 'voicePreferences'
    };

    const knowledgeKey = knowledgeMap[toolSlug];

    if (!knowledgeKey) {
      return NextResponse.json({ success: true, message: 'Herramienta no mapeada para aprendizaje, ignorada' });
    }

    const updateField = `products.${productId}.aiKnowledge.${knowledgeKey}`;

    if (updateField) {
      const projectRef = adminDb.collection('projects').doc(projectId);
      const doc = await projectRef.get();
      if (doc.exists && doc.data()?.userId === userId) {
        await projectRef.update({ [updateField]: content });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[AI LEARN ERROR]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
