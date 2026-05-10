'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import { Shell } from '@/components/layout/Shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase/client';
import { Star, Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/generations/favorites', {
        headers: {
          'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`,
        },
      });
      const data = await response.json();
      setFavorites(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Error al cargar favoritos');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id: string) => {
    try {
      await fetch(`/api/generations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`,
        },
        body: JSON.stringify({ isFavorite: false }),
      });
      setFavorites(favorites.filter(f => f.id !== id));
      toast.success('Eliminado de favoritos');
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const formatKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const renderValue = (value: any) => {
    if (Array.isArray(value)) {
      return (
        <div className="space-y-4 mt-4">
          {value.map((item, i) => (
            <div key={i} className="p-5 rounded-2xl bg-muted/30 border border-border/50 space-y-3 shadow-sm">
              {typeof item === 'object' && item !== null ? (
                Object.entries(item).map(([nk, nv]) => (
                  <div key={nk} className="flex flex-col gap-1">
                    <span className="font-black text-[9px] uppercase tracking-widest text-primary/70">{formatKey(nk)}</span>
                    <span className="text-sm font-medium text-foreground leading-relaxed">{String(nv)}</span>
                  </div>
                ))
              ) : (
                <span className="text-sm font-medium text-foreground">{String(item)}</span>
              )}
            </div>
          ))}
        </div>
      );
    }
    
    if (typeof value === 'object' && value !== null) {
      return (
        <div className="space-y-4 mt-4">
          {Object.entries(value).map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1 border-l-2 border-primary/30 pl-4">
              <span className="font-black text-[9px] uppercase tracking-widest text-primary/70">{formatKey(k)}</span>
              <span className="text-sm font-medium text-foreground">{String(v)}</span>
            </div>
          ))}
        </div>
      );
    }

    const valStr = String(value);
    const isMarkdown = valStr.includes('##') || valStr.includes('**') || valStr.length > 200;

    if (isMarkdown) {
      return (
        <div className="prose-premium prose-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{valStr}</ReactMarkdown>
        </div>
      );
    }

    return valStr;
  };

  return (
    <Shell>
      <div className="space-y-12">
        <div className="flex flex-col gap-3">
          <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Mis Favoritos
          </h2>
          <p className="text-lg text-muted-foreground/80 max-w-2xl leading-relaxed">
            Tu biblioteca personal de ideas y contenido de alto impacto.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
            <p className="mt-4 text-muted-foreground animate-pulse">Cargando tu biblioteca...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 rounded-3xl border border-dashed border-white/10 bg-white/5 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
              <Star className="h-10 w-10 text-primary opacity-40" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Sin favoritos aún</h3>
            <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
              Marca con una estrella las mejores generaciones para tenerlas siempre a mano.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {favorites.map((fav) => (
              <Card key={fav.id} className="group relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl shadow-primary/5 transition-all duration-300 hover:bg-white/[0.08]">
                <CardHeader className="p-8 pb-4 flex flex-row items-start justify-between space-y-0">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Herramienta</span>
                    <CardTitle className="text-xl font-black capitalize tracking-tight">
                      {fav.toolSlug.replace(/-/g, ' ')}
                    </CardTitle>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all active:scale-95" 
                    onClick={() => removeFavorite(fav.id)}
                  >
                    <Star className="h-5 w-5 fill-primary" />
                  </Button>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                  <div className="space-y-6">
                    {Object.entries(fav.outputPayload).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] block">
                          {formatKey(key)}
                        </span>
                        <div className="p-5 rounded-2xl bg-black/20 border border-white/5 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                          {renderValue(value)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Generado el</span>
                      <span className="text-xs font-medium text-muted-foreground/40">
                        {new Date(fav.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      className="rounded-xl border-white/10 hover:bg-primary hover:text-primary-foreground hover:border-primary h-10 px-5 font-bold text-xs tracking-wider transition-all" 
                      onClick={() => {
                         let textToCopy = '';
                         const processValue = (v: any): string => {
                           if (Array.isArray(v)) return v.join('\n');
                           if (typeof v === 'object') return JSON.stringify(v, null, 2);
                           return String(v);
                         };

                         for (const [key, value] of Object.entries(fav.outputPayload)) {
                           textToCopy += `--- ${formatKey(key).toUpperCase()} ---\n${processValue(value)}\n\n`;
                         }
                         navigator.clipboard.writeText(textToCopy.trim());
                         toast.success('Contenido copiado al portapapeles');
                      }}
                    >
                      <Copy className="w-3.5 h-3.5 mr-2" /> COPIAR TODO
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Shell>
  );
}
