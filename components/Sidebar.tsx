'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  BarChart3, 
  UserCog,
  LogOut,
  Shield
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/team', label: 'Team', icon: UserCog },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  return (
    <div className="w-64 bg-primary-dark min-h-screen flex flex-col">
      <div className="p-6 border-b border-primary">
        <h1 className="text-2xl font-bold text-white">Prisbo</h1>
        <p className="text-sm text-neutral-light mt-1">Business Management Suite</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-neutral-light hover:bg-primary hover:text-white'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
          {isAdmin && (
            <li>
              <Link
                href="/admin"
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  pathname?.startsWith('/admin')
                    ? 'bg-secondary text-white'
                    : 'text-neutral-light hover:bg-secondary hover:text-white'
                )}
              >
                <Shield className="w-5 h-5" />
                <span className="font-medium">Admin</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="p-4 border-t border-primary">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-light hover:bg-primary hover:text-white transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
