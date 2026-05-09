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
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
          <p className="text-muted-foreground">Gestiona tu perfil y preferencias.</p>
        </div>

        <Card className="max-w-xl border-none shadow-sm bg-card/50">
          <CardHeader>
            <CardTitle>Perfil de Usuario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Nombre</p>
              <p className="text-sm">{user?.displayName || 'No configurado'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Email</p>
              <p className="text-sm">{user?.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Plan</p>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold ${isPremium ? 'bg-emerald-500/20 text-emerald-600' : 'bg-primary/20 text-primary'}`}>
                  {isPremium ? 'PLAN PREMIUM' : 'PLAN GRATUITO'}
                </div>
                {isPremium ? (
                  <Button variant="outline" size="sm" onClick={handleManageSubscription} disabled={isManaging}>
                    {isManaging ? 'Cargando portal...' : 'Gestionar Suscripción'}
                  </Button>
                ) : (
                  <Button variant="default" size="sm" onClick={() => router.push('/pricing')}>
                    Subir a Premium
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="max-w-xl border-red-500/20 shadow-sm bg-destructive/5 mt-8">
          <CardHeader>
            <CardTitle className="text-destructive font-bold">Eliminar Cuenta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-foreground/80">
              Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate de todo antes de pulsar el botón.
            </p>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar mi cuenta'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
