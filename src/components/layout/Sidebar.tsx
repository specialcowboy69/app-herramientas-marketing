'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Briefcase, 
  Wand2, 
  Star, 
  Settings, 
  LogOut,
  PlusCircle,
  ChevronRight,
  Mic,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/firebase/client';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Panel', href: '/dashboard', icon: BarChart3 },
  { name: 'Proyectos', href: '/projects', icon: Briefcase },
  { name: 'Herramientas', href: '/tools', icon: Wand2 },
  { name: 'Favoritos', href: '/favorites', icon: Star },
  { name: 'Historial', href: '/history', icon: Clock },
  { name: 'Configuración', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="flex flex-col w-64 border-r bg-card h-screen sticky top-0">
      <div className="p-6">
        <Link href="/" className="text-xl font-bold flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <Wand2 size={20} />
          </div>
          <span>Magnificus</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className={cn(
                'mr-3 h-5 w-5',
                isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
              )} />
              {item.name}
              {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
