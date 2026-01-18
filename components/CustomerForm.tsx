'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Customer {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  notes?: string;
}

interface CustomerFormProps {
  customer?: Customer;
}

export default function CustomerForm({ customer }: CustomerFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Customer>({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    status: customer?.status || 'new',
    notes: customer?.notes || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = customer?._id ? `/api/customers/${customer._id}` : '/api/customers';
      const method = customer?._id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save customer');
      }

      router.push(`/customers?success=${encodeURIComponent(customer?._id ? 'Customer updated successfully!' : 'Customer created successfully!')}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
      {error && (
        <div className="mb-6 bg-secondary/10 border border-secondary text-secondary px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-dark mb-2">
            Name *
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-dark mb-2">
            Email *
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-neutral-dark mb-2">
            Phone *
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-neutral-dark mb-2">
            Status *
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            required
            className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-neutral-dark mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : customer?._id ? 'Update Customer' : 'Create Customer'}
          </button>
          <Link
            href="/customers"
            className="px-6 py-3 border border-neutral-light text-neutral-dark rounded-lg hover:bg-neutral-light transition-colors font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
