import { Metadata } from 'next';
import { ToolView } from '@/components/tools/ToolView';
import { ToolSEOContent } from '@/components/seo/ToolSEOContent';
import { customerAvatarSEO } from '@/data/seo-content/customer-avatar';

export const metadata: Metadata = {
  title: "Generador de Avatar de Cliente Ideal con IA | Copia Niches",
  description: customerAvatarSEO.hero.description,
  alternates: {
    canonical: 'https://copianiches.com/tools/customer-avatar',
  }
};

export default function CustomerAvatarPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: customerAvatarSEO.faqs.map(faq => ({
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
        title="Avatar de Cliente"
        description="Define a tu cliente ideal con detalle psicológico y demográfico."
        toolSlug="customer-avatar"
        initialValues={{
          productOrService: '',
          niche: '',
          customerType: '',
          mainProblem: '',
          awarenessLevel: 'unaware',
        }}
        fields={[
          { name: 'productOrService', label: 'Producto o Servicio', type: 'text', placeholder: '¿Qué vendes?' },
          { name: 'niche', label: 'Nicho', type: 'text', placeholder: 'Ej: Fitness para madres' },
          { name: 'customerType', label: 'Tipo de Cliente', type: 'text', placeholder: 'Ej: Profesionales ocupados' },
          { name: 'mainProblem', label: 'Problema Principal', type: 'textarea', placeholder: '¿Cuál es su mayor frustración?' },
          { 
            name: 'awarenessLevel', 
            label: 'Nivel de Consciencia', 
            type: 'select', 
            options: [
              { label: 'Inconsciente (Unaware)', value: 'unaware' },
              { label: 'Consciente del problema', value: 'problem_aware' },
              { label: 'Consciente de la solución', value: 'solution_aware' },
              { label: 'Consciente del producto', value: 'product_aware' },
              { label: 'Muy consciente', value: 'most_aware' },
            ]
          },
        ]}
      />
      <div className="border-t bg-background">
        <ToolSEOContent data={customerAvatarSEO} />
      </div>
    </>
  );
}
