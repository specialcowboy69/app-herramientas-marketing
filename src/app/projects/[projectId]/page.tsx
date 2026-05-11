'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth-context';
import { Shell } from '@/components/layout/Shell';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { auth } from '@/lib/firebase/client';
import { 
  FileText, 
  History, 
  ChevronLeft, 
  ExternalLink, 
  Loader2, 
  Sparkles,
  Settings2,
  Plus,
  Package,
  Target,
  BrainCircuit,
  Brain,
  Zap,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [project, setProject] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [generations, setGenerations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New product form state
  const [newProductName, setNewProductName] = useState('');
  const [newProductUsp, setNewProductUsp] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (user && projectId) {
      fetchProjectData();
    }
  }, [user, projectId]);

  const fetchProjectData = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      
      const [projRes, docRes, genRes] = await Promise.all([
        fetch(`/api/projects/${projectId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`/api/projects/${projectId}/documents`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`/api/projects/${projectId}/generations`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (!projRes.ok) throw new Error('Error al cargar proyecto');

      const projData = await projRes.json();
      const docsData = await docRes.json();
      const gensData = await genRes.json();

      setProject(projData);
      setDocuments(Array.isArray(docsData) ? docsData : []);
      setGenerations(Array.isArray(gensData) ? gensData : []);
    } catch (error) {
      toast.error('Error al cargar datos del proyecto');
      router.push('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProductName || !newProductUsp) {
      toast.error('Por favor rellena todos los campos');
      return;
    }

    try {
      setIsAddingProduct(true);
      const token = await auth.currentUser?.getIdToken();
      const productId = `prod_${Math.random().toString(36).substring(2, 11)}`;
      
      const newProduct = {
        id: productId,
        name: newProductName,
        usp: newProductUsp,
        createdAt: new Date()
      };

      const updatedProducts = {
        ...(project.products || {}),
        [productId]: newProduct
      };

      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ products: updatedProducts })
      });

      if (!res.ok) throw new Error('Error al guardar el producto');

      setProject({ ...project, products: updatedProducts });
      setNewProductName('');
      setNewProductUsp('');
      setIsDialogOpen(false);
      toast.success('Producto añadido correctamente');
    } catch (error) {
      toast.error('Error al añadir producto');
    } finally {
      setIsAddingProduct(false);
    }
  };

  const formatOutputToMarkdown = (toolSlug: string, output: any) => {
    if (!output) return '';
    let markdown = `# Generación de ${toolSlug.replace('-', ' ')}\n\n`;
    
    Object.entries(output).forEach(([key, value]) => {
      const label = key.replace(/([A-Z])/g, ' $1').trim();
      markdown += `## ${label.toUpperCase()}\n\n`;
      
      if (typeof value === 'string') {
        markdown += `${value}\n\n`;
      } else if (Array.isArray(value)) {
        value.forEach((v) => {
          if (typeof v === 'object' && v !== null) {
            Object.entries(v).forEach(([nk, nv]) => {
              markdown += `**${nk}**: ${nv}\n\n`;
            });
            markdown += `---\n\n`;
          } else {
            markdown += `- ${v}\n`;
          }
        });
        markdown += '\n';
      } else if (typeof value === 'object' && value !== null) {
        Object.entries(value as any).forEach(([k, v]) => {
          markdown += `**${k}**: ${v}\n\n`;
        });
      }
    });
    
    return markdown;
  };

  const handleSaveSectionToDocuments = async (gen: any, sectionKey: string, sectionValue: any) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const markdown = formatOutputToMarkdown(gen.toolSlug, { [sectionKey]: sectionValue });
      
      const response = await fetch(`/api/projects/${projectId}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: `${gen.toolSlug} - ${sectionKey.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}`,
          content: markdown
        })
      });

      if (!response.ok) throw new Error('Error al guardar documento');
      
      const newDoc = await response.json();
      setDocuments([newDoc, ...documents]);
      toast.success('Sección guardada en Documentos correctamente');
    } catch (error) {
      toast.error('Error al guardar documento');
    }
  };

  const handleToggleSectionFavorite = async (gen: any, sectionKey: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const currentFavorites = gen.favoriteSections || {};
      const newStatus = !currentFavorites[sectionKey];
      const newFavorites = { ...currentFavorites, [sectionKey]: newStatus };
      
      const response = await fetch(`/api/generations/${gen.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ favoriteSections: newFavorites })
      });

      if (!response.ok) throw new Error('Error al actualizar favorito');
      
      setGenerations(generations.map(g => g.id === gen.id ? { ...g, favoriteSections: newFavorites } : g));
      toast.success(newStatus ? 'Sección añadida a favoritos' : 'Sección quitada de favoritos');
    } catch (error) {
      toast.error('Error al actualizar favorito');
    }
  };

  const getGenerationPreview = (toolSlug: string, output: any) => {
    if (!output) return 'Generación sin contenido';
    
    switch (toolSlug) {
      case 'business-idea':
        return output.ideas?.[0]?.title || 'Ideas de negocio generadas';
      case 'customer-avatar':
        return output.avatarName || 'Avatar de cliente';
      case 'product-description':
        return output.shortDescription || 'Descripción de producto';
      case 'pain-points':
        return output.painPoints?.[0]?.painPoint || 'Puntos de dolor identificados';
      case 'naming-slogan':
        return output.options?.[0]?.brandName || 'Nombres y slogans';
      case 'ads-generator':
        return output.headlines?.[0] || 'Anuncios generados';
      case 'seo-brief':
        return output.intentSummary || 'Brief SEO';
      case 'blog-toolkit':
        return output.titles?.[0] || 'Contenido para blog';
      case 'cta-generator':
        return output.directCtas?.[0] || 'CTAs generados';
      default:
        if (typeof output === 'string') return output;
        const firstValue = Object.values(output)[0];
        return typeof firstValue === 'string' ? firstValue : 'Generación completada';
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <Shell>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/projects')}><ChevronLeft /></Button>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{project?.name}</h2>
              <p className="text-muted-foreground">{project?.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/tools?projectId=${projectId}`}>
              <Button variant="outline"><Sparkles className="mr-2 h-4 w-4" /> Nueva Generación</Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="assets" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 gap-4 mb-20 bg-transparent h-24 p-0 border-none">
            <TabsTrigger 
              value="assets" 
              className="h-24 rounded-3xl border border-white/10 bg-card/50 backdrop-blur-md data-[state=active]:bg-card/80 data-[state=active]:border-white/20 data-[state=active]:ring-2 data-[state=active]:ring-primary/20 transition-all duration-300 hover:scale-[1.05] group flex items-center justify-start px-6 gap-6 text-left shadow-lg hover:shadow-primary/5 overflow-hidden"
            >
              <div className="p-4 rounded-2xl bg-muted/50 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all duration-300">
                <History className="h-8 w-8" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight">Contenido e Historial</span>
                <span className="text-xs text-muted-foreground font-medium">Gestiona tus textos y archivos generados</span>
              </div>
            </TabsTrigger>

            <TabsTrigger 
              value="products" 
              className="h-24 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-xl shadow-indigo-500/20 data-[state=active]:ring-4 data-[state=active]:ring-indigo-500/30 transition-all duration-300 hover:scale-[1.05] hover:brightness-110 group flex items-center justify-start px-6 gap-6 text-left relative overflow-hidden"
            >
              <div className="p-4 rounded-2xl bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                <Brain className="h-8 w-8" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xl font-bold tracking-tight">Cerebro del Proyecto</span>
                <span className="text-indigo-100 text-xs font-medium">Configura la inteligencia de tu marca</span>
              </div>
              {/* Subtle background glow effect */}
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assets" className="space-y-6 outline-none">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-none shadow-sm bg-card/50 h-fit">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Documentos</CardTitle>
                    <CardDescription>Borradores y contenido editado.</CardDescription>
                  </div>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {documents.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-lg">
                      No hay documentos.
                    </div>
                  ) : (
                    documents.map((doc) => (
                      <Link key={doc.id} href={`/projects/${projectId}/editor/${doc.id}`}>
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors border border-transparent hover:border-border">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">{doc.title}</span>
                          </div>
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </Link>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-card/50 h-fit">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Historial de IA</CardTitle>
                    <CardDescription>Generaciones recientes.</CardDescription>
                  </div>
                  <History className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {generations.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-lg">
                      Aún no has generado contenido.
                    </div>
                  ) : (
                    generations.slice(0, 5).map((gen) => (
                      <Dialog key={gen.id}>
                        <DialogTrigger asChild>
                          <div className="p-3 rounded-lg bg-muted/30 border cursor-pointer hover:bg-muted/50 transition-colors relative group">
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-xs font-bold uppercase tracking-wider opacity-50">{gen.toolSlug}</div>
                              {Object.values(gen.favoriteSections || {}).some(Boolean) && <Star className="h-3 w-3 fill-amber-500 text-amber-500" />}
                            </div>
                            <div className="text-xs line-clamp-2 text-muted-foreground">
                              {getGenerationPreview(gen.toolSlug, gen.outputPayload)}
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
                          <DialogHeader className="p-6 pb-2">
                            <div className="flex items-center justify-between w-full pr-8">
                              <div>
                                <DialogTitle className="uppercase tracking-wider">
                                  Detalle: {gen.toolSlug.replace('-', ' ')}
                                </DialogTitle>
                                <DialogDescription>
                                  Contenido generado en esta sesión.
                                </DialogDescription>
                              </div>
                            </div>
                          </DialogHeader>
                          <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-4">
                            {Object.entries(gen.outputPayload || {}).map(([key, value]) => {
                              const valStr = typeof value === 'string' ? value : '';
                              const isMarkdown = valStr.includes('##') || valStr.includes('**') || valStr.length > 200;

                              const isSectionFavorite = gen.favoriteSections?.[key];

                              return (
                                <div key={key} className="bg-muted/30 border border-white/5 p-5 rounded-2xl group relative">
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-black capitalize text-[10px] tracking-[0.2em] text-primary uppercase">
                                      {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </h4>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => handleToggleSectionFavorite(gen, key)}
                                        className={`h-8 px-2 ${isSectionFavorite ? 'bg-amber-500/10 border-amber-500/50 text-amber-600 hover:bg-amber-500/20' : 'text-muted-foreground hover:text-foreground'}`}
                                      >
                                        <Star className={`h-4 w-4 ${isSectionFavorite ? 'fill-current' : ''}`} />
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => handleSaveSectionToDocuments(gen, key, value)}
                                        className="h-8 px-2 text-muted-foreground hover:text-foreground"
                                      >
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  {typeof value === 'string' ? (
                                    isMarkdown ? (
                                      <div className="prose-premium prose-sm">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
                                      </div>
                                    ) : (
                                      <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground/80">{value}</p>
                                    )
                                  ) : Array.isArray(value) ? (
                                    <div className="space-y-4">
                                      {value.map((v, i) => (
                                        <div key={i} className="p-5 rounded-2xl bg-muted/40 border border-border/50 space-y-3 shadow-sm">
                                          {typeof v === 'object' && v !== null ? (
                                            Object.entries(v).map(([nk, nv]) => (
                                              <div key={nk} className="flex flex-col gap-1">
                                                <span className="font-black text-[9px] uppercase tracking-widest text-primary/70">
                                                  {nk.replace(/([A-Z])/g, ' $1').trim()}
                                                </span>
                                                <span className="text-sm font-medium text-foreground leading-relaxed">
                                                  {String(nv)}
                                                </span>
                                              </div>
                                            ))
                                          ) : (
                                            <span className="text-sm font-medium text-foreground">{String(v)}</span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="space-y-4">
                                      {Object.entries(value as any).map(([k, v]) => (
                                        <div key={k} className="flex flex-col gap-1 border-l-2 border-primary/30 pl-4">
                                          <span className="font-black text-[9px] uppercase tracking-widest text-primary/70">
                                            {k.replace(/([A-Z])/g, ' $1').trim()}
                                          </span>
                                          <span className="text-sm font-medium text-foreground">
                                            {String(v)}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6 outline-none">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xl font-bold">Gestión de Productos y Servicios</h3>
                <p className="text-sm text-muted-foreground">Define sub-entidades para evitar la contaminación de contexto en la IA.</p>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-xl shadow-primary/20 shadow-lg">
                    <Plus className="h-4 w-4 mr-2" /> Añadir Producto
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] rounded-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Nuevo Producto/Servicio</DialogTitle>
                    <DialogDescription>
                      Define un producto específico dentro de tu marca para que la IA sepa exactamente qué vender.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest opacity-70">Nombre del Producto</Label>
                      <Input 
                        id="name" 
                        placeholder="Ej: Curso de Marketing para Expertos" 
                        value={newProductName}
                        onChange={(e) => setNewProductName(e.target.value)}
                        className="rounded-xl bg-muted/50 border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="usp" className="text-xs font-bold uppercase tracking-widest opacity-70">Propuesta Única de Valor (USP)</Label>
                      <Textarea 
                        id="usp" 
                        placeholder="¿Qué lo hace único y por qué deberían comprarlo?" 
                        value={newProductUsp}
                        onChange={(e) => setNewProductUsp(e.target.value)}
                        className="rounded-xl bg-muted/50 border-white/10 min-h-[100px]"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={handleAddProduct} 
                      disabled={isAddingProduct}
                      className="w-full rounded-xl h-12 text-lg font-bold"
                    >
                      {isAddingProduct ? <Loader2 className="animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
                      Guardar Producto
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Object.values(project?.products || {}).length === 0 ? (
                <div className="col-span-full py-12 flex flex-col items-center justify-center bg-muted/20 border border-dashed rounded-3xl text-muted-foreground">
                  <Package className="h-12 w-12 mb-4 opacity-20" />
                  <p className="font-medium text-lg">No hay productos definidos todavía</p>
                  <p className="text-sm">Añade tu primer producto para empezar a aislar el contexto.</p>
                </div>
              ) : (
                Object.values(project.products as any).map((prod: any) => (
                  <Card key={prod.id} className="border border-white/5 bg-card/50 rounded-3xl overflow-hidden hover:border-primary/30 transition-all group">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                          <Package className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-tighter opacity-40">ID: {prod.id}</span>
                      </div>
                      <CardTitle className="mt-3 group-hover:text-primary transition-colors">{prod.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                          <Target className="h-3 w-3" /> Propuesta de Valor
                        </span>
                        <p className="text-sm line-clamp-3 leading-relaxed text-foreground/80">{prod.usp}</p>
                      </div>
                      
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex gap-1">
                          <div className={`h-2 w-2 rounded-full ${prod.aiKnowledge ? 'bg-green-500' : 'bg-muted-foreground/30'}`} />
                          <span className="text-[10px] font-medium opacity-60">
                            {prod.aiKnowledge ? 'Conocimiento IA disponible' : 'Sin datos de IA'}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 text-xs rounded-lg hover:bg-primary/10 hover:text-primary">
                          Configurar <ChevronLeft className="h-3 w-3 rotate-180 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
}
