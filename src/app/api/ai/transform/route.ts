import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { generateText } from '@/lib/ai/gemini';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    try {
      await adminAuth.verifyIdToken(idToken);
    } catch (e) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const { text, action } = await req.json();

    if (!text || !action) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
    }

    let prompt = '';
    if (action === 'summarize') {
      prompt = `Actúa como un editor experto. Toma el siguiente texto y resúmelo de forma concisa manteniendo los puntos clave y el tono original. Devuelve solo el resumen.\n\nTexto: ${text}`;
    } else {
      return NextResponse.json({ error: 'Acción no soportada' }, { status: 400 });
    }

    const result = await generateText(prompt);

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Error in transform API:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
