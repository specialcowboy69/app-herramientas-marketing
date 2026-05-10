'use client';

import { Shell } from '@/components/layout/Shell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2, Users, ShoppingBag, Target, FileText, Megaphone, Search, PenTool, MousePointer2, Mic } from 'lucide-react';
import Link from 'next/link';

const tools = [
  { slug: 'business-idea', title: 'Ideas de Negocio', description: 'Generador de ideas de negocio', icon: Wand2 },
  { slug: 'customer-avatar', title: 'Avatar de Cliente', description: 'Define a tu cliente ideal', icon: Users },
  { slug: 'pain-points', title: 'Puntos de Dolor', description: 'Identifica dolores de tu audiencia', icon: Target },
  { slug: 'naming-slogan', title: 'Nombres y Eslóganes', description: 'Nombres y eslóganes creativos', icon: FileText },
  { slug: 'product-description', title: 'Descripción de Producto', description: 'Copy persuasivo de producto', icon: ShoppingBag },
  { slug: 'ads-generator', title: 'Generador de Anuncios', description: 'Crea anuncios para FB/Google', icon: Megaphone },
  { slug: 'seo-brief', title: 'Estructura SEO', description: 'Estructura de contenido SEO', icon: Search },
  { slug: 'blog-toolkit', title: 'Creador de Artículos', description: 'Posts completos para tu blog', icon: PenTool },
  { slug: 'cta-generator', title: 'Llamadas a la Acción', description: 'Botones y llamadas a la acción', icon: MousePointer2 },
  { slug: 'text-to-speech', title: 'Texto a Voz', description: 'Convierte texto en locuciones profesionales', icon: Mic },
];

export default function ToolsPage() {
  return (
    <Shell requireAuth={false}>
      <div className="space-y-12">
        <div className="flex flex-col gap-3">
          <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Herramientas de IA
          </h2>
          <p className="text-lg text-muted-foreground/80 max-w-2xl leading-relaxed">
            Potencia tu marketing con nuestra suite de agentes especializados. Selecciona una herramienta para comenzar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
          {tools.map((tool, index) => {
            // Diferentes anchos para efecto Bento
            const colSpan = index === 0 || index === 5 ? 'md:col-span-3 lg:col-span-6' : 
                            index === 1 || index === 2 || index === 6 || index === 7 ? 'md:col-span-3 lg:col-span-3' : 
                            'md:col-span-3 lg:col-span-4';
            
            return (
              <Link key={tool.slug} href={`/tools/${tool.slug}`} className={`${colSpan} group`}>
                <Card className="relative h-full overflow-hidden border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer">
                  {/* Gradiente de fondo al hacer hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <CardHeader className="relative z-10 p-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                      <tool.icon size={28} strokeWidth={1.5} />
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                      {tool.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed mt-2 text-muted-foreground/70">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}
