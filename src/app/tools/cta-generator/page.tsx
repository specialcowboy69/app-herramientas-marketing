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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ctaGeneratorSEO.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
      />
      <div className="border-t bg-background">
        <ToolSEOContent data={ctaGeneratorSEO} />
      </div>
    </>
  );
}
