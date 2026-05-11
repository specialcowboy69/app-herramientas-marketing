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

    const updates = await req.json();

    const genRef = adminDb.collection('generations').doc(generationId);
    const genDoc = await genRef.get();

    if (!genDoc.exists) {
      return NextResponse.json({ error: 'Generación no encontrada' }, { status: 404 });
    }

    if (genDoc.data()?.userId !== userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    await genRef.update({
      ...updates,
      updatedAt: new Date()
    });

    return NextResponse.json({ success: true, ...updates });
  } catch (error: any) {
    console.error('Error updating generation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
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

    const genRef = adminDb.collection('generations').doc(generationId);
    const genDoc = await genRef.get();

    if (!genDoc.exists) {
      return NextResponse.json({ error: 'Generación no encontrada' }, { status: 404 });
    }

    if (genDoc.data()?.userId !== userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    await genRef.delete();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting generation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
