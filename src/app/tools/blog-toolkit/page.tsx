import { Metadata } from 'next';
import { ToolView } from '@/components/tools/ToolView';
import { ToolSEOContent } from '@/components/seo/ToolSEOContent';
import { blogToolkitSEO } from '@/data/seo-content/blog-toolkit';

export const metadata: Metadata = {
  title: "Creador de Artículos de Blog con IA | Copia Niches",
  description: blogToolkitSEO.hero.description,
  alternates: {
    canonical: 'https://copianiches.com/tools/blog-toolkit',
  }
};

export default function BlogToolkitPage() {
  return (
    <>
      <ToolView 
        title="Creador de Artículos"
        description="Genera borradores completos y títulos para tu blog."
        toolSlug="blog-toolkit"
        initialValues={{
          topic: '',
          primaryKeyword: '',
          audience: '',
          articleGoal: '',
          desiredLength: 'medium',
        }}
        fields={[
          { name: 'topic', label: 'Tema del artículo', type: 'text' },
          { name: 'primaryKeyword', label: 'Palabra Clave', type: 'text' },
          { name: 'audience', label: 'Audiencia', type: 'text' },
          { name: 'articleGoal', label: 'Objetivo del artículo', type: 'textarea' },
          { 
            name: 'desiredLength', 
            label: 'Longitud', 
            type: 'select',
            options: [
              { label: 'Corto (500 palabras)', value: 'short' },
              { label: 'Medio (1000 palabras)', value: 'medium' },
              { label: 'Largo (+1500 palabras)', value: 'long' },
            ]
          },
        ]}
      />
      <div className="border-t bg-background">
        <ToolSEOContent 
          data={blogToolkitSEO} 
          toolName="Creador de Artículos"
          toolSlug="blog-toolkit"
        />
      </div>
    </>
  );
}
