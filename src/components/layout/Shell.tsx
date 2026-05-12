'use client';

import { useAuth } from '@/lib/firebase/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function Shell({ children, extraContent, requireAuth = true }: { children: React.ReactNode; extraContent?: React.ReactNode; requireAuth?: boolean }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && !loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router, requireAuth]);

  const handleResendVerification = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        toast.success('Correo de verificación reenviado');
      } catch (error: any) {
        toast.error('Error al reenviar: ' + error.message);
      }
    }
  };


  if (requireAuth && (loading || !user)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }


  return (
    <div className="relative flex h-screen bg-background isolate overflow-hidden">
      {/* Background Blobs - Fixed to avoid layout shifts */}
      <div className="fixed top-0 -left-4 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-blob -z-10" />
      <div className="fixed top-0 -right-4 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-blob animation-delay-2000 -z-10" />
      <div className="fixed -bottom-8 left-20 w-96 h-96 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-blob animation-delay-4000 -z-10" />

      <Sidebar />
      <main className="flex-1 overflow-y-auto scroll-smooth">
        {user && !user.emailVerified && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-3 text-amber-600 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-center">
            <span>⚠️ Tu correo electrónico no está verificado. No podrás generar contenido con IA hasta que lo verifiques.</span>
            <Button variant="outline" size="sm" onClick={handleResendVerification} className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200">
              Reenviar correo
            </Button>
          </div>
        )}
        <div className="container max-w-7xl mx-auto py-12 px-6 lg:px-8">
          <div className="bg-background/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 min-h-[calc(100vh-6rem)] shadow-2xl shadow-primary/5">
            {children}
          </div>
          {extraContent}
        </div>
      </main>
    </div>
  );
}
