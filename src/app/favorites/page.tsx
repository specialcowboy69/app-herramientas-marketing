'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import { Shell } from '@/components/layout/Shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase/client';
import { Star, Copy, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

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
      // For the MVP, we can add a simple endpoint or query Firestore directly
      // Since it's a small app, we'll implement a simple API route for this
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

  return (
    <Shell>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mis Favoritos</h2>
          <p className="text-muted-foreground">Generaciones que has marcado con estrella.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-xl opacity-50">
            <Star className="h-12 w-12 mx-auto mb-4" />
            <p>Aún no tienes favoritos.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {favorites.map((fav) => (
              <Card key={fav.id} className="bg-card/50 border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium capitalize">{fav.toolSlug.replace('-', ' ')}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => removeFavorite(fav.id)}><Star className="h-4 w-4 fill-primary text-primary" /></Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Intelligent payload renderer */}
                  <div className="space-y-2 mt-4">
                    {Object.entries(fav.outputPayload).map(([key, value]) => {
                      // Skip rendering if value is somehow an array (old full-batch favorites)
                      if (Array.isArray(value)) {
                        return (
                          <div key={key} className="text-sm">
                            <span className="font-semibold text-muted-foreground capitalize mr-2">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                            <span className="text-foreground italic">Listado generado (elimina este favorito y guarda elementos individuales)</span>
                          </div>
                        );
                      }
                      
                      return (
                        <div key={key} className="text-sm border-b border-border/50 pb-2 last:border-0">
                          <span className="font-semibold text-muted-foreground capitalize block mb-1">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className="text-foreground whitespace-pre-wrap">{String(value)}</span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-6 flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    <span>Generado el {new Date(fav.createdAt).toLocaleDateString()}</span>
                    <Button variant="outline" size="sm" className="h-8 text-xs font-semibold" onClick={() => {
                       // Format gracefully for clipboard
                       let textToCopy = '';
                       for (const [key, value] of Object.entries(fav.outputPayload)) {
                         textToCopy += `${key.toUpperCase()}:\n${value}\n\n`;
                       }
                       navigator.clipboard.writeText(textToCopy.trim());
                       toast.success('Copiado');
                    }}><Copy className="w-3 h-3 mr-2" /> COPIAR</Button>
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
