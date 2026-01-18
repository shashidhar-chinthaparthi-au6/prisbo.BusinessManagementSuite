'use client';

import { useSession } from 'next-auth/react';
import Notifications from './Notifications';
import OrganizationSwitcher from './OrganizationSwitcher';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-neutral-light px-8 py-4 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold text-neutral-dark">
          {session?.user?.name || 'Welcome'}
        </h2>
        <p className="text-sm text-neutral capitalize">
          {session?.user?.role || 'User'}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <OrganizationSwitcher />
        <Notifications />
      </div>
    </header>
  );
}
