import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Wand2, 
  Zap, 
  Shield, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Target,
  Lightbulb,
  Search,
  Megaphone,
  Users,
  FileText,
  ShoppingBag,
  PenTool,
  MousePointer2,
  MessageSquare,
  Video,
  ShoppingCart,
  Play
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { InsideTheMachine } from '@/components/landing/InsideTheMachine';

const tools = [
  { slug: 'business-idea', title: 'Ideas de Negocio', description: 'Generador de ideas de negocio innovadoras y rentables.', icon: Wand2, category: 'Estrategia', color: 'bg-amber-50 text-amber-600' },
  { slug: 'customer-avatar', title: 'Avatar de Cliente', description: 'Define detalladamente a tu cliente ideal para campañas más precisas.', icon: Users, category: 'Estrategia', color: 'bg-indigo-50 text-indigo-600' },
  { slug: 'pain-points', title: 'Puntos de Dolor', description: 'Identifica los dolores reales de tu audiencia para conectar mejor.', icon: Target, category: 'Estrategia', color: 'bg-rose-50 text-rose-600' },
  { slug: 'naming-slogan', title: 'Nombres y Eslóganes', description: 'Crea nombres de marca y eslóganes creativos que impacten.', icon: FileText, category: 'Copywriting', color: 'bg-blue-50 text-blue-600' },
  { slug: 'product-description', title: 'Descripción de Producto', description: 'Copy persuasivo que resalta los beneficios de tus productos.', icon: ShoppingBag, category: 'Copywriting', color: 'bg-emerald-50 text-emerald-600' },
  { slug: 'amazon-product', title: 'Amazon Product', description: 'Listados optimizados para el algoritmo A9 de Amazon.', icon: ShoppingCart, category: 'Amazon', color: 'bg-orange-50 text-orange-600' },
  { slug: 'ads-generator', title: 'Generador de Anuncios', description: 'Crea copys de anuncios efectivos para Facebook y Google.', icon: Megaphone, category: 'Copywriting', color: 'bg-sky-50 text-sky-600' },
  { slug: 'seo-brief', title: 'Estructura SEO', description: 'Define la arquitectura de contenido para dominar Google.', icon: Search, category: 'SEO', color: 'bg-violet-50 text-violet-600' },
  { slug: 'blog-toolkit', title: 'Creador de Artículos', description: 'Escribe posts completos y optimizados en segundos.', icon: PenTool, category: 'SEO', color: 'bg-purple-50 text-purple-600' },
  { slug: 'framework-pas', title: 'Framework PAS', description: 'Copy basado en Problema, Agitación y Solución.', icon: MessageSquare, category: 'Copywriting', color: 'bg-pink-50 text-pink-600' },
  { slug: 'cta-generator', title: 'Llamadas a la Acción', description: 'Crea CTAs irresistibles que aumenten tu conversión.', icon: MousePointer2, category: 'Copywriting', color: 'bg-cyan-50 text-cyan-600' },
  { slug: 'youtube-script', title: 'Guiones YouTube', description: 'Guiones estructurados para maximizar la retención.', icon: Video, category: 'YouTube', color: 'bg-red-50 text-red-600' },
  { slug: 'youtube-seo', title: 'YouTube Growth', description: 'Optimiza tus títulos y etiquetas para crecer en YouTube.', icon: Play, category: 'YouTube', color: 'bg-red-50 text-red-600' },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      {/* GLOBAL PARALLAX BACKGROUND */}
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-background overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-500/30 blur-[120px] mix-blend-multiply opacity-60 dark:opacity-30 dark:mix-blend-normal"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/30 blur-[120px] mix-blend-multiply opacity-60 dark:opacity-30 dark:mix-blend-normal"></div>
        <div className="absolute top-[40%] left-[50%] w-[40vw] h-[40vw] rounded-full bg-emerald-500/20 blur-[120px] mix-blend-multiply opacity-60 dark:opacity-20 dark:mix-blend-normal"></div>
        
        {/* Subtle dot pattern instead of noise SVG that was 404ing */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>
      </div>
      <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <Link className="flex items-center justify-center gap-2 hover:opacity-80 transition-opacity" href="/">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <Wand2 size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">Magnificus</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors flex items-center" href="/login">
            Login
          </Link>
          <Button asChild size="sm" className="hidden sm:flex">
            <Link href="/pricing">Empezar gratis</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* ORIGINAL HERO SECTION RESTORED */}
        <section className="w-full py-8 md:py-16 lg:py-24 xl:py-36 bg-transparent">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Potencia tu negocio con IA Generativa
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Crea ideas de negocio, avatares de clientes, descripciones de productos y contenido SEO en segundos.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg" className="px-8">
                  <Link href="/pricing">Empezar ahora</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-8">
                  <Link href="/login">Saber más</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ORIGINAL TOOLS GRID RESTORED TO TOP */}
        <section className="w-full py-20 bg-[#F9FAFB] border-y" id="tools">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-slate-900">
                  Nuestras Herramientas IA
                </h2>
                <p className="max-w-[800px] text-slate-500 md:text-xl/relaxed">
                  Prueba la potencia de nuestros agentes especializados. Empieza a generar contenido que convierte en segundos.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tools.slice(0, 8).map((tool) => (
                <Link 
                  key={tool.slug} 
                  href={`/tools/${tool.slug}`}
                  className="group flex flex-col h-full bg-white border border-slate-200/60 rounded-2xl p-5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${tool.color}`}>
                    <tool.icon size={22} strokeWidth={2} />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-1.5 group-hover:text-primary transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>
                  <div className="mt-4 flex items-center text-xs font-medium text-primary opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Probar ahora <ArrowRight size={14} className="ml-1" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-slate-200 hover:bg-slate-50">
                <Link href="/tools">Ver todas las herramientas ({tools.length})</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* NEW: TECHNICAL DEEP DIVE */}
        <InsideTheMachine />

        {/* LOGOS / SOCIAL PROOF (Optional aesthetic block) */}
        <section className="w-full py-8 bg-background/20 border-y backdrop-blur-sm">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
              La herramienta secreta para miles de creadores y agencias
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
              {/* Dummy logos for aesthetic */}
              <div className="flex items-center gap-2 font-bold text-xl"><Target className="h-6 w-6"/> StartupCo</div>
              <div className="flex items-center gap-2 font-bold text-xl"><Wand2 className="h-6 w-6"/> AgencyAI</div>
              <div className="flex items-center gap-2 font-bold text-xl"><Sparkles className="h-6 w-6"/> Creators</div>
              <div className="flex items-center gap-2 font-bold text-xl"><Zap className="h-6 w-6"/> FastTech</div>
            </div>
          </div>
        </section>

        {/* FEATURE 1: PAIN POINTS (Image Left, Text Right) */}
        <section id="tools" className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="relative w-full aspect-square md:aspect-[4/3] order-2 lg:order-1 rounded-2xl overflow-hidden bg-muted/20">
                <Image 
                  src="/images/pain_points.png" 
                  alt="Análisis de Puntos de Dolor de Clientes" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-6 order-1 lg:order-2">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Descubre los Puntos de Dolor de tus Clientes
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  No vendas características, vende soluciones. Nuestra IA analiza profundamente a tu audiencia objetivo para extraer sus miedos, frustraciones y deseos más ocultos.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span>Investigación de mercado automatizada.</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span>Crea ángulos de venta hiper-persuasivos.</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span>Ideal para crear el "Customer Avatar" perfecto.</span>
                  </li>
                </ul>
                <div className="pt-4">
                  <Button asChild variant="link" className="px-0">
                    <Link href="/tools/pain-points">Probar Pain Points <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE 2: BUSINESS IDEAS (Text Left, Image Right) */}
        <section className="w-full py-16 md:py-24 bg-muted/20">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Encuentra Ideas de Negocio Rentables en Segundos
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  ¿Bloqueado sin saber qué emprender? Transforma pasiones o industrias en modelos de negocio viables, completos con estrategias de monetización y primeros pasos ejecutables.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span>Lluvia de ideas estructurada y lógica.</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span>Generación de modelos de monetización claros.</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span>Nombres creativos y eslóganes integrados.</span>
                  </li>
                </ul>
                <div className="pt-4">
                  <Button asChild variant="link" className="px-0">
                    <Link href="/tools/business-idea">Probar Ideas de Negocio <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              </div>
              <div className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-background shadow-xl">
                <Image 
                  src="/images/business_ideas.png" 
                  alt="Generador de Ideas de Negocio" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE 3: SEO CONTENT (Image Left, Text Right) */}
        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="relative w-full aspect-square md:aspect-[4/3] order-2 lg:order-1 rounded-2xl overflow-hidden bg-muted/20">
                <Image 
                  src="/images/seo_content.png" 
                  alt="Textos Optimizados para SEO y Blogging" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-6 order-1 lg:order-2">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Crea Textos y Artículos de Blog Optimizados para SEO
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Domina Google sin esfuerzo. Genera "SEO Briefs" completos para tus redactores o deja que nuestra IA escriba borradores completos y estructurados listos para rankear.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span>Genera estructuras (H1, H2, H3) listas de usar.</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span>Inclusión natural de Keywords secundarias.</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span>Multiplica el tráfico orgánico de tu producto.</span>
                  </li>
                </ul>
                <div className="pt-4">
                  <Button asChild variant="link" className="px-0">
                    <Link href="/tools/blog-toolkit">Probar SEO Blog Toolkit <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE 4: ADS & COPY (Text Left, Image Right) */}
        <section className="w-full py-16 md:py-24 bg-muted/20">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Megaphone className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Copywriting Persuasivo: Descripciones y Anuncios que Venden
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Deja de luchar con el síndrome de la página en blanco. Genera decenas de variaciones para tus Facebook Ads, Google Ads o páginas de producto en instantes.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span>Fórmulas probadas de Copywriting (AIDA, PAS).</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span>Generador de llamadas a la acción (CTAs) magnéticas.</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span>Descripciones de e-commerce centradas en beneficios.</span>
                  </li>
                </ul>
                <div className="pt-4">
                  <Button asChild variant="link" className="px-0">
                    <Link href="/tools/ads-generator">Probar Ads Generator <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              </div>
              <div className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-background shadow-xl">
                <Image 
                  src="/images/ads_copy.png" 
                  alt="Generador de Anuncios y Copywriting" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS GRID */}
        <section className="w-full py-16 md:py-24 bg-background/20 border-t">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <div className="max-w-[800px] mx-auto space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Todo lo que necesitas para tu flujo de trabajo
              </h2>
              <p className="text-muted-foreground text-lg">
                Diseñado para emprendedores, marketers y creadores que valoran su tiempo.
              </p>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group flex flex-col items-center space-y-4 rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Generación Súper Rápida</h3>
                <p className="text-muted-foreground text-center">
                  Resultados profesionales en menos de 10 segundos para cualquier herramienta gracias a Gemini Pro.
                </p>
              </div>
              <div className="group flex flex-col items-center space-y-4 rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Proyectos Organizados</h3>
                <p className="text-muted-foreground text-center">
                  Mantén todo el contexto de tus diferentes clientes o marcas en proyectos de forma segura y privada.
                </p>
              </div>
              <div className="group flex flex-col items-center space-y-4 rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Favoritos Granulares</h3>
                <p className="text-muted-foreground text-center">
                  Guarda solo las ideas, CTAs o puntos de color que más te gusten con un solo clic.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* FINAL CTA */}
        <section className="w-full py-16 md:py-24 bg-primary text-primary-foreground relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -m-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -m-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="container px-4 md:px-6 mx-auto text-center relative z-10">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Empieza a generar contenido que convierte hoy mismo.
            </h2>
            <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl mb-10">
              Únete a nosotros y descubre el poder de tener un equipo de marketing de IA trabajando para ti 24/7.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="px-8 h-12 text-base font-bold shadow-lg">
                <Link href="/pricing">Crear cuenta gratis</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 text-center border-t bg-background">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Magnificus MVP. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="#">Términos</Link>
            <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="#">Privacidad</Link>
            <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="#">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
