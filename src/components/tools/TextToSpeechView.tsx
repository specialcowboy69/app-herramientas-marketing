'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Volume2, Download, Play, Pause, Mic, Loader2, RotateCcw } from 'lucide-react';
import { getIdToken } from 'firebase/auth';

const VOICES = [
  { value: 'es-ES-Neural2-B', label: '🇪🇸 Carlos (España - Hombre)' },
  { value: 'es-ES-Neural2-C', label: '🇪🇸 Isabel (España - Mujer)' },
  // Spanish - US / Latin Neutro
  { value: 'es-US-Neural2-A', label: '🌎 Valentina (Latino - Mujer)' },
  { value: 'es-US-Neural2-B', label: '🌎 Mateo (Latino - Hombre)' },
  { value: 'es-US-Neural2-C', label: '🌎 Camila (Latino - Mujer)' },
  // Spanish - Mexico
  { value: 'es-MX-Neural2-A', label: '🇲🇽 Ximena (México - Mujer)' },
  { value: 'es-MX-Neural2-B', label: '🇲🇽 Jorge (México - Hombre)' },
  { value: 'es-MX-Neural2-C', label: '🇲🇽 Renata (México - Mujer)' },
  // English - US
  { value: 'en-US-Neural2-A', label: '🇺🇸 Ava (US - Woman)' },
  { value: 'en-US-Neural2-D', label: '🇺🇸 Ethan (US - Man)' },
  { value: 'en-US-Neural2-F', label: '🇺🇸 Emma (US - Woman)' },
  // English - UK
  { value: 'en-GB-Neural2-A', label: '🇬🇧 Olivia (UK - Woman)' },
  { value: 'en-GB-Neural2-B', label: '🇬🇧 James (UK - Man)' },
  // Portuguese - Brazil
  { value: 'pt-BR-Neural2-A', label: '🇧🇷 Maria (Brasil - Mujer)' },
  { value: 'pt-BR-Neural2-B', label: '🇧🇷 Lucas (Brasil - Hombre)' },
  // French - France
  { value: 'fr-FR-Neural2-A', label: '🇫🇷 Juliette (Francia - Mujer)' },
  { value: 'fr-FR-Neural2-B', label: '🇫🇷 Thomas (Francia - Hombre)' },
];

const MAX_CHARS = 5000;

export function TextToSpeechView() {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('es-ES-Neural2-C');
  const [speakingRate, setSpeakingRate] = useState(1.0);
  const [pitch, setPitch] = useState(0);
  const [loading, setLoading] = useState(false);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const charCount = text.length;
  const charPercent = Math.round((charCount / MAX_CHARS) * 100);

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error('Por favor, escribe algún texto primero.');
      return;
    }
    if (!user) {
      toast.error('Debes iniciar sesión para usar esta herramienta.');
      return;
    }

    setLoading(true);
    setAudioBase64(null);
    setIsPlaying(false);

    try {
      const token = await getIdToken(user);
      const res = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, voiceName: voice, speakingRate, pitch }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error generando el audio');

      setAudioBase64(data.audioBase64);
      toast.success('¡Audio generado correctamente!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleDownload = () => {
    if (!audioBase64) return;
    const link = document.createElement('a');
    link.href = `data:audio/mp3;base64,${audioBase64}`;
    link.download = `audio-${Date.now()}.mp3`;
    link.click();
  };

  const handleReset = () => {
    setAudioBase64(null);
    setIsPlaying(false);
    if (audioRef.current) audioRef.current.pause();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Mic className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Generador de Texto a Voz</h1>
            <p className="text-muted-foreground text-sm">Convierte tu texto en audio realista con voces Neural2 de Google</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Controls */}
          <div className="lg:col-span-1 space-y-5">

            {/* Voice selector */}
            <div className="space-y-2">
              <Label className="font-medium">Voz</Label>
              <Select value={voice} onValueChange={setVoice}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecciona una voz" />
                </SelectTrigger>
                <SelectContent>
                  {VOICES.map(v => (
                    <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Speaking rate */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="font-medium">Velocidad</Label>
                <span className="text-sm text-muted-foreground font-mono">{speakingRate.toFixed(2)}x</span>
              </div>
              <Slider
                min={0.5}
                max={2.0}
                step={0.05}
                value={[speakingRate]}
                onValueChange={([val]: number[]) => setSpeakingRate(val)}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Lento (0.5x)</span>
                <span>Normal (1x)</span>
                <span>Rápido (2x)</span>
              </div>
            </div>

            {/* Pitch */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="font-medium">Tono</Label>
                <span className="text-sm text-muted-foreground font-mono">{pitch > 0 ? `+${pitch}` : pitch} st</span>
              </div>
              <Slider
                min={-10}
                max={10}
                step={0.5}
                value={[pitch]}
                onValueChange={([val]: number[]) => setPitch(val)}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Grave (-10)</span>
                <span>Normal (0)</span>
                <span>Agudo (+10)</span>
              </div>
            </div>


          </div>

          {/* Right: Text input + Result */}
          <div className="lg:col-span-2 space-y-5">

            {/* Text area */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="font-medium">Texto a convertir</Label>
                <span className={`text-xs font-mono ${charCount > MAX_CHARS * 0.9 ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
                </span>
              </div>
              <Textarea
                placeholder="Escribe o pega aquí el texto que quieres convertir en voz realista..."
                value={text}
                onChange={e => setText(e.target.value.slice(0, MAX_CHARS))}
                className="min-h-[220px] resize-none text-sm leading-relaxed"
              />
              {/* Char progress bar */}
              <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${charPercent > 90 ? 'bg-red-500' : 'bg-primary'}`}
                  style={{ width: `${charPercent}%` }}
                />
              </div>
            </div>

            {/* Generate button */}
            <Button
              onClick={handleGenerate}
              disabled={loading || !text.trim() || charCount > MAX_CHARS}
              className="w-full h-12 text-base font-semibold gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Generando audio...</>
              ) : (
                <><Volume2 size={18} /> Generar Voz</>
              )}
            </Button>

            {/* Audio player */}
            {audioBase64 && (
              <div className="rounded-2xl border bg-gradient-to-br from-purple-500/5 to-pink-500/5 p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow">
                    <Volume2 className="text-white" size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Audio generado</p>
                    <p className="text-xs text-muted-foreground">{VOICES.find(v => v.value === voice)?.label}</p>
                  </div>
                </div>

                {/* Native audio element (hidden, controlled via buttons) */}
                <audio
                  ref={audioRef}
                  src={`data:audio/mp3;base64,${audioBase64}`}
                  onEnded={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full"
                  controls
                />

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={handleDownload}
                  >
                    <Download size={16} /> Descargar MP3
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                    title="Reiniciar"
                  >
                    <RotateCcw size={16} />
                  </Button>
                </div>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
