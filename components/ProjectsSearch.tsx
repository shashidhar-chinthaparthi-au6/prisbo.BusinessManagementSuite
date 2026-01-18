'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function ProjectsSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState(searchParams.get('status') || '');

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    const params = new URLSearchParams();
    if (e.target.value) params.set('status', e.target.value);
    router.push(`/projects?${params.toString()}`);
  };

  return (
    <div className="flex gap-4 mb-6">
      <select
        value={status}
        onChange={handleStatusChange}
        className="px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
}
