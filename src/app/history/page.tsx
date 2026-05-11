'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import { Shell } from '@/components/layout/Shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { auth } from '@/lib/firebase/client';
import { 
  Clock, 
  Copy, 
  Loader2, 
  Star, 
  Trash2, 
  Search, 
  Plus, 
  Eye,
  FileText,
  User,
  Zap,
  Target,
  PenTool,
  Hash,
  Layout,
  MessageSquare,
  X
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Icon mapping based on toolSlug
const getToolIcon = (slug: string) => {
  switch (slug) {
    case 'customer-avatar': return <User className="h-4 w-4 text-blue-500" />;
    case 'pain-points': return <Zap className="h-4 w-4 text-orange-500" />;
    case 'ads-generator': return <Target className="h-4 w-4 text-red-500" />;
    case 'product-description': return <FileText className="h-4 w-4 text-emerald-500" />;
    case 'naming-slogan': return <Hash className="h-4 w-4 text-purple-500" />;
    case 'cta-generator': return <MessageSquare className="h-4 w-4 text-pink-500" />;
    case 'seo-brief': return <Layout className="h-4 w-4 text-indigo-500" />;
    case 'blog-toolkit': return <PenTool className="h-4 w-4 text-cyan-500" />;
    default: return <Clock className="h-4 w-4 text-slate-400" />;
  }
};

export default function HistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGen, setSelectedGen] = useState<any | null>(null);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/generations/history', {
        headers: {
          'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`,
        },
      });
      const data = await response.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Error al cargar historial');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/generations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`,
        },
        body: JSON.stringify({ isFavorite: !currentStatus }),
      });
      setHistory(history.map(h => h.id === id ? { ...h, isFavorite: !currentStatus } : h));
      toast.success(!currentStatus ? 'Añadido a favoritos' : 'Eliminado de favoritos');
    } catch (error) {
      toast.error('Error al actualizar favorito');
    }
  };

  const deleteGeneration = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta generación?')) return;
    
    try {
      await fetch(`/api/generations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`,
        },
      });
      setHistory(history.filter(h => h.id !== id));
      toast.success('Generación eliminada');
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
        <div className="space-y-4 mt-2">
          {value.map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              {typeof item === 'object' && item !== null ? (
                Object.entries(item).map(([nk, nv]) => (
                  <div key={nk} className="flex flex-col">
                    <span className="font-bold text-[10px] uppercase text-slate-400">{formatKey(nk)}</span>
                    <span className="text-sm text-slate-700">{String(nv)}</span>
                  </div>
                ))
              ) : (
                <span className="text-sm text-slate-700">{String(item)}</span>
              )}
            </div>
          ))}
        </div>
      );
    }
    
    if (typeof value === 'object' && value !== null) {
      return (
        <div className="space-y-4 mt-2">
          {Object.entries(value).map(([k, v]) => (
            <div key={k} className="flex flex-col border-l-2 border-slate-200 pl-4 py-1">
              <span className="font-bold text-[10px] uppercase text-slate-400">{formatKey(k)}</span>
              <span className="text-sm text-slate-700">{String(v)}</span>
            </div>
          ))}
        </div>
      );
    }

    const valStr = String(value);
    const isMarkdown = valStr.includes('##') || valStr.includes('**') || valStr.length > 200;

    if (isMarkdown) {
      return (
        <div className="prose-premium prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{valStr}</ReactMarkdown>
        </div>
      );
    }

    return <p className="text-sm text-slate-700 whitespace-pre-wrap">{valStr}</p>;
  };

  const getPreviewText = (payload: any) => {
    if (!payload) return 'Sin contenido';
    if (typeof payload === 'string') return payload;
    const values = Object.values(payload);
    for (const val of values) {
      if (typeof val === 'string' && val.length > 10) return val;
      if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'string') return val[0];
      if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object') {
         const firstObjVal = Object.values(val[0])[0];
         if (typeof firstObjVal === 'string') return firstObjVal;
      }
    }
    return 'Ver detalles de la generación...';
  };

  const filteredHistory = history.filter(item => 
    item.toolSlug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getPreviewText(item.outputPayload).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Shell>
      <div className="min-h-screen bg-[#F9FAFB] -m-4 p-4 md:-m-8 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Mi Historial</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-200/50 text-slate-600 text-[11px] font-bold">
                  {history.length} {history.length === 1 ? 'generación' : 'generaciones'}
                </span>
              </div>
              <p className="text-slate-500 text-sm">Gestiona y revisa tus creaciones recientes.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Buscar en el historial..." 
                  className="pl-10 bg-white border-slate-200 rounded-xl focus:ring-slate-200 transition-all text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link href="/tools">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-5 flex items-center gap-2 shadow-sm transition-all active:scale-95">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Nueva Generación</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Content Section */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
              <p className="mt-4 text-slate-400 text-sm font-medium">Sincronizando con la nube...</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-6 rounded-3xl border-2 border-dashed border-slate-200 bg-white text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Historial vacío</h3>
              <p className="text-slate-500 max-w-sm mb-8 text-sm leading-relaxed">
                {searchQuery ? 'No encontramos nada que coincida con tu búsqueda.' : 'Aún no has realizado ninguna generación. ¡Empieza ahora mismo!'}
              </p>
              {!searchQuery && (
                <Link href="/tools">
                  <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50">
                    Ir a Herramientas
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHistory.map((item) => (
                <Card 
                  key={item.id} 
                  className="group relative bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
                >
                  <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                        {getToolIcon(item.toolSlug)}
                      </div>
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-tight truncate max-w-[120px]">
                        {item.toolSlug.replace(/-/g, ' ')}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                    </span>
                  </CardHeader>

                  <CardContent className="p-5 pt-0 flex-grow flex flex-col justify-between">
                    <div className="mb-6">
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-4 italic">
                        "{getPreviewText(item.outputPayload)}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100/60">
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                          onClick={() => setSelectedGen(item)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={`h-8 w-8 rounded-lg transition-colors ${item.isFavorite ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:text-amber-500 hover:bg-slate-50'}`}
                          onClick={() => toggleFavorite(item.id, item.isFavorite)}
                        >
                          <Star className={`h-4 w-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          onClick={() => deleteGeneration(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        onClick={() => {
                           let textToCopy = '';
                           const processValue = (v: any): string => {
                             if (Array.isArray(v)) return v.join('\n');
                             if (typeof v === 'object') return JSON.stringify(v, null, 2);
                             return String(v);
                           };

                           for (const [key, value] of Object.entries(item.outputPayload)) {
                             textToCopy += `${key.toUpperCase()}:\n${processValue(value)}\n\n`;
                           }
                           navigator.clipboard.writeText(textToCopy.trim());
                           toast.success('Contenido copiado');
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* View Generation Modal */}
      <Dialog open={!!selectedGen} onOpenChange={(open) => !open && setSelectedGen(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border-none shadow-2xl p-0">
          {selectedGen && (
            <div className="flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                    {getToolIcon(selectedGen.toolSlug)}
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-bold text-slate-900 capitalize">
                      {selectedGen.toolSlug.replace(/-/g, ' ')}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-400">
                      Generado el {new Date(selectedGen.createdAt).toLocaleString()}
                    </DialogDescription>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {Object.entries(selectedGen.outputPayload).map(([key, value]) => (
                  <div key={key} className="space-y-3">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                      {formatKey(key)}
                    </h4>
                    <div className="pl-3.5">
                      {renderValue(value)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 sticky bottom-0">
                <Button 
                  variant="outline" 
                  className="rounded-xl border-slate-200 text-slate-600 hover:bg-white"
                  onClick={() => setSelectedGen(null)}
                >
                  Cerrar
                </Button>
                <Button 
                  className="bg-slate-900 text-white rounded-xl hover:bg-slate-800"
                  onClick={() => {
                    let textToCopy = '';
                    const processValue = (v: any): string => {
                      if (Array.isArray(v)) return v.join('\n');
                      if (typeof v === 'object') return JSON.stringify(v, null, 2);
                      return String(v);
                    };

                    for (const [key, value] of Object.entries(selectedGen.outputPayload)) {
                      textToCopy += `${key.toUpperCase()}:\n${processValue(value)}\n\n`;
                    }
                    navigator.clipboard.writeText(textToCopy.trim());
                    toast.success('Contenido copiado');
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Todo
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Shell>
  );
}
