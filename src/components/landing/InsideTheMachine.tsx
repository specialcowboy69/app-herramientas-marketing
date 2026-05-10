'use client';

import { useState } from 'react';
import { 
  Brain, 
  Database, 
  Workflow, 
  Code, 
  Eye, 
  Zap, 
  ArrowRight, 
  Package, 
  UserCircle2, 
  Sparkles, 
  CheckCircle2,
  Terminal,
  Cpu,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function InsideTheMachine() {
  const [viewMode, setViewMode] = useState<'marketer' | 'developer'>('marketer');

  return (
    <section className="py-24 px-6 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            No es solo Inteligencia Artificial. <br />
            <span className="text-primary">Es una Agencia con Memoria.</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Mientras otros olvidan quién eres en cada mensaje, nosotros construimos el cerebro de tu marca paso a paso.
          </p>

          {/* Perspective Toggle */}
          <div className="inline-flex p-1 bg-muted rounded-full border border-border shadow-inner mt-8">
            <button
              onClick={() => setViewMode('marketer')}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2",
                viewMode === 'marketer' 
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Eye className="w-4 h-4" />
              Vista Marketer
            </button>
            <button
              onClick={() => setViewMode('developer')}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2",
                viewMode === 'developer' 
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Code className="w-4 h-4" />
              Vista Developer
            </button>
          </div>
        </div>

        {/* 3 Blocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Block 1: The Analytic Engine (System 2) */}
          <Card className="border-border/50 shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
            <CardContent className="p-0 flex flex-col h-full">
              <div className="p-6 space-y-2 border-b border-border/50 bg-muted/30">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">Motor de Orquestación</h3>
                <p className="text-sm text-muted-foreground">Razonamiento profundo antes de cada ejecución.</p>
              </div>
              
              <div className="flex-1 p-6 flex items-center justify-center min-h-[300px] bg-background/50">
                {viewMode === 'marketer' ? (
                  <div className="w-full space-y-4 animate-in fade-in zoom-in duration-500">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-primary/20 bg-primary/5">
                      <span className="text-xs font-medium">Input: "Vender curso SEO"</span>
                      <Zap className="w-4 h-4 text-primary animate-pulse" />
                    </div>
                    <div className="flex justify-center">
                      <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90" />
                    </div>
                    <div className="p-4 rounded-lg border border-border bg-card shadow-sm text-center">
                      <Brain className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <span className="text-xs block font-bold">Sistema de Razonamiento</span>
                      <span className="text-[10px] text-muted-foreground italic">Evaluando agentes disponibles...</span>
                    </div>
                    <div className="flex justify-center">
                      <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 border border-border rounded bg-muted/30 text-[10px] text-center opacity-50">Copywriter</div>
                      <div className="p-2 border border-primary/40 rounded bg-primary/5 text-[10px] text-center font-bold">SEO Specialist</div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden border border-white/10 animate-in fade-in zoom-in duration-500">
                    <div className="bg-slate-800 px-3 py-2 flex gap-1.5 border-b border-white/5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <div className="p-4 font-mono text-[11px] leading-relaxed">
                      <div className="text-purple-400">async function <span className="text-blue-400">orchestrate</span>(toolSlug) {'{'}</div>
                      <div className="pl-4 text-slate-400">const <span className="text-yellow-200">agent</span> = <span className="text-pink-400">switch</span>(toolSlug) {'{'}</div>
                      <div className="pl-8 text-slate-300">case <span className="text-green-300">'seo-brief'</span>:</div>
                      <div className="pl-12 text-slate-400">return SEOSpecialistAgent;</div>
                      <div className="pl-8 text-slate-300">case <span className="text-green-300">'ads'</span>:</div>
                      <div className="pl-12 text-slate-400">return CopywriterAgent;</div>
                      <div className="pl-4 text-slate-400">{'}'}</div>
                      <div className="pl-4 text-blue-300">return await <span className="text-slate-200">agent.generate</span>(ctx);</div>
                      <div className="text-purple-400">{'}'}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Block 2: Cumulative Memory (The Brain) */}
          <Card className="border-border/50 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <CardContent className="p-0 flex flex-col h-full">
              <div className="p-6 space-y-2 border-b border-border/50 bg-muted/30">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">Memoria Acumulativa</h3>
                <p className="text-sm text-muted-foreground">Cada interacción alimenta el contexto global.</p>
              </div>
              
              <div className="flex-1 p-6 flex items-center justify-center min-h-[300px] bg-background/50">
                {viewMode === 'marketer' ? (
                  <div className="w-full space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-muted-foreground">ANTES</span>
                        <div className="p-3 rounded border border-dashed border-border flex flex-col gap-2">
                          <div className="h-2 w-full bg-muted rounded animate-pulse" />
                          <div className="h-2 w-2/3 bg-muted rounded animate-pulse" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-primary">DESPUÉS</span>
                        <div className="p-3 rounded border border-primary/20 bg-primary/5 flex flex-col gap-2">
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5 text-primary" />
                            <div className="h-2 w-full bg-primary/20 rounded" />
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5 text-primary" />
                            <div className="h-2 w-2/3 bg-primary/20 rounded" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-card border border-border shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <UserCircle2 className="w-8 h-8 text-primary" />
                        <div>
                          <p className="text-[10px] font-bold">Avatar Consolidado</p>
                          <p className="text-[9px] text-muted-foreground italic">"Emprendedor Digital, 25-40 años"</p>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-[9px] flex justify-between"><span>Puntos de Dolor</span> <span className="font-bold">4 Detectados</span></div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="w-3/4 h-full bg-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden border border-white/10 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="bg-slate-800 px-3 py-2 flex gap-1.5 border-b border-white/5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <div className="p-4 font-mono text-[11px] leading-relaxed">
                      <div className="text-slate-400">{'{'}</div>
                      <div className="pl-4 text-blue-300">"id": <span className="text-green-300">"prod_771"</span>,</div>
                      <div className="pl-4 text-blue-300">"aiKnowledge": {'{'}</div>
                      <div className="pl-8 text-yellow-300">"lastAvatar": <span className="text-slate-300">"{'{'} ... {'}'}"</span>,</div>
                      <div className="pl-8 text-yellow-300">"painPoints": [<span className="text-green-300">"Falta de tiempo"</span>, <span className="text-green-300">"Coste alto"</span>],</div>
                      <div className="pl-8 text-yellow-300">"businessModel": <span className="text-green-300">"SaaS B2B"</span></div>
                      <div className="pl-4 text-blue-300">{'}'}</div>
                      <div className="text-slate-400">{'}'}</div>
                      <div className="mt-2 text-pink-400 italic">// Injected into every prompt payload</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Block 3: The Workflow (Chaining) */}
          <Card className="border-border/50 shadow-md hover:shadow-lg transition-shadow overflow-hidden md:col-span-2 lg:col-span-1">
            <CardContent className="p-0 flex flex-col h-full">
              <div className="p-6 space-y-2 border-b border-border/50 bg-muted/30">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <Workflow className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">Encadenamiento Inteligente</h3>
                <p className="text-sm text-muted-foreground">Flujos lógicos que escalan tu negocio.</p>
              </div>
              
              <div className="flex-1 p-8 min-h-[300px] bg-background/50 flex flex-col justify-between">
                <div className="space-y-8 relative">
                  {/* Vertical Line */}
                  <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary/50 to-muted" />
                  
                  {[
                    { step: 1, title: 'Estrategia', desc: 'Define tu Avatar Ideal', icon: UserCircle2 },
                    { step: 2, title: 'Tráfico', desc: 'Crea tu SEO Brief técnico', icon: Sparkles },
                    { step: 3, title: 'Conversión', desc: 'Genera anuncios persuasivos', icon: Zap },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                      <div className="w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-primary">PASO {item.step}</p>
                        <p className="font-bold">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-3 rounded-lg border border-primary/20 bg-primary/5 text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium">Resultados 10x más coherentes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="relative pt-8">
          <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full -z-10" />
          <div className="p-12 rounded-3xl border border-primary/20 bg-background/50 backdrop-blur-sm text-center space-y-8 shadow-2xl">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold tracking-tight">¿Listo para dejar de repetirle lo mismo a la IA?</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Únete a los +1,000 marketers que ya están construyendo activos digitales inteligentes.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="h-14 px-10 text-lg rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all group" asChild>
                <Link href="/login">
                  Crear el cerebro de mi marca <span className="font-normal opacity-70 ml-2">(Es gratis)</span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            <div className="flex justify-center items-center gap-8 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover grayscale" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">Aprobado</span> por expertos de agencias top.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
