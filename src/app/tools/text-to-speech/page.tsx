import { Metadata } from 'next';
import { TextToSpeechView } from '@/components/tools/TextToSpeechView';
import { ToolSEOContent } from '@/components/seo/ToolSEOContent';
import { textToSpeechSEO } from '@/data/seo-content/text-to-speech';
import { Shell } from '@/components/layout/Shell';

export const metadata: Metadata = {
  title: "Generador de Texto a Voz Realista con IA | Copia Niches",
  description: textToSpeechSEO.hero.description,
  alternates: {
    canonical: 'https://copianiches.com/tools/text-to-speech',
  }
};

export default function TextToSpeechPage() {
  return (
    <Shell>
      <TextToSpeechView />
      <div className="border-t bg-background mt-16">
        <ToolSEOContent 
          data={textToSpeechSEO} 
          toolName="Generador de Texto a Voz"
          toolSlug="text-to-speech"
        />
      </div>
    </Shell>
  );
}
