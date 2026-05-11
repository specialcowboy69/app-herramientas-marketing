'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth-context';
import { getUserProjects, getProject } from '@/lib/firebase/firestore';
import { Project } from '@/lib/types';
import { Shell } from '@/components/layout/Shell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase/client';
import { Loader2, Sparkles, Copy, Star, Plus, ArrowRight, Zap, Package, ChevronRight, BarChart3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ToolViewProps {
  title: string;
  description: string;
  toolName?: string;
  toolSlug: string;
  fields: {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'select';
    placeholder?: string;
    options?: (string | { label: string; value: string })[];
    required?: boolean;
  }[];
  initialValues: Record<string, string>;
  extraContent?: React.ReactNode;
}

export function ToolView({ title, description, toolSlug, fields, initialValues, extraContent }: ToolViewProps) {
  const { user, userData } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(searchParams.get('projectId') || '');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState(initialValues);
  const [result, setResult] = useState<any>(null);
  const [lastGenerationId, setLastGenerationId] = useState<string | null>(null);
  const [favoritedItems, setFavoritedItems] = useState<Set<string>>(new Set());

  // Tool Chaining: Pre-fill context if exists in URL
  useEffect(() => {
    const context = searchParams.get('inheritedContext');
    if (context) {
      // Find the first textarea or the field that is likely the main input
      const mainField = fields.find(f => f.type === 'textarea') || fields[0];
      if (mainField) {
        setFormData(prev => ({
          ...prev,
          [mainField.name]: context
        }));
      }
    }
  }, [searchParams, fields]);

  const isPremium = userData?.subscriptionStatus === 'active';
  const today = new Date().toISOString().split('T')[0];
  const isLimitReached = !isPremium && 
    userData?.lastGenerationDate === today && 
    (userData?.dailyGenerationsCount || 0) >= 5;

  const freeUsesLeft = !isPremium ? Math.max(0, 5 - (userData?.lastGenerationDate === today ? (userData?.dailyGenerationsCount || 0) : 0)) : null;

  useEffect(() => {
    if (user) {
      setLoading(true);
      getUserProjects(user.uid).then((data) => {
        setProjects(data);
        if (!selectedProjectId && data.length > 0) {
          setSelectedProjectId(data[0].id);
        }
        setLoading(false);
      });
    }
  }, [user]);

  // Reset selected product when project changes
  useEffect(() => {
    setSelectedProductId('');
  }, [selectedProjectId]);

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const hasProducts = selectedProject?.products && Object.keys(selectedProject.products).length > 0;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && !selectedProjectId) {
      toast.error('Por favor selecciona un proyecto');
      return;
    }
    
    // Front-end check for premium/limits
    if (user && isLimitReached) {
      toast.error('Has alcanzado límite diario gratuito. Suscríbete para continuar.');
      return;
    }

    setGenerating(true);
    // ... remaining generate code
    try {
      const idToken = user ? await auth.currentUser?.getIdToken() : undefined;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (idToken) headers['Authorization'] = `Bearer ${idToken}`;
      
      const response = await fetch('/api/tools/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          projectId: user && selectedProjectId ? selectedProjectId : 'anonymous',
          productId: selectedProductId,
          toolSlug,
          input: formData,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setResult(data.output);
      setLastGenerationId(data.generationId);
      setFavoritedItems(new Set());
      toast.success('Contenido generado con éxito');
    } catch (error: any) {
      toast.error('Error al generar: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };

  const saveAsFavorite = async (itemPayload: any, itemId: string) => {
    if (!user) {
      toast.error('Debes iniciar sesión para guardar favoritos');
      return;
    }
    
    try {
      const response = await fetch('/api/generations/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`,
        },
        body: JSON.stringify({ 
          toolSlug, 
          outputPayload: itemPayload,
          projectId: selectedProjectId 
        }),
      });
      
      if (response.ok) {
        setFavoritedItems(prev => new Set(prev).add(itemId));
        toast.success('Añadido a favoritos');
      }
    } catch (error) {
      toast.error('Error al guardar favorito');
    }
  };

  const saveAsDocument = async (title: string, content: string) => {
    if (!selectedProjectId) return;
    try {
      const response = await fetch(`/api/projects/${selectedProjectId}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`,
        },
        body: JSON.stringify({ title, content }),
      });
      if (response.ok) {
        toast.success('Guardado en el proyecto');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Error del servidor');
      }
    } catch (error: any) {
      toast.error('Error al guardar: ' + error.message);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado al portapapeles');
  };

  return (
    <Shell requireAuth={false} extraContent={extraContent}>
      <div className="mb-8 flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/30 w-max px-4 py-2 rounded-full border border-white/5">
        <Link href="/dashboard" className="hover:text-primary flex items-center gap-1 transition-colors">
          <BarChart3 className="h-3 w-3" /> Panel
        </Link>
        <ChevronRight className="h-3 w-3 opacity-50" />
        <Link href="/tools" className="hover:text-primary transition-colors">
          Herramientas
        </Link>
        <ChevronRight className="h-3 w-3 opacity-50" />
        <span className="text-foreground font-bold">{title}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
              <CardDescription>Selecciona un proyecto y completa los campos.</CardDescription>
            </CardHeader>
            <form onSubmit={handleGenerate}>
              <CardContent className="space-y-4">
                {!user ? (
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-md text-sm text-foreground mb-4">
                    Para usar esta herramienta necesitas <Link href="/signup" className="underline font-medium text-primary">registrarte</Link> o <Link href="/login" className="underline font-medium text-primary">iniciar sesión</Link>.
                  </div>
                ) : isLimitReached ? (
                  <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-md text-sm text-foreground mb-4 flex flex-col gap-2">
                    <p className="font-bold text-destructive">Límite diario alcanzado</p>
                    <p>Has consumido tus 5 usos gratuitos diarios de herramientas IA. Suscríbete para uso ilimitado.</p>
                    <Button variant="default" size="sm" className="w-max mt-2" asChild>
                      <Link href="/pricing">Suscribirse ahora ($9.99)</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Proyecto</label>
                    <Select value={selectedProjectId || ""} onValueChange={setSelectedProjectId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un proyecto" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((p, index) => (
                          <SelectItem key={p.id || index} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {user && hasProducts && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-300">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Package className="h-3 w-3 text-primary" /> Producto/Servicio a trabajar
                    </label>
                    <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                      <SelectTrigger className="border-primary/20 bg-primary/5">
                        <SelectValue placeholder="Selecciona el producto específico" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(selectedProject.products || {}).map((p: any, index) => (
                          <SelectItem key={p.id || index} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-[10px] text-muted-foreground italic">
                      Esto aislará el contexto para que la IA se enfoque solo en este producto.
                    </p>
                  </div>
                )}

                {fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className="text-sm font-medium">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        required={field.required}
                      />
                    ) : field.type === 'select' ? (
                      <Select 
                        value={formData[field.name] || ""} 
                        onValueChange={(val) => setFormData({ ...formData, [field.name]: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={field.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((opt, index) => {
                            const value = typeof opt === 'string' ? opt : opt.value;
                            const label = typeof opt === 'string' ? opt : opt.label;
                            return (
                              <SelectItem key={value || index} value={value}>{label}</SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    ) : (
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        required={field.required}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex-col gap-2 items-stretch">
                <Button type="submit" className="w-full" disabled={generating || !user || isLimitReached || (user && !selectedProjectId) as boolean}>
                  {generating ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generando...</>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" /> Generar con IA</>
                  )}
                </Button>
                {!isPremium && user && !isLimitReached && (
                  <p className="text-xs text-center text-muted-foreground w-full">
                    Te quedan <span className="font-bold text-foreground">{freeUsesLeft} usos gratuitos</span> por hoy.
                  </p>
                )}
              </CardFooter>
            </form>
          </Card>
          
          {/* Tool Chaining: Next Steps Section (Moved to configuration column) */}
          {result && !generating && (
            <div className="p-8 rounded-3xl bg-primary/5 border border-primary/20 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-bold">Siguientes Pasos Sugeridos</h4>
                  <p className="text-sm text-muted-foreground">Potencia tus resultados usando esta información en otras herramientas.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {toolSlug === 'business-idea' && result.ideas?.[0] && (
                  <Button 
                    onClick={() => {
                      const context = `Idea: ${result.ideas[0].title}. Resumen: ${result.ideas[0].summary}`;
                      router.push(`/tools/customer-avatar?projectId=${selectedProjectId}&inheritedContext=${encodeURIComponent(context)}`);
                    }}
                    className="rounded-xl h-11 px-6 group"
                  >
                    Crear Avatar de Cliente <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}

                {toolSlug === 'customer-avatar' && result && (
                  <Button 
                    onClick={() => {
                      const context = `Avatar: ${result.avatarName}. Deseos: ${result.desires}. Frustraciones: ${result.frustrations}`;
                      router.push(`/tools/pain-points?projectId=${selectedProjectId}&inheritedContext=${encodeURIComponent(context)}`);
                    }}
                    className="rounded-xl h-11 px-6 group"
                  >
                    Descubrir Puntos de Dolor <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}

                {toolSlug === 'pain-points' && result.painPoints && (
                  <>
                    <Button 
                      onClick={() => {
                        const context = `Puntos de dolor identificados: ${result.painPoints.map((p: any) => p.painPoint).join(', ')}`;
                        router.push(`/tools/ads-generator?projectId=${selectedProjectId}&inheritedContext=${encodeURIComponent(context)}`);
                      }}
                      className="rounded-xl h-11 px-6 group"
                    >
                      Redactar Anuncios <Zap className="ml-2 h-4 w-4 text-yellow-400" />
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        const context = `Resolver estos problemas: ${result.painPoints.map((p: any) => p.painPoint).join(', ')}`;
                        router.push(`/tools/product-description?projectId=${selectedProjectId}&inheritedContext=${encodeURIComponent(context)}`);
                      }}
                      className="rounded-xl h-11 px-6 group border-primary/20 hover:bg-primary/5"
                    >
                      Crear Descripción de Producto <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </>
                )}

                {toolSlug === 'seo-brief' && result && (
                  <Button 
                    onClick={() => {
                      const context = `Brief SEO: ${result.intentSummary}. Estructura: ${result.outline?.join(', ')}`;
                      router.push(`/tools/blog-toolkit?projectId=${selectedProjectId}&inheritedContext=${encodeURIComponent(context)}`);
                    }}
                    className="rounded-xl h-11 px-6 group"
                  >
                    Redactar Artículo de Blog <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                )}

                {/* Default back button if no specific chain is defined */}
                <Button variant="ghost" onClick={() => router.push('/tools')} className="rounded-xl h-11">
                  Ver todas las herramientas
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold">Resultados</h3>
          {!result && !generating ? (
            <div className="flex flex-col items-center justify-center h-[400px] border border-dashed rounded-xl bg-muted/20 text-muted-foreground">
              <Sparkles className="h-12 w-12 mb-4 opacity-20" />
              <p>Completa el formulario para generar contenido.</p>
            </div>
          ) : generating ? (
            <div className="space-y-4">
              <Card>
                <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Display Result Logic based on toolSlug */}
              {toolSlug === 'business-idea' && result.ideas?.map((idea: any, i: number) => (
                <ResultCard 
                  key={i} 
                  title={idea.title} 
                  content={idea.summary} 
                  metadata={[
                    { label: 'Monetización', value: idea.monetizationModel },
                    { label: 'Primer Paso', value: idea.firstStep },
                    { label: 'Nota del Estratega', value: idea.strategistRationale }
                  ]} 
                  onCopy={() => copyToClipboard(JSON.stringify(idea, null, 2))}
                  onFavorite={() => saveAsFavorite(idea, `idea-${i}`)}
                  isFavorited={favoritedItems.has(`idea-${i}`)}
                  onSave={() => saveAsDocument(idea.title, idea.summary)}
                />
              ))}
              
              {toolSlug === 'customer-avatar' && result && (
                <ResultCard 
                  title={result.avatarName} 
                  content={result.goals} 
                  metadata={[
                    { label: 'Demografía', value: result.demographics },
                    { label: 'Frustraciones', value: result.frustrations },
                    { label: 'Deseos', value: result.desires },
                    { label: 'Nota del Estratega', value: result.strategistRationale }
                  ]} 
                  onCopy={() => copyToClipboard(JSON.stringify(result, null, 2))}
                  onFavorite={() => saveAsFavorite(result, 'avatar')}
                  isFavorited={favoritedItems.has('avatar')}
                  onSave={() => saveAsDocument(result.avatarName, result.goals)}
                />
              )}

              {toolSlug === 'product-description' && result && (
                <div className="space-y-4">
                  <ResultCard 
                    title="Descripción Corta" 
                    content={result.shortDescription} 
                    onCopy={() => copyToClipboard(result.shortDescription)} 
                    onFavorite={() => saveAsFavorite({ description: result.shortDescription }, 'desc-short')}
                    isFavorited={favoritedItems.has('desc-short')}
                    onSave={() => saveAsDocument(`${result.productName} - Short`, result.shortDescription)}
                  />
                  <ResultCard 
                    title="Descripción Larga" 
                    content={result.longDescription} 
                    onCopy={() => copyToClipboard(result.longDescription)} 
                    onFavorite={() => saveAsFavorite({ description: result.longDescription }, 'desc-long')}
                    isFavorited={favoritedItems.has('desc-long')}
                    onSave={() => saveAsDocument(`${result.productName} - Long`, result.longDescription)}
                  />
                  <ResultCard 
                    title="Beneficios" 
                    content={result.primaryBenefits?.join(', ')} 
                    onCopy={() => copyToClipboard(result.primaryBenefits?.join('\n'))} 
                    onFavorite={() => saveAsFavorite({ benefits: result.primaryBenefits }, 'desc-benefits')}
                    isFavorited={favoritedItems.has('desc-benefits')}
                    onSave={() => saveAsDocument(`${result.productName} - Benefits`, result.primaryBenefits?.join('\n'))}
                  />
                  {result.copywriterNote && (
                    <ResultCard 
                      title="Estrategia de Copywriting" 
                      content={result.copywriterNote} 
                      onCopy={() => copyToClipboard(result.copywriterNote)} 
                      onFavorite={() => saveAsFavorite({ note: result.copywriterNote }, 'desc-note')}
                      isFavorited={favoritedItems.has('desc-note')}
                    />
                  )}
                </div>
              )}

              {toolSlug === 'pain-points' && result.painPoints?.map((pp: any, i: number) => (
                <ResultCard 
                  key={i} 
                  title={pp.painPoint} 
                  content={pp.emotionalImpact} 
                  metadata={[
                    { label: 'Impacto Práctico', value: pp.practicalImpact },
                    { label: 'Ángulo de Venta', value: pp.messagingAngle },
                    { label: 'Nota del Estratega', value: pp.strategistRationale }
                  ]} 
                  onCopy={() => copyToClipboard(JSON.stringify(pp, null, 2))}
                  onFavorite={() => saveAsFavorite(pp, `pp-${i}`)}
                  isFavorited={favoritedItems.has(`pp-${i}`)}
                  onSave={() => saveAsDocument(pp.painPoint, pp.emotionalImpact)}
                />
              ))}

              {toolSlug === 'naming-slogan' && result.options?.map((opt: any, i: number) => (
                <ResultCard 
                  key={i} 
                  title={opt.brandName} 
                  content={opt.slogan} 
                  metadata={[
                    { label: 'Razón', value: opt.rationale },
                    { label: 'Nota del Copywriter', value: opt.copywriterNote }
                  ]} 
                  onCopy={() => copyToClipboard(`${opt.brandName}: ${opt.slogan}`)}
                  onFavorite={() => saveAsFavorite(opt, `opt-${i}`)}
                  isFavorited={favoritedItems.has(`opt-${i}`)}
                  onSave={() => saveAsDocument(opt.brandName, opt.slogan)}
                />
              ))}

              {toolSlug === 'ads-generator' && (
                <div className="space-y-4">
                  {result.headlines?.map((h: string, i: number) => (
                    <ResultCard 
                      key={i} 
                      title={`Titular ${i+1}`} 
                      content={h} 
                      onCopy={() => copyToClipboard(h)} 
                      onFavorite={() => saveAsFavorite({ headline: h }, `headline-${i}`)}
                      isFavorited={favoritedItems.has(`headline-${i}`)}
                      onSave={() => saveAsDocument(`Ad Headline ${i+1}`, h)}
                    />
                  ))}
                  {result.bodyVariants?.map((b: string, i: number) => (
                    <ResultCard 
                      key={i} 
                      title={`Cuerpo ${i+1}`} 
                      content={b} 
                      onCopy={() => copyToClipboard(b)} 
                      onFavorite={() => saveAsFavorite({ body: b }, `body-${i}`)}
                      isFavorited={favoritedItems.has(`body-${i}`)}
                      onSave={() => saveAsDocument(`Ad Body ${i+1}`, b)}
                    />
                  ))}
                  {result.copywriterNote && (
                    <ResultCard 
                      title="Estrategia de Copywriting" 
                      content={result.copywriterNote} 
                      onCopy={() => copyToClipboard(result.copywriterNote)} 
                      onFavorite={() => saveAsFavorite({ note: result.copywriterNote }, 'ad-note')}
                      isFavorited={favoritedItems.has('ad-note')}
                    />
                  )}
                </div>
              )}

              {toolSlug === 'seo-brief' && (
                <div className="space-y-4">
                  <ResultCard 
                    title="Resumen e Intención" 
                    content={result.intentSummary} 
                    metadata={[
                      { label: 'Títulos sugeridos', value: result.seoTitles?.join(' | ') },
                      { label: 'Keywords Secundarias', value: result.secondaryKeywords || 'N/A' }
                    ]} 
                    onCopy={() => copyToClipboard(JSON.stringify({ intentSummary: result.intentSummary, seoTitles: result.seoTitles }, null, 2))}
                    onFavorite={() => saveAsFavorite({ intentSummary: result.intentSummary, seoTitles: result.seoTitles }, 'seo-brief-summary')}
                    isFavorited={favoritedItems.has('seo-brief-summary')}
                    onSave={() => saveAsDocument('Resumen SEO', result.intentSummary)}
                  />
                  
                  {result.semanticEntities?.length > 0 && (
                    <ResultCard 
                      title="Entity SEO y E-E-A-T" 
                      content={`Entidades Semánticas:\n${result.semanticEntities.join(', ')}\n\n${result.eeatRecommendation || ''}`}
                      onCopy={() => copyToClipboard(`Entidades: ${result.semanticEntities?.join(', ')}\n\n${result.eeatRecommendation}`)}
                      onFavorite={() => saveAsFavorite({ entities: result.semanticEntities, eeat: result.eeatRecommendation }, 'seo-brief-entities')}
                      isFavorited={favoritedItems.has('seo-brief-entities')}
                      onSave={() => saveAsDocument('Entity SEO y EEAT', `Entidades: ${result.semanticEntities?.join(', ')}\n\n${result.eeatRecommendation}`)}
                    />
                  )}
                  
                  {result.metaDescriptions?.length > 0 && (
                    <ResultCard 
                      title="Meta Descripciones" 
                      content={result.metaDescriptions.map((desc: string, i: number) => `${i + 1}. ${desc}`).join('\n\n')} 
                      onCopy={() => copyToClipboard(result.metaDescriptions.map((desc: string, i: number) => `${i + 1}. ${desc}`).join('\n'))}
                      onFavorite={() => saveAsFavorite({ metaDescriptions: result.metaDescriptions }, 'seo-brief-meta')}
                      isFavorited={favoritedItems.has('seo-brief-meta')}
                      onSave={() => saveAsDocument('Meta Descripciones', result.metaDescriptions.map((desc: string, i: number) => `${i + 1}. ${desc}`).join('\n'))}
                    />
                  )}

                  {result.outline?.length > 0 && (
                    <ResultCard 
                      title="Estructura Sugerida (Outline)" 
                      content={result.outline.join('\n')} 
                      onCopy={() => copyToClipboard(result.outline.join('\n'))}
                      onFavorite={() => saveAsFavorite({ outline: result.outline }, 'seo-brief-outline')}
                      isFavorited={favoritedItems.has('seo-brief-outline')}
                      onSave={() => saveAsDocument('Estructura SEO', result.outline.join('\n'))}
                    />
                  )}

                  {(result.relatedQuestions?.length > 0 || result.internalLinkIdeas?.length > 0) && (
                    <ResultCard 
                      title="Preguntas y Enlaces" 
                      content={[
                        ...(result.relatedQuestions ? ['PREGUNTAS FRECUENTES (FAQS):', ...result.relatedQuestions, ''] : []),
                        ...(result.internalLinkIdeas ? ['IDEAS DE ENLACES INTERNOS:', ...result.internalLinkIdeas] : [])
                      ].join('\n')} 
                      onCopy={() => copyToClipboard([
                        ...(result.relatedQuestions ? ['PREGUNTAS FRECUENTES (FAQS):', ...result.relatedQuestions, ''] : []),
                        ...(result.internalLinkIdeas ? ['IDEAS DE ENLACES INTERNOS:', ...result.internalLinkIdeas] : [])
                      ].join('\n'))}
                      onFavorite={() => saveAsFavorite({ relatedQuestions: result.relatedQuestions, internalLinkIdeas: result.internalLinkIdeas }, 'seo-brief-links')}
                      isFavorited={favoritedItems.has('seo-brief-links')}
                      onSave={() => saveAsDocument('FAQS y Enlaces Internos', [
                        ...(result.relatedQuestions ? ['PREGUNTAS FRECUENTES (FAQS):', ...result.relatedQuestions, ''] : []),
                        ...(result.internalLinkIdeas ? ['IDEAS DE ENLACES INTERNOS:', ...result.internalLinkIdeas] : [])
                      ].join('\n'))}
                    />
                  )}
                </div>
              )}

              {toolSlug === 'blog-toolkit' && (
                <div className="space-y-4">
                  <ResultCard 
                    title={result.titles?.[0]} 
                    content={result.intro} 
                    onCopy={() => copyToClipboard(result.intro)} 
                    onFavorite={() => saveAsFavorite({ intro: result.intro, titles: result.titles }, 'blog-intro')}
                    isFavorited={favoritedItems.has('blog-intro')}
                    onSave={() => saveAsDocument(result.titles?.[0], result.intro)}
                  />
                  <ResultCard 
                    title="Borrador Completo" 
                    content={result.fullDraft} 
                    isMarkdown={true}
                    onCopy={() => copyToClipboard(result.fullDraft)} 
                    onFavorite={() => saveAsFavorite({ draft: result.fullDraft }, 'blog-draft')}
                    isFavorited={favoritedItems.has('blog-draft')}
                    onSave={() => saveAsDocument(`${result.titles?.[0]} (Draft)`, result.fullDraft)}
                  />
                  {result.seoNote && (
                    <ResultCard 
                      title="Estrategia de Posicionamiento" 
                      content={result.seoNote}
                      onCopy={() => copyToClipboard(result.seoNote)}
                    />
                  )}
                </div>
              )}

              {toolSlug === 'cta-generator' && (
                <div className="space-y-4">
                  {result.directCtas?.map((c: string, i: number) => (
                    <ResultCard 
                      key={`direct-${i}`} 
                      title="CTA Directo" 
                      content={c} 
                      onCopy={() => copyToClipboard(c)} 
                      onFavorite={() => saveAsFavorite({ cta: c }, `cta-direct-${i}`)}
                      isFavorited={favoritedItems.has(`cta-direct-${i}`)}
                      onSave={() => saveAsDocument('CTA Directo', c)}
                    />
                  ))}
                  {result.softCtas?.map((c: string, i: number) => (
                    <ResultCard 
                      key={`soft-${i}`} 
                      title="CTA Suave" 
                      content={c} 
                      onCopy={() => copyToClipboard(c)} 
                      onFavorite={() => saveAsFavorite({ cta: c }, `cta-soft-${i}`)}
                      isFavorited={favoritedItems.has(`cta-soft-${i}`)}
                      onSave={() => saveAsDocument('CTA Suave', c)}
                    />
                  ))}
                  {result.emotionalCtas?.map((c: string, i: number) => (
                    <ResultCard 
                      key={`emotional-${i}`} 
                      title="CTA Emocional" 
                      content={c} 
                      onCopy={() => copyToClipboard(c)} 
                      onFavorite={() => saveAsFavorite({ cta: c }, `cta-emotional-${i}`)}
                      isFavorited={favoritedItems.has(`cta-emotional-${i}`)}
                      onSave={() => saveAsDocument('CTA Emocional', c)}
                    />
                  ))}
                  {result.copywriterNote && (
                    <ResultCard 
                      title="Estrategia CRO" 
                      content={result.copywriterNote}
                      onCopy={() => copyToClipboard(result.copywriterNote)}
                    />
                  )}
                </div>
              )}

              {/* Generic Rendering for new tools */}
              {['amazon-product', 'framework-pas', 'youtube-script', 'youtube-seo'].includes(toolSlug) && result && (
                <div className="space-y-4">
                  {Object.entries(result).map(([key, value]: [string, any], i: number) => {
                    const title = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
                    const content = typeof value === 'string' ? value : 
                                    Array.isArray(value) ? value.join('\n') : 
                                    JSON.stringify(value, null, 2);
                    return (
                      <ResultCard 
                        key={i} 
                        title={title} 
                        content={content} 
                        isMarkdown={typeof value === 'string'}
                        onCopy={() => copyToClipboard(content)} 
                        onFavorite={() => saveAsFavorite({ [key]: value }, `${toolSlug}-${key}-${i}`)}
                        isFavorited={favoritedItems.has(`${toolSlug}-${key}-${i}`)}
                        onSave={() => saveAsDocument(`${title}`, content)}
                      />
                    );
                  })}
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}

function ResultCard({ 
  title, 
  content, 
  metadata, 
  onCopy, 
  onFavorite, 
  isFavorited,
  onSave,
  isMarkdown = false
}: { 
  title: string, 
  content: string, 
  metadata?: any[], 
  onCopy: () => void,
  onFavorite?: () => void,
  isFavorited?: boolean,
  onSave?: () => void,
  isMarkdown?: boolean
}) {
  return (
    <Card className="shadow-sm border-none bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={onCopy} title="Copiar"><Copy className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={onFavorite} title="Favorito">
            <Star className={`h-4 w-4 ${isFavorited ? 'fill-primary text-primary' : ''}`} />
          </Button>
          <Button variant="ghost" size="icon" onClick={onSave} title="Guardar en proyecto"><Plus className="h-4 w-4" /></Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isMarkdown ? (
          <div className="prose-premium">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{content}</p>
        )}
        {metadata && (
          <div className="grid gap-2 border-t pt-4">
            {metadata.map((m, j) => (
              <div key={j} className="text-xs">
                <span className="font-bold text-muted-foreground uppercase mr-2">{m.label}:</span>
                <span className="text-foreground">{m.value}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
