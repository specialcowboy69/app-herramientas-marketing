import { Metadata } from 'next';
import { ToolView } from '@/components/tools/ToolView';
import { ToolSEOContent } from '@/components/seo/ToolSEOContent';
import { productDescriptionSEO } from '@/data/seo-content/product-description';

export const metadata: Metadata = {
  title: "Generador de Descripciones de Producto con IA | Copia Niches",
  description: productDescriptionSEO.hero.description,
  alternates: {
    canonical: 'https://copianiches.com/tools/product-description',
  }
};

export default function ProductDescriptionPage() {
  return (
    <ToolView 
      title="Descripción de Producto"
      description="Crea copys persuasivos y listados de beneficios para tus productos."
      toolSlug="product-description"
      initialValues={{
        productName: '',
        category: '',
        features: '',
        benefits: '',
        targetAudience: '',
        tone: 'professional',
      }}
      fields={[
        { name: 'productName', label: 'Nombre del Producto', type: 'text' },
        { name: 'category', label: 'Categoría', type: 'text' },
        { name: 'features', label: 'Características (una por línea)', type: 'textarea' },
        { name: 'benefits', label: 'Beneficios clave', type: 'textarea' },
        { name: 'targetAudience', label: 'Audiencia', type: 'text' },
        { 
          name: 'tone', 
          label: 'Tono', 
          type: 'select', 
          options: [
            { label: 'Profesional', value: 'professional' },
            { label: 'Persuasivo', value: 'persuasive' },
            { label: 'Cercano/Amistoso', value: 'friendly' },
            { label: 'Exclusivo/Premium', value: 'premium' },
          ]
        },
      ]}
      extraContent={
        <div className="border-t bg-background mt-12 pt-12 -mx-8 px-8 rounded-b-3xl">
          <ToolSEOContent 
            data={productDescriptionSEO} 
            toolName="Descripción de Producto"
            toolSlug="product-description"
          />
        </div>
      }
    />
  );
}
