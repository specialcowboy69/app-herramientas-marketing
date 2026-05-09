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

    const [projectsSnap, docsSnap, gensSnap] = await Promise.all([
      adminDb.collection('projects').where('userId', '==', userId).get(),
      adminDb.collection('documents').where('userId', '==', userId).get(),
      adminDb.collection('generations').where('userId', '==', userId).get()
    ]);

    return NextResponse.json({
      projectsCount: projectsSnap.size,
      documentsCount: docsSnap.size,
      generationsCount: gensSnap.size
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
