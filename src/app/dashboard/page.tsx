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
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Bienvenido, {user?.displayName || 'Emprendedor'}</h2>
          <p className="text-muted-foreground">Aquí tienes un resumen de tu actividad y progreso.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-primary/5 border-none shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
              <Rocket className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.projectsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Estrategias en marcha</p>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-none shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documentos</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.documentsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Borradores guardados</p>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-none shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Generaciones IA</CardTitle>
              <Wand2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.generationsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Ideas y copy generados</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-none shadow-sm bg-card/50">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Comienza a crear contenido ahora mismo.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Link href="/projects">
                <Button className="w-full justify-between" variant="outline">
                  <div className="flex items-center">
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-50" />
                </Button>
              </Link>
              <Link href="/tools">
                <Button className="w-full justify-between" variant="secondary">
                  <div className="flex items-center">
                    <Sparkles className="mr-2 h-4 w-4" /> Explorar Herramientas
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-50" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-card/50">
            <CardHeader>
              <CardTitle>Próximos Pasos</CardTitle>
              <CardDescription>Sugerencias basadas en tu progreso.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="text-sm font-bold">Define tu Customer Avatar</div>
                  <p className="text-xs text-muted-foreground">Tener un perfil claro ayuda a que la IA genere mejor copy.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="text-sm font-bold">Completa tu SEO Brief</div>
                  <p className="text-xs text-muted-foreground">Optimiza tu estrategia de búsqueda hoy.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
