import { Metadata } from 'next';
import { ToolView } from '@/components/tools/ToolView';
import { ToolSEOContent } from '@/components/seo/ToolSEOContent';
import { adsGeneratorSEO } from '@/data/seo-content/ads-generator';

export const metadata: Metadata = {
  title: "Generador de Anuncios (Ads) con IA | Copia Niches",
  description: adsGeneratorSEO.hero.description,
  alternates: {
    canonical: 'https://copianiches.com/tools/ads-generator',
  }
};

export default function AdsGeneratorPage() {
  return (
    <ToolView 
      title="Generador de Anuncios"
      description="Genera copys de anuncios efectivos para Facebook y Google."
      toolSlug="ads-generator"
      initialValues={{
        platform: 'facebook',
        productOrService: '',
        targetAudience: '',
        offer: '',
        mainProblem: '',
        cta: '',
      }}
      fields={[
        { 
          name: 'platform', 
          label: 'Plataforma', 
          type: 'select',
          options: [
            { label: 'Facebook/Instagram', value: 'facebook' },
            { label: 'Google Ads', value: 'google' },
            { label: 'LinkedIn Ads', value: 'linkedin' },
          ]
        },
        { name: 'productOrService', label: 'Producto/Servicio', type: 'text' },
        { name: 'targetAudience', label: 'Audiencia', type: 'text' },
        { name: 'offer', label: 'Oferta Especial', type: 'text' },
        { name: 'mainProblem', label: 'Problema a atacar', type: 'textarea' },
        { name: 'cta', label: 'Llamada a la acción', type: 'text' },
      ]}
      extraContent={
        <div key="seo-content" className="border-t bg-background mt-12 pt-12 -mx-8 px-8 rounded-b-3xl">
          <ToolSEOContent 
            data={adsGeneratorSEO} 
            toolName="Generador de Anuncios"
            toolSlug="ads-generator"
          />
        </div>
      }
    />
  );
}
