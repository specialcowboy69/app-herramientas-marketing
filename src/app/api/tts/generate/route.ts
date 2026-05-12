import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { sanitizeInput } from '@/lib/security/sanitize';

// Initialize with the same service account credentials as Firebase Admin
const ttsClient = new TextToSpeechClient({
  credentials: {
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});

const MAX_CHARS = 5000;

// Allowlist of valid voice names to prevent injection via voice param
const VALID_VOICES = new Set([
  // Spanish (Spain, US, Mexico)
  'es-ES-Standard-A', 'es-ES-Standard-B', 'es-ES-Standard-C', 'es-ES-Standard-D',
  'es-ES-Neural2-A', 'es-ES-Neural2-B', 'es-ES-Neural2-C', 'es-ES-Neural2-D', 'es-ES-Neural2-E', 'es-ES-Neural2-F',
  'es-US-Neural2-A', 'es-US-Neural2-B', 'es-US-Neural2-C',
  'es-MX-Neural2-A', 'es-MX-Neural2-B', 'es-MX-Neural2-C',
  // English (US, UK)
  'en-US-Neural2-A', 'en-US-Neural2-C', 'en-US-Neural2-D', 'en-US-Neural2-E', 'en-US-Neural2-F', 'en-US-Neural2-G', 'en-US-Neural2-H', 'en-US-Neural2-I', 'en-US-Neural2-J',
  'en-GB-Neural2-A', 'en-GB-Neural2-B', 'en-GB-Neural2-C', 'en-GB-Neural2-D', 'en-GB-Neural2-F',
  // Portuguese (Brazil)
  'pt-BR-Neural2-A', 'pt-BR-Neural2-B', 'pt-BR-Neural2-C',
  // French (France)
  'fr-FR-Neural2-A', 'fr-FR-Neural2-B', 'fr-FR-Neural2-C', 'fr-FR-Neural2-D', 'fr-FR-Neural2-E',
]);

export async function POST(req: NextRequest) {
  try {
    // Require authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    if (!decodedToken.email_verified && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Debes verificar tu correo electrónico para usar TTS.' }, { status: 403 });
    }

    const { text: rawText, voiceName, speakingRate, pitch } = await req.json();

    // Validate and sanitize
    const text = sanitizeInput(String(rawText ?? ''), MAX_CHARS);
    if (!text || text.length < 2) {
      return NextResponse.json({ error: 'El texto es demasiado corto.' }, { status: 400 });
    }
    if (text.length > MAX_CHARS) {
      return NextResponse.json({ error: `El texto no puede superar los ${MAX_CHARS} caracteres.` }, { status: 400 });
    }

    // 1. Create the generation document
    const genRef = await adminDb.collection('generations').add({
      userId,
      toolSlug: 'tts-generator',
      inputPayload: { text, voiceName, speakingRate, pitch },
      status: 'processing',
      createdAt: new Date(),
    });
    const jobId = genRef.id;

    // 2. Trigger Background Task
    (async () => {
      try {
        // Validate voice name against allowlist
        const voice = VALID_VOICES.has(voiceName) ? voiceName : 'es-ES-Neural2-A';

        // Validate numeric params
        const rate = Math.min(Math.max(parseFloat(speakingRate) || 1.0, 0.25), 4.0);
        const pitchVal = Math.min(Math.max(parseFloat(pitch) || 0.0, -20.0), 20.0);

        // Extract language code from voice name
        const languageCode = voice.split('-').slice(0, 2).join('-');

        const [response] = await ttsClient.synthesizeSpeech({
          input: { text },
          voice: { languageCode, name: voice },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: rate,
            pitch: pitchVal,
          },
        });

        if (!response.audioContent) {
          throw new Error('No se pudo generar el audio.');
        }

        const audioBase64 = Buffer.from(response.audioContent as Uint8Array).toString('base64');

        await genRef.update({
          status: 'completed',
          outputPayload: { audioBase64, characterCount: text.length },
          finishedAt: new Date()
        });
      } catch (error: any) {
        console.error('TTS Background Error:', error);
        await genRef.update({
          status: 'error',
          error: error.message,
          finishedAt: new Date()
        });
      }
    })();

    return NextResponse.json({ success: true, jobId });
  } catch (error: any) {
    console.error('TTS Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
