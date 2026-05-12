import { Metadata } from 'next';
import { ToolView } from '@/components/tools/ToolView';
import { ToolSEOContent } from '@/components/seo/ToolSEOContent';
import { namingSloganSEO } from '@/data/seo-content/naming-slogan';

export const metadata: Metadata = {
  title: "Generador de Nombres de Marca y Slogans con IA | Copia Niches",
  description: namingSloganSEO.hero.description,
  alternates: {
    canonical: 'https://copianiches.com/tools/naming-slogan',
  }
};

export default function NamingSloganPage() {
  return (
    <ToolView 
      title="Nombres y Eslóganes"
      description="Encuentra el nombre y eslogan perfectos para tu marca."
      toolSlug="naming-slogan"
      initialValues={{
        businessType: '',
        brandTone: 'modern',
        keywords: '',
        style: 'descriptive',
      }}
      fields={[
        { name: 'businessType', label: 'Tipo de Negocio', type: 'text' },
        { 
          name: 'brandTone', 
          label: 'Tono', 
          type: 'select',
          options: [
            { label: 'Moderno', value: 'modern' },
            { label: 'Clásico', value: 'classic' },
            { label: 'Divertido', value: 'playful' },
            { label: 'Elegante', value: 'elegant' },
          ]
        },
        { name: 'keywords', label: 'Palabras Clave', type: 'text' },
        { 
          name: 'style', 
          label: 'Estilo de Nombre', 
          type: 'select',
          options: [
            { label: 'Descriptivo', value: 'descriptive' },
            { label: 'Abstracto', value: 'abstract' },
            { label: 'Evocativo', value: 'evocative' },
            { label: 'Compuesto', value: 'compound' },
          ]
        },
      ]}
      extraContent={
        <div key="seo-content" className="border-t bg-background mt-12 pt-12 -mx-8 px-8 rounded-b-3xl">
          <ToolSEOContent 
            data={namingSloganSEO} 
            toolName="Nombres y Eslóganes"
            toolSlug="naming-slogan"
          />
        </div>
      }
    />
  );
}
