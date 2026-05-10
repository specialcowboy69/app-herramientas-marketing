'use client';

import { Shell } from '@/components/layout/Shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/firebase/auth-context';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { deleteUser } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';

export default function SettingsPage() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isManaging, setIsManaging] = useState(false);

  // Determinar si es premium
  const isPremium = userData?.subscriptionStatus === 'active';

  const handleManageSubscription = async () => {
    if (!userData?.stripeCustomerId) return;
    setIsManaging(true);
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stripeCustomerId: userData.stripeCustomerId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error);
      }
    } catch (e) {
      console.error(e);
      alert('Error abriendo el portal de pagos.');
    } finally {
      setIsManaging(false);
    }
  };

  const handleDeleteAccount = async () => {
    // unchanged down to return
    if (!user || !auth.currentUser) return;
    
    const confirmed = window.confirm(
      "¿Estás seguro de que quieres eliminar tu cuenta? Esta acción NO se puede deshacer y perderás todos tus proyectos, favoritos y datos guardados."
    );
    
    if (!confirmed) return;
    
    setIsDeleting(true);
    try {
      await deleteUser(auth.currentUser);
      router.push('/');
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/requires-recent-login') {
        alert("Por seguridad, debes cerrar sesión y volver a iniciarla antes de poder eliminar tu cuenta.");
      } else {
        alert("Hubo un error al eliminar tu cuenta. Contacta a soporte.");
      }
      setIsDeleting(false);
    }
  };

  return (
    <Shell>
      <div className="space-y-12">
        <div className="flex flex-col gap-3">
          <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Configuración
          </h2>
          <p className="text-lg text-muted-foreground/80 max-w-2xl leading-relaxed">
            Personaliza tu experiencia y gestiona tu suscripción premium.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* User Info & Subscription */}
          <div className="lg:col-span-7 space-y-8">
            <Card className="overflow-hidden border-white/5 bg-white/5 shadow-2xl shadow-primary/5">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-bold">Perfil de Usuario</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Nombre Completo</label>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-lg font-medium">
                      {user?.displayName || 'Invitado'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Correo Electrónico</label>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-lg font-medium truncate">
                      {user?.email}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 block">Estado de la Suscripción</label>
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-full text-xs font-black tracking-widest ${isPremium ? 'bg-emerald-500/20 text-emerald-500' : 'bg-primary/20 text-primary'}`}>
                      {isPremium ? 'ACTIVA - PREMIUM' : 'CUENTA GRATUITA'}
                    </div>
                    <div className="flex-1 text-sm text-muted-foreground">
                      {isPremium 
                        ? 'Tienes acceso ilimitado a todos los agentes y herramientas de marketing.' 
                        : 'Actualiza a Premium para desbloquear el generador de blogs y análisis SEO avanzado.'}
                    </div>
                    {isPremium ? (
                      <Button variant="outline" className="rounded-2xl border-white/10 hover:bg-white/5" onClick={handleManageSubscription} disabled={isManaging}>
                        {isManaging ? 'Cargando...' : 'Gestionar Pagos'}
                      </Button>
                    ) : (
                      <Button className="rounded-2xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" onClick={() => router.push('/pricing')}>
                        Mejorar Plan
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dangerous Zone */}
          <div className="lg:col-span-5">
            <Card className="overflow-hidden border-destructive/10 bg-destructive/5 shadow-2xl shadow-destructive/5">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-bold text-destructive">Zona de Peligro</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                <p className="text-base text-muted-foreground leading-relaxed">
                  Al eliminar tu cuenta se borrarán permanentemente todos tus proyectos, borradores y configuraciones. Esta acción no se puede deshacer.
                </p>
                <Button 
                  variant="destructive" 
                  className="w-full h-14 rounded-2xl font-bold text-lg"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Procesando...' : 'Eliminar Cuenta Definitivamente'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}
