'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth-context';
import { Shell } from '@/components/layout/Shell';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase/client';
import { 
  FileText, 
  History, 
  ChevronLeft, 
  ExternalLink, 
  Loader2, 
  Sparkles,
  Settings2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [project, setProject] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [generations, setGenerations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
                      <div className="p-3 rounded-lg bg-muted/30 border cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="text-xs font-bold uppercase tracking-wider opacity-50 mb-1">{gen.toolSlug}</div>
                        <div className="text-xs line-clamp-2 text-muted-foreground">
                          {getGenerationPreview(gen.toolSlug, gen.outputPayload)}
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="uppercase tracking-wider">
                          Detalle: {gen.toolSlug.replace('-', ' ')}
                        </DialogTitle>
                        <DialogDescription>
                          Contenido generado en esta sesión.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4 space-y-4">
                        {Object.entries(gen.outputPayload || {}).map(([key, value]) => (
                          <div key={key} className="bg-muted/50 border p-4 rounded-lg">
                            <h4 className="font-bold mb-2 capitalize opacity-80 text-sm">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
