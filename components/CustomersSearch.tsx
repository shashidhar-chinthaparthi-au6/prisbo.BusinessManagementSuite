'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function CustomersSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    router.push(`/customers?${params.toString()}`);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (e.target.value) params.set('status', e.target.value);
    router.push(`/customers?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral" />
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
      <select
        value={status}
        onChange={handleStatusChange}
        className="px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        <option value="">All Status</option>
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="qualified">Qualified</option>
        <option value="converted">Converted</option>
      </select>
      <button
        type="submit"
        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
      >
        Search
      </button>
    </form>
  );
}
