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
      <div className="space-y-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Tus Proyectos
            </h2>
            <p className="text-lg text-muted-foreground/80 max-w-xl">
              Gestiona el ecosistema de tus negocios y centraliza tu contenido.
            </p>
          </div>
          <Button asChild className="rounded-2xl h-12 px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            <Link href="/projects/new">
              <PlusCircle className="mr-2 h-5 w-5" />
              Nuevo Proyecto
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-56 w-full rounded-3xl bg-white/5" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 rounded-3xl border border-dashed border-white/10 bg-white/5 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
              <Briefcase className="h-10 w-10 text-primary opacity-40" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No tienes proyectos todavía</h3>
            <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
              Crea tu primer proyecto para que la IA entienda el contexto de tu negocio y genere mejores resultados.
            </p>
            <Button asChild className="rounded-2xl h-12 px-8">
              <Link href="/projects/new">Empezar Ahora</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="group">
                <Card className="h-full overflow-hidden border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer">
                  <CardHeader className="p-8">
                    <CardTitle className="text-xl font-bold flex items-center justify-between group-hover:text-primary transition-colors">
                      {project.name}
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </CardTitle>
                    <CardDescription className="text-base line-clamp-2 mt-3 leading-relaxed">
                      {project.description || 'Sin descripción estratégica definida.'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-8 pb-8">
                    <div className="flex flex-wrap gap-3">
                      <span className="text-[10px] px-3 py-1.5 rounded-full bg-primary/10 text-primary uppercase font-black tracking-widest border border-primary/10">
                        {project.businessType?.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] px-3 py-1.5 rounded-full bg-white/5 text-muted-foreground uppercase font-black tracking-widest border border-white/5">
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
