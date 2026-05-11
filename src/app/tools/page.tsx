'use client';

import { useState } from 'react';
import { Shell } from '@/components/layout/Shell';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Wand2, 
  Users, 
  ShoppingBag, 
  Target, 
  FileText, 
  Megaphone, 
  Search, 
  PenTool, 
  MousePointer2, 
  Mic, 
  Play, 
  Video, 
  ShoppingCart, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

const categories = ["Todos", "Copywriting", "SEO", "YouTube", "Amazon", "Estrategia"];

const tools = [
  { slug: 'business-idea', title: 'Ideas de Negocio', description: 'Generador de ideas de negocio innovadoras y rentables basadas en tendencias.', icon: Wand2, category: 'Estrategia', color: 'bg-amber-50 text-amber-600' },
  { slug: 'customer-avatar', title: 'Avatar de Cliente', description: 'Define detalladamente a tu cliente ideal para campañas de marketing más precisas.', icon: Users, category: 'Estrategia', color: 'bg-indigo-50 text-indigo-600' },
  { slug: 'pain-points', title: 'Puntos de Dolor', description: 'Identifica los dolores reales de tu audiencia para conectar a un nivel emocional.', icon: Target, category: 'Estrategia', color: 'bg-rose-50 text-rose-600' },
  { slug: 'naming-slogan', title: 'Nombres y Eslóganes', description: 'Crea nombres de marca y eslóganes creativos que sean memorables para tu audiencia.', icon: FileText, category: 'Copywriting', color: 'bg-blue-50 text-blue-600' },
  { slug: 'product-description', title: 'Descripción de Producto', description: 'Copy persuasivo que resalta los beneficios únicos y aumenta el deseo de compra.', icon: ShoppingBag, category: 'Copywriting', color: 'bg-emerald-50 text-emerald-600' },
  { slug: 'amazon-product', title: 'Amazon Product', description: 'Listados de productos optimizados para el algoritmo A9 y máxima conversión en Amazon.', icon: ShoppingCart, category: 'Amazon', color: 'bg-orange-50 text-orange-600' },
  { slug: 'ads-generator', title: 'Generador de Anuncios', description: 'Crea copys de anuncios efectivos para Facebook, Google e Instagram en segundos.', icon: Megaphone, category: 'Copywriting', color: 'bg-sky-50 text-sky-600' },
  { slug: 'seo-brief', title: 'Estructura SEO', description: 'Define la arquitectura técnica y de contenido para que tus artículos dominen Google.', icon: Search, category: 'SEO', color: 'bg-violet-50 text-violet-600' },
  { slug: 'blog-toolkit', title: 'Creador de Artículos', description: 'Escribe posts completos, optimizados y listos para publicar en tu blog.', icon: PenTool, category: 'SEO', color: 'bg-purple-50 text-purple-600' },
  { slug: 'framework-pas', title: 'Framework PAS', description: 'Redacta copys basados en la estructura infalible de Problema, Agitación y Solución.', icon: MessageSquare, category: 'Copywriting', color: 'bg-pink-50 text-pink-600' },
  { slug: 'cta-generator', title: 'Llamadas a la Acción', description: 'Crea CTAs irresistibles que guíen al usuario hacia la conversión final.', icon: MousePointer2, category: 'Copywriting', color: 'bg-cyan-50 text-cyan-600' },
  { slug: 'youtube-script', title: 'Guiones YouTube', description: 'Guiones estructurados para maximizar la retención y el engagement de tus videos.', icon: Video, category: 'YouTube', color: 'bg-red-50 text-red-600' },
  { slug: 'youtube-seo', title: 'YouTube Growth', description: 'Optimiza tus títulos, descripciones y etiquetas para posicionarte en el buscador.', icon: Play, category: 'YouTube', color: 'bg-red-50 text-red-600' },
  { slug: 'text-to-speech', title: 'Texto a Voz', description: 'Convierte tus guiones en locuciones realistas con voces Neural2 profesionales.', icon: Mic, category: 'Audio', color: 'bg-slate-50 text-slate-600' },
];

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Shell requireAuth={false}>
      <div className="min-h-screen -mt-8 -mx-4 md:-mx-8 p-4 md:p-8 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Header & Search Section */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  Herramientas de IA
                  <Sparkles className="text-primary h-6 w-6" />
                </h1>
                <p className="text-slate-500 text-sm md:text-base max-w-xl">
                  Explora nuestra galería de agentes especializados diseñados para acelerar tu flujo de trabajo.
                </p>
              </div>

              <div className="relative w-full max-w-md group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Buscar herramientas..."
                  className="pl-10 h-11 bg-white border-slate-200 rounded-xl shadow-sm focus:ring-primary focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Categories Filters */}
            <div className="flex flex-wrap gap-2 pt-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`
                    px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                    ${activeCategory === category 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Herramientas */}
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool) => (
                <Link 
                  key={tool.slug} 
                  href={`/tools/${tool.slug}`}
                  className="group flex flex-col h-full bg-white border border-slate-200/60 rounded-2xl p-5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer"
                >
                  {/* Icon Box */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${tool.color || 'bg-slate-100 text-slate-600'}`}>
                    <tool.icon size={22} strokeWidth={2} />
                  </div>

                  {/* Content */}
                  <h3 className="text-base font-semibold text-slate-900 mb-1.5 group-hover:text-primary transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                    {tool.description}
                  </p>

                  <div className="mt-auto pt-4 flex items-center text-xs font-medium text-slate-400 group-hover:text-primary transition-colors">
                    <span className="uppercase tracking-wider">{tool.category}</span>
                    <div className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <Sparkles size={14} className="fill-primary text-primary" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Search size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-slate-900 font-medium">No se encontraron herramientas</p>
                <p className="text-slate-500 text-sm">Prueba con términos diferentes o cambia de categoría.</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => { setSearchQuery(''); setActiveCategory('Todos'); }}
                className="mt-2"
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
