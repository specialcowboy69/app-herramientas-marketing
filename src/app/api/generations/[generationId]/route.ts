import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ generationId: string }> }
) {
  try {
    const { generationId } = await params;
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const { isFavorite } = await req.json();

    const genRef = adminDb.collection('generations').doc(generationId);
    const genDoc = await genRef.get();

    if (!genDoc.exists || genDoc.data()?.userId !== userId) {
      return NextResponse.json({ error: 'Generación no encontrada' }, { status: 404 });
    }

    await genRef.update({ isFavorite });

    return NextResponse.json({ success: true, isFavorite });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
