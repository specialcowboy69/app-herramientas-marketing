import { Metadata } from 'next';
import { ToolView } from '@/components/tools/ToolView';
import { ToolSEOContent } from '@/components/seo/ToolSEOContent';
import { ctaGeneratorSEO } from '@/data/seo-content/cta-generator';

export const metadata: Metadata = {
  title: "Generador de Llamadas a la Acción (CTA) con IA | Copia Niches",
  description: ctaGeneratorSEO.hero.description,
  alternates: {
    canonical: 'https://copianiches.com/tools/cta-generator',
  }
};

export default function CtaGeneratorPage() {
  return (
    <ToolView 
      title="Llamadas a la Acción"
      description="Llamadas a la acción persuasivas para convertir."
      toolSlug="cta-generator"
      initialValues={{
        goal: '',
        channel: 'website',
        urgencyLevel: 'medium',
      }}
      fields={[
        { name: 'goal', label: '¿Qué quieres que hagan?', type: 'textarea', placeholder: 'Ej: Registrarse a la newsletter' },
        { 
          name: 'channel', 
          label: 'Canal', 
          type: 'select',
          options: [
            { label: 'Sitio Web', value: 'website' },
            { label: 'Email', value: 'email' },
            { label: 'Anuncio', value: 'ad' },
            { label: 'Redes Sociales', value: 'social' },
          ]
        },
        { 
          name: 'urgencyLevel', 
          label: 'Nivel de Urgencia', 
          type: 'select',
          options: [
            { label: 'Bajo', value: 'low' },
            { label: 'Medio', value: 'medium' },
            { label: 'Alto', value: 'high' },
          ]
        },
      ]}
      extraContent={
        <div key="seo-content" className="border-t bg-background mt-12 pt-12 -mx-8 px-8 rounded-b-3xl">
          <ToolSEOContent 
            data={ctaGeneratorSEO} 
            toolName="Llamadas a la Acción"
            toolSlug="cta-generator"
          />
        </div>
      }
    />
  );
}
