'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Phone, Building2, User, Calendar } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

interface DemoRequestFormProps {
  request: any;
  currentUserId: string;
}

export default function DemoRequestForm({ request, currentUserId }: DemoRequestFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    status: request.status || 'pending',
    notes: request.notes || '',
    scheduledDate: request.scheduledDate ? new Date(request.scheduledDate).toISOString().split('T')[0] : '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/demo-requests/${request._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: formData.status,
          notes: formData.notes,
          scheduledDate: formData.scheduledDate || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update demo request');
      }

      router.push('/admin/demo-requests?success=' + encodeURIComponent('Demo request updated successfully!'));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    pending: 'bg-secondary/10 text-secondary',
    contacted: 'bg-primary/10 text-primary',
    scheduled: 'bg-primary/20 text-primary-dark',
    completed: 'bg-secondary/20 text-secondary-dark',
    cancelled: 'bg-neutral-light text-neutral-dark',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-neutral-dark mb-4">Update Demo Request</h2>
          
          {error && (
            <div className="mb-6 bg-secondary/10 border border-secondary text-secondary px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-neutral-dark mb-2">
                Status *
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
                className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label htmlFor="scheduledDate" className="block text-sm font-medium text-neutral-dark mb-2">
                Scheduled Date
              </label>
              <input
                id="scheduledDate"
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-neutral-dark mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Add notes about this demo request..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Request'}
              </button>
              <Link
                href="/admin/demo-requests"
                className="px-6 py-3 border border-neutral-light text-neutral-dark rounded-lg hover:bg-neutral-light transition-colors font-medium"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-neutral-dark mb-4">Request Details</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-neutral mb-1">
                <User className="w-4 h-4" />
                Name
              </div>
              <p className="font-medium text-neutral-dark">{request.name}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-neutral mb-1">
                <Mail className="w-4 h-4" />
                Email
              </div>
              <p className="font-medium text-neutral-dark">{request.email}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-neutral mb-1">
                <Phone className="w-4 h-4" />
                Phone
              </div>
              <p className="font-medium text-neutral-dark">{request.phone}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-neutral mb-1">
                <Building2 className="w-4 h-4" />
                Company
              </div>
              <p className="font-medium text-neutral-dark">{request.company}</p>
            </div>
            {request.message && (
              <div>
                <div className="text-sm text-neutral mb-1">Message</div>
                <p className="text-sm text-neutral-dark bg-neutral-light p-3 rounded-lg">{request.message}</p>
              </div>
            )}
            <div>
              <div className="text-sm text-neutral mb-1">Requested</div>
              <p className="text-sm text-neutral-dark">{formatDateTime(request.createdAt)}</p>
            </div>
            {request.contactedBy && (
              <div>
                <div className="text-sm text-neutral mb-1">Contacted By</div>
                <p className="text-sm text-neutral-dark">{request.contactedBy.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
