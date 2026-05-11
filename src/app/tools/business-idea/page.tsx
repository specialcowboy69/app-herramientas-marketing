import { Metadata } from 'next';
import { ToolView } from '@/components/tools/ToolView';
import { ToolSEOContent } from '@/components/seo/ToolSEOContent';
import { businessIdeaSEO } from '@/data/seo-content/business-idea';

export const metadata: Metadata = {
  title: "Generador de Ideas de Negocio con IA | Copia Niches",
  description: businessIdeaSEO.hero.description,
  alternates: {
    canonical: 'https://copianiches.com/tools/business-idea',
  }
};

export default function BusinessIdeaPage() {
  return (
    <ToolView 
      title="Ideas de Negocio"
      description="Genera ideas de negocio innovadoras basadas en tus habilidades e intereses."
      toolSlug="business-idea"
      initialValues={{
        interests: '',
        skills: '',
        experience: '',
        targetAudience: '',
        problemsToSolve: '',
        businessType: 'digital_product',
      }}
      fields={[
        { name: 'interests', label: 'Intereses', type: 'text', placeholder: 'Ej: Tecnología, Cocina, Viajes' },
        { name: 'skills', label: 'Habilidades', type: 'text', placeholder: 'Ej: Programación, Diseño, Ventas' },
        { name: 'experience', label: 'Experiencia', type: 'textarea', placeholder: 'Cuéntanos un poco sobre tu trayectoria' },
        { name: 'targetAudience', label: 'Audiencia Objetivo', type: 'text', placeholder: '¿A quién quieres ayudar?' },
        { name: 'problemsToSolve', label: 'Problemas a resolver', type: 'textarea', placeholder: '¿Qué necesidades has detectado?' },
        { 
          name: 'businessType', 
          label: 'Tipo de Negocio', 
          type: 'select', 
          options: [
            { label: 'Producto Digital', value: 'digital_product' },
            { label: 'Servicio', value: 'service' },
            { label: 'SaaS', value: 'saas' },
            { label: 'E-commerce', value: 'ecommerce' },
            { label: 'Negocio de Contenido', value: 'content_business' },
          ]
        },
      ]}
      extraContent={
        <div className="border-t bg-background mt-12 pt-12 -mx-8 px-8 rounded-b-3xl">
          <ToolSEOContent 
            data={businessIdeaSEO} 
            toolName="Ideas de Negocio"
            toolSlug="business-idea"
          />
        </div>
      }
    />
  );
}
