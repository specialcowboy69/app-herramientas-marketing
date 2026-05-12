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
  return (
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
      extraContent={
        <div key="seo-content" className="border-t bg-background mt-12 pt-12 -mx-8 px-8 rounded-b-3xl">
          <ToolSEOContent 
            data={painPointsSEO} 
            toolName="Puntos de Dolor"
            toolSlug="pain-points"
          />
        </div>
      }
    />
  );
}
