'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'manager' | 'user')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    if (allowedRoles && session.user.role && !allowedRoles.includes(session.user.role as any)) {
      router.push('/dashboard');
    }
  }, [session, status, router, allowedRoles]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-primary">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (allowedRoles && session.user.role && !allowedRoles.includes(session.user.role as any)) {
    return null;
  }

  return <>{children}</>;
}
