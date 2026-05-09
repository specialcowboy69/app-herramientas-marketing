'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/layout/Shell';
import { useAuth } from '@/lib/firebase/auth-context';
import { createProject } from '@/lib/firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function NewProjectPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    businessType: '',
    targetAudience: '',
    brandTone: '',
    language: 'es',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const project = await createProject(user.uid, formData);
      toast.success('Proyecto creado correctamente');
      router.push(`/projects/${project.id}`);
    } catch (error: any) {
      toast.error('Error al crear proyecto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Nuevo Proyecto</h2>
          <p className="text-muted-foreground">Define el contexto base para tu nuevo negocio.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
              <CardDescription>Esta información ayudará a la IA a generar mejores resultados.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Proyecto</Label>
                <Input 
                  id="name" 
                  placeholder="Ej: Mi Nueva Startup" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción breve</Label>
                <Textarea 
                  id="description" 
                  placeholder="¿De qué trata tu negocio?" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessType">Tipo de Negocio</Label>
                  <Select 
                    value={formData.businessType} 
                    onValueChange={(val) => setFormData({...formData, businessType: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="digital_product">Producto Digital</SelectItem>
                      <SelectItem value="service">Servicio</SelectItem>
                      <SelectItem value="saas">SaaS</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="content_business">Negocio de Contenido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select 
                    value={formData.language} 
                    onValueChange={(val) => setFormData({...formData, language: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">Inglés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Audiencia Objetivo</Label>
                <Input 
                  id="targetAudience" 
                  placeholder="Ej: Emprendedores digitales" 
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brandTone">Tono de Marca</Label>
                <Input 
                  id="brandTone" 
                  placeholder="Ej: Profesional, Persuasivo, Alegre" 
                  value={formData.brandTone}
                  onChange={(e) => setFormData({...formData, brandTone: e.target.value})}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" type="button" onClick={() => router.back()}>Cancelar</Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creando...' : 'Crear Proyecto'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </Shell>
  );
}
