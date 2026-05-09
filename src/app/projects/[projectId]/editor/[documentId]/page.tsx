'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth-context';
import { Shell } from '@/components/layout/Shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { auth } from '@/lib/firebase/client';
import { 
  Save, 
  Sparkles, 
  ChevronLeft, 
  Loader2, 
  History, 
  Maximize2, 
  Minimize2, 
  Type,
  List
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function EditorPage() {
  const { projectId, documentId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [doc, setDoc] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [generations, setGenerations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [transforming, setTransforming] = useState(false);
  
  useEffect(() => {
    if (user && documentId) {
      fetchData();
    }
  }, [user, documentId]);

  const fetchData = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      
      const [projRes, docRes, genRes] = await Promise.all([
        fetch(`/api/projects/${projectId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`/api/projects/${projectId}/documents/${documentId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`/api/projects/${projectId}/generations`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const projData = await projRes.json();
      const docData = await docRes.json();
      const genData = await genRes.json();

      setProject(projData);
      setDoc(docData);
      setGenerations(genData);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      await fetch(`/api/projects/${projectId}/documents/${documentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: doc.title,
          content: doc.content
        })
      });
      toast.success('Guardado');
    } catch (error) {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const applyAIAction = async (action: string) => {
    setTransforming(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch('/api/ai/transform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          text: doc.content,
          action
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setDoc({ ...doc, content: doc.content + '\n\n' + data.transformedText });
      toast.success('Transformación completada');
    } catch (error: any) {
      toast.error('Error IA: ' + error.message);
    } finally {
      setTransforming(false);
    }
  };

  const insertGeneration = (payload: any) => {
    let text = '';
    if (typeof payload === 'string') {
      text = payload;
    } else if (Array.isArray(payload) && payload.every(v => typeof v === 'string')) {
      text = payload.map(v => `- ${v}`).join('\n');
    } else if (typeof payload === 'object' && payload !== null) {
      // Intentar extraer solo los valores útiles de texto en lugar de stringify
      const texts: string[] = [];
      Object.values(payload).forEach((val: any) => {
        if (typeof val === 'string') texts.push(val);
        else if (Array.isArray(val)) texts.push(...val.filter(v => typeof v === 'string'));
      });
      text = texts.length > 0 ? texts.join('\n\n') : JSON.stringify(payload, null, 2);
    } else {
      text = JSON.stringify(payload, null, 2);
    }
    
    setDoc({ ...doc, content: doc.content + '\n\n' + text });
    toast.success('Insertado en el documento');
  };

  const getGenerationPreview = (toolSlug: string, output: any) => {
    if (!output) return 'Generación sin contenido';
    switch (toolSlug) {
      case 'business-idea': return output.ideas?.[0]?.title || 'Ideas de negocio generadas';
      case 'customer-avatar': return output.avatarName || 'Avatar de cliente';
      case 'product-description': return output.shortDescription || 'Descripción de producto';
      case 'pain-points': return output.painPoints?.[0]?.painPoint || 'Puntos de dolor identificados';
      case 'naming-slogan': return output.options?.[0]?.brandName || 'Nombres y slogans';
      case 'ads-generator': return output.headlines?.[0] || 'Anuncios generados';
      case 'seo-brief': return output.intentSummary || 'Brief SEO';
      case 'blog-toolkit': return output.titles?.[0] || 'Contenido para blog';
      case 'cta-generator': return output.directCtas?.[0] || 'CTAs generados';
      default:
        if (typeof output === 'string') return output;
        const firstValue = Object.values(output)[0];
        return typeof firstValue === 'string' ? firstValue : 'Generación completada';
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <Shell>
      <div className="flex flex-col min-h-[calc(100vh-120px)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}><ChevronLeft /></Button>
            <input 
              value={doc?.title} 
              onChange={(e) => setDoc({ ...doc, title: e.target.value })}
              className="text-2xl font-bold bg-transparent border-none focus:ring-0 w-full"
            />
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Guardar
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-6 flex-1">
          <div className="col-span-12 lg:col-span-8 flex flex-col space-y-4 min-h-[600px]">
            <div className="flex gap-2 p-1 bg-muted/30 rounded-lg overflow-x-auto no-scrollbar">
              <Button variant="ghost" size="sm" onClick={() => applyAIAction('expand')} disabled={transforming} className="whitespace-nowrap">
                <Maximize2 className="mr-2 h-4 w-4" /> Expandir
              </Button>
              <Button variant="ghost" size="sm" onClick={() => applyAIAction('shorten')} disabled={transforming} className="whitespace-nowrap">
                <Minimize2 className="mr-2 h-4 w-4" /> Resumir
              </Button>
              <Button variant="ghost" size="sm" onClick={() => applyAIAction('rewrite')} disabled={transforming} className="whitespace-nowrap">
                <Type className="mr-2 h-4 w-4" /> Mejorar tono
              </Button>
              <Button variant="ghost" size="sm" onClick={() => applyAIAction('bullets')} disabled={transforming} className="whitespace-nowrap">
                <List className="mr-2 h-4 w-4" /> Bullet points
              </Button>
            </div>
            
            <div className="flex-1 bg-card rounded-xl border relative shadow-sm">
              <textarea
                value={doc?.content}
                onChange={(e) => setDoc({ ...doc, content: e.target.value })}
                className="w-full h-full p-8 bg-transparent border-none focus:ring-0 resize-none font-serif text-lg leading-relaxed overflow-y-auto"
                placeholder="Empieza a escribir..."
              />
              {transforming && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4 text-primary animate-pulse">
                    <Sparkles className="h-12 w-12" />
                    <span className="font-bold">IA trabajando...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:flex col-span-4 flex-col gap-4 h-full">
            <Tabs defaultValue="generations" className="h-full flex flex-col">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="generations"><History className="mr-2 h-4 w-4" /> Historial</TabsTrigger>
                <TabsTrigger value="context"><Sparkles className="mr-2 h-4 w-4" /> Contexto</TabsTrigger>
              </TabsList>
              
              <TabsContent value="generations" className="flex-1 overflow-y-auto pt-4 space-y-4 no-scrollbar">
                {generations.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground opacity-50 border border-dashed rounded-xl">
                    No hay generaciones previas.
                  </div>
                ) : (
                  generations.map((gen) => (
                    <Dialog key={gen.id}>
                      <DialogTrigger asChild>
                        <Card className="border-none shadow-sm bg-card/50 hover:bg-card cursor-pointer transition-colors">
                          <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-xs uppercase tracking-widest font-bold opacity-50 flex justify-between items-center">
                              {gen.toolSlug.replace('-', ' ')}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="text-xs line-clamp-3 text-muted-foreground">
                              {getGenerationPreview(gen.toolSlug, gen.outputPayload)}
                            </div>
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="uppercase tracking-wider">
                            Detalle: {gen.toolSlug.replace('-', ' ')}
                          </DialogTitle>
                          <DialogDescription>
                            Contenido generado en esta sesión. Puedes insertar secciones individuales.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-4">
                          <div className="flex justify-end">
                             <Button variant="secondary" size="sm" onClick={() => insertGeneration(gen.outputPayload)}>
                               Insertar Todo
                             </Button>
                          </div>
                          {Object.entries(gen.outputPayload || {}).map(([key, value]) => (
                            <div key={key} className="bg-muted/50 border p-4 rounded-lg relative group">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold capitalize opacity-80 text-sm">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </h4>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 px-2 text-xs" 
                                  onClick={() => insertGeneration(value)}
                                >
                                  Insertar esto
                                </Button>
                              </div>
                              {typeof value === 'string' ? (
                                <p className="text-sm whitespace-pre-wrap">{value}</p>
                              ) : Array.isArray(value) && value.every(v => typeof v === 'string') ? (
                                <ul className="list-disc pl-5 space-y-2 text-sm">
                                  {value.map((v, i) => <li key={i}>{v}</li>)}
                                </ul>
                              ) : (
                                <pre className="text-xs font-mono overflow-x-auto bg-muted p-2 rounded">
                                  {JSON.stringify(value, null, 2)}
                                </pre>
                              )}
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))
                )}
              </TabsContent>

              <TabsContent value="context" className="flex-1 overflow-y-auto pt-4">
                <Card className="border-none bg-primary/5">
                  <CardContent className="p-4 space-y-4">
                    <div className="text-sm font-bold text-primary">Contexto del Proyecto</div>
                    <p className="text-xs text-muted-foreground">La IA utiliza este contexto para todas las transformaciones.</p>
                    <div className="space-y-2">
                      <p className="text-xs"><strong>Nombre:</strong> {project?.name || 'Sin nombre'}</p>
                      <p className="text-xs"><strong>Descripción:</strong> {project?.description || 'Sin descripción'}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Shell>
  );
}
