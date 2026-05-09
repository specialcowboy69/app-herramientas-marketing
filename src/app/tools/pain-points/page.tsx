import { Metadata } from 'next';
import { ToolView } from '@/components/tools/ToolView';
import { ToolSEOContent } from '@/components/seo/ToolSEOContent';
import { painPointsSEO } from '@/data/seo-content/pain-points';

export const metadata: Metadata = {
  title: "Generador de Puntos de Dolor con IA | Copia Niches",
  description: painPointsSEO.hero.description,
  alternates: {
    canonical: 'https://copianiches.com/tools/pain-points',
  }
};

export default function PainPointsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: painPointsSEO.faqs.map(faq => ({
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
        title="Puntos de Dolor"
        description="Identifica los problemas y frustraciones de tu audiencia."
        toolSlug="pain-points"
        initialValues={{
          niche: '',
          productOrService: '',
          targetCustomer: '',
        }}
        fields={[
          { name: 'niche', label: 'Nicho', type: 'text', placeholder: 'Ej: Marketing Digital' },
          { name: 'productOrService', label: 'Producto/Servicio', type: 'text', placeholder: '¿Qué ofreces?' },
          { name: 'targetCustomer', label: 'Cliente Objetivo', type: 'text', placeholder: '¿A quién investigamos?' },
        ]}
      />
      <div className="border-t bg-background">
        <ToolSEOContent data={painPointsSEO} />
      </div>
    </>
  );
}
