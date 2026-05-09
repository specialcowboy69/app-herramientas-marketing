import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const snapshot = await adminDb
      .collection('generations')
      .where('userId', '==', userId)
      .where('isFavorite', '==', true)
      .orderBy('createdAt', 'desc')
      .get();

    const favorites = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt 
    }));

    return NextResponse.json(favorites);
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const { toolSlug, outputPayload, projectId } = await req.json();

    if (!toolSlug || !outputPayload) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
    }

    const genRef = await adminDb.collection('generations').add({
      userId,
      projectId: projectId || 'individual',
      toolSlug,
      outputPayload,
      isFavorite: true,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id: genRef.id });
  } catch (error: any) {
    console.error('Error saving favorite:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
