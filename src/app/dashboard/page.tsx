'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import { Shell } from '@/components/layout/Shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase/client';
import { 
  Rocket, 
  FileText, 
  Wand2, 
  Star, 
  Plus, 
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    projectsCount: 0,
    documentsCount: 0,
    generationsCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch('/api/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <div className="space-y-12">
        <div className="flex flex-col gap-3">
          <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Bienvenido, {user?.displayName?.split(' ')[0] || 'Emprendedor'} ✨
          </h2>
          <p className="text-lg text-muted-foreground/80 max-w-2xl">
            Tu centro de mando para la creación de contenido inteligente.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Proyectos Activos', value: stats.projectsCount, icon: Rocket, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Documentos', value: stats.documentsCount, icon: FileText, color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { label: 'Generaciones IA', value: stats.generationsCount, icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          ].map((stat, i) => (
            <Card key={i} className="relative overflow-hidden border-white/5 bg-white/5 shadow-2xl shadow-primary/5">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    <div className="text-4xl font-black">{stat.value}</div>
                  </div>
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-inner`}>
                    <stat.icon size={28} strokeWidth={1.5} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Actions - Bento Large */}
          <Card className="lg:col-span-8 overflow-hidden border-white/5 bg-white/5 shadow-2xl shadow-primary/5">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-2xl font-bold">Acciones Rápidas</CardTitle>
              <CardDescription className="text-base text-muted-foreground/70">Lanza tu próxima campaña en segundos.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/projects" className="group">
                <div className="h-full p-6 rounded-3xl border border-white/5 bg-white/5 hover:bg-primary/10 transition-all duration-300 group-hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Plus size={24} />
                  </div>
                  <h4 className="text-lg font-bold mb-2">Nuevo Proyecto</h4>
                  <p className="text-sm text-muted-foreground/70">Inicia una nueva estrategia de contenido desde cero.</p>
                </div>
              </Link>
              <Link href="/tools" className="group">
                <div className="h-full p-6 rounded-3xl border border-white/5 bg-white/5 hover:bg-secondary/10 transition-all duration-300 group-hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/20 text-secondary-foreground flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Wand2 size={24} />
                  </div>
                  <h4 className="text-lg font-bold mb-2">Explorar Herramientas</h4>
                  <p className="text-sm text-muted-foreground/70">Usa nuestros agentes de IA para tareas específicas.</p>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Tips - Bento Small */}
          <Card className="lg:col-span-4 overflow-hidden border-white/5 bg-white/5 shadow-2xl shadow-primary/5">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-2xl font-bold text-amber-500 flex items-center gap-2">
                <Star size={20} fill="currentColor" /> Pro-Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-bold">Define tu Avatar</p>
                  <p className="text-xs text-muted-foreground mt-1">Mejora la precisión de la IA un 40%.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-bold">SEO Briefs</p>
                  <p className="text-xs text-muted-foreground mt-1">No olvides estructurar tus artículos.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
