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
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Herramientas IA</h2>
          <p className="text-muted-foreground">Selecciona una herramienta para empezar a generar contenido.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-none shadow-sm bg-card/50 hover:bg-card">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <tool.icon size={20} />
                  </div>
                  <CardTitle>{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Shell>
  );
}
