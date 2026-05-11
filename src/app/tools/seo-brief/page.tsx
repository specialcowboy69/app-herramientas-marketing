import { Metadata } from 'next';
import { ToolView } from '@/components/tools/ToolView';
import { ToolSEOContent } from '@/components/seo/ToolSEOContent';
import { seoBriefSEO } from '@/data/seo-content/seo-brief';

export const metadata: Metadata = {
  title: "Generador de Briefing y Estructuras SEO con IA | Copia Niches",
  description: seoBriefSEO.hero.description,
  alternates: {
    canonical: 'https://copianiches.com/tools/seo-brief',
  }
};

export default function SeoBriefPage() {
  return (
    <ToolView 
      title="Estructura SEO"
      description="Estructura tus artículos para posicionar en buscadores."
      toolSlug="seo-brief"
      initialValues={{
        primaryKeyword: '',
        secondaryKeywords: '',
        searchIntent: 'informational',
        pageType: 'blog_post',
      }}
      fields={[
        { name: 'primaryKeyword', label: 'Palabra Clave Principal', type: 'text' },
        { name: 'secondaryKeywords', label: 'Keywords Secundarias', type: 'text' },
        { 
          name: 'searchIntent', 
          label: 'Intención de Búsqueda', 
          type: 'select',
          options: [
            { label: 'Informativa', value: 'informational' },
            { label: 'Transaccional', value: 'transactional' },
            { label: 'Navegacional', value: 'navigational' },
            { label: 'Comercial', value: 'commercial' },
          ]
        },
        { name: 'pageType', label: 'Tipo de Página', type: 'text' },
      ]}
      extraContent={
        <div className="border-t bg-background mt-12 pt-12 -mx-8 px-8 rounded-b-3xl">
          <ToolSEOContent 
            data={seoBriefSEO} 
            toolName="Estructura SEO"
            toolSlug="seo-brief"
          />
        </div>
      }
    />
  );
}
