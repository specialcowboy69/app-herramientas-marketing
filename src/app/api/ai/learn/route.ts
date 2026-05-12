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

    let updateField = '';
    if (toolSlug === 'customer-avatar') updateField = `products.${productId}.aiKnowledge.lastAvatar`;
    else if (toolSlug === 'pain-points') updateField = `products.${productId}.aiKnowledge.painPoints`;
    else if (toolSlug === 'business-idea') updateField = `products.${productId}.aiKnowledge.businessModel`;

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
