'use client';

import { useEffect, useState } from 'react';
import { Shell } from '@/components/layout/Shell';
import { useAuth } from '@/lib/firebase/auth-context';
import { getUserProjects } from '@/lib/firebase/firestore';
import { Project } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Briefcase, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getUserProjects(user.uid)
        .then(setProjects)
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <Shell>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Tus Proyectos</h2>
            <p className="text-muted-foreground">Gestiona el contexto y las herramientas de tus negocios.</p>
          </div>
          <Button asChild>
            <Link href="/projects/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Proyecto
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border border-dashed rounded-xl bg-card">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No tienes proyectos todavía</h3>
            <p className="text-muted-foreground mb-6">Crea tu primer proyecto para empezar a generar contenido.</p>
            <Button asChild>
              <Link href="/projects/new">Crear Proyecto</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-none shadow-sm bg-card/50 hover:bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {project.name}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description || 'Sin descripción'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary uppercase font-bold tracking-wider">
                        {project.businessType?.replace('_', ' ')}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground uppercase font-bold tracking-wider">
                        {project.language}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Shell>
  );
}
