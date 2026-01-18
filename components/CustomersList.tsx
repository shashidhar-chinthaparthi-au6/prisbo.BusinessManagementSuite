'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { Edit, Trash2, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  notes?: string;
  createdAt: string;
}

interface CustomersListProps {
  customers: Customer[];
  totalPages: number;
  currentPage: number;
}

const statusColors = {
  new: 'bg-neutral-light text-neutral-dark',
  contacted: 'bg-primary/10 text-primary',
  qualified: 'bg-primary/20 text-primary-dark',
  converted: 'bg-secondary/10 text-secondary',
};

export default function CustomersList({ customers, totalPages, currentPage }: CustomersListProps) {
  const searchParams = useSearchParams();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        window.location.href = '/customers?success=' + encodeURIComponent('Customer deleted successfully!');
      } else {
        alert('Failed to delete customer');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setDeletingId(null);
    }
  };

  if (customers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral">No customers found. Add your first customer to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-light">
              <th className="text-left py-3 px-4 font-semibold text-neutral-dark">Name</th>
              <th className="text-left py-3 px-4 font-semibold text-neutral-dark">Contact</th>
              <th className="text-left py-3 px-4 font-semibold text-neutral-dark">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-neutral-dark">Created</th>
              <th className="text-right py-3 px-4 font-semibold text-neutral-dark">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id} className="border-b border-neutral-light hover:bg-neutral-light/50">
                <td className="py-4 px-4">
                  <Link href={`/customers/${customer._id}`} className="font-medium text-neutral-dark hover:text-primary">
                    {customer.name}
                  </Link>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-neutral">
                      <Mail className="w-4 h-4" />
                      {customer.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral">
                      <Phone className="w-4 h-4" />
                      {customer.phone}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[customer.status]}`}>
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </span>
                </td>
                <td className="py-4 px-4 text-neutral text-sm">
                  {formatDate(customer.createdAt)}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/customers/${customer._id}/edit`}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(customer._id)}
                      disabled={deletingId === customer._id}
                      className="p-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (status) params.set('status', status);
            params.set('page', page.toString());
            
            return (
              <Link
                key={page}
                href={`/customers?${params.toString()}`}
                className={`px-4 py-2 rounded-lg ${
                  page === currentPage
                    ? 'bg-primary text-white'
                    : 'bg-neutral-light text-neutral-dark hover:bg-primary/10'
                }`}
              >
                {page}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
