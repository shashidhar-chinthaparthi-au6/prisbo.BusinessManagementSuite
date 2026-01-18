'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, ChevronDown } from 'lucide-react';

export default function OrganizationSwitcher() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [organization, setOrganization] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrganization() {
      try {
        const res = await fetch('/api/organizations');
        if (res.ok) {
          const data = await res.json();
          setOrganization(data.organization);
        }
      } catch (error) {
        console.error('Failed to fetch organization:', error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchOrganization();
    }
  }, [session]);

  const handleSwitch = async (orgId: string) => {
    try {
      const res = await fetch('/api/organizations/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: orgId }),
      });

      if (res.ok) {
        await update(); // Refresh session
        router.refresh();
        setShowDropdown(false);
      }
    } catch (error) {
      console.error('Failed to switch organization:', error);
    }
  };

  if (!session || loading) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
      >
        <Building2 className="w-4 h-4" />
        <span className="text-sm font-medium">
          {organization?.name || 'Organization'}
        </span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-neutral-light z-20">
            <div className="p-4 border-b border-neutral-light">
              <h3 className="font-semibold text-neutral-dark text-sm">Current Organization</h3>
              <p className="text-sm text-neutral mt-1">{organization?.name}</p>
              {organization?.plan && (
                <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                  {organization.plan.charAt(0).toUpperCase() + organization.plan.slice(1)} Plan
                </span>
              )}
            </div>
            {session?.user?.role === 'admin' && (
              <div className="p-2">
                <Link
                  href="/admin/organization"
                  className="block px-3 py-2 text-sm text-neutral-dark hover:bg-neutral-light rounded-lg transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  Manage Organization
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
