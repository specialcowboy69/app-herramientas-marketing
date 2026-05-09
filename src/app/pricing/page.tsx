'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.uid, email: user.email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error(error);
      alert('Error procesando el pago. Inténtalo de nuevo.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-24 flex flex-col items-center justify-center bg-background">
      <div className="max-w-5xl mx-auto px-4 text-center w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Planes De Precios</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Elige el plan que mejor se adapte a tus necesidades y empieza a escalar tu negocio con IA.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          {/* FREE PLAN */}
          <div className="bg-card border shadow-lg rounded-2xl p-8 relative flex flex-col">
            <h2 className="text-2xl font-bold mb-2">Plan Gratuito</h2>
            <div className="mb-6">
              <span className="text-4xl font-extrabold tracking-tight">0€</span>
              <span className="text-muted-foreground">/mes</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                'Ideas de Negocio',
                'Avatar de Cliente',
                'Puntos de Dolor',
                'Nombres y Eslóganes',
                'Generador de Anuncios',
                'Estructura SEO',
              ].map((feature, i) => (
                <li key={i} className="flex items-center text-muted-foreground">
                  <Check className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{feature} <span className="text-xs font-semibold uppercase bg-muted px-2 py-0.5 rounded ml-2">Acceso Limitado</span></span>
                </li>
              ))}
            </ul>

            <Button 
              variant="outline"
              className="w-full h-12 text-lg font-bold" 
              onClick={() => router.push('/signup')} 
            >
              Registrarse
            </Button>
          </div>

          {/* PRO PLAN */}
          <div className="bg-card border-primary/50 border-2 shadow-2xl rounded-2xl p-8 relative flex flex-col">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
              LO MÁS POPULAR
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Suscripción Pro</h2>
            <div className="mb-6">
              <span className="text-4xl font-extrabold tracking-tight">9.99€</span>
              <span className="text-muted-foreground">/mes</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                'Ideas de Negocio',
                'Avatar de Cliente',
                'Puntos de Dolor',
                'Nombres y Eslóganes',
                'Generador de Anuncios',
                'Estructura SEO',
              ].map((feature, i) => (
                <li key={i} className="flex items-center">
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                  <span>{feature} <span className="text-xs font-semibold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded ml-2">Acceso ilimitado</span></span>
                </li>
              ))}
            </ul>

            <Button 
              className="w-full h-12 text-lg font-bold" 
              onClick={handleSubscribe} 
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              {isLoading ? "Procesando..." : "Suscribirse ahora"}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-4">
              Podrás cancelar en cualquier momento desde tu configuración.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
