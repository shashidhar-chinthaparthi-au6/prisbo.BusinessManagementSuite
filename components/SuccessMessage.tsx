'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, X } from 'lucide-react';

export default function SuccessMessage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const success = searchParams.get('success');

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('success');
        router.replace(`${window.location.pathname}?${params.toString()}`);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, router, searchParams]);

  if (!success) return null;

  return (
    <div className="mb-6 bg-primary/10 border border-primary text-primary px-4 py-3 rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5" />
        <span className="font-medium">{success}</span>
      </div>
      <button
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete('success');
          router.replace(`${window.location.pathname}?${params.toString()}`);
        }}
        className="hover:opacity-70"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
