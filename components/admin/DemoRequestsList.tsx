'use client';

import { formatDate, formatDateTime } from '@/lib/utils';
import { Mail, Phone, Building2, Edit, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface DemoRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message?: string;
  status: 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  scheduledDate?: string;
  createdAt: string;
}

interface DemoRequestsListProps {
  requests: DemoRequest[];
  currentUserId: string;
}

const statusColors = {
  pending: 'bg-secondary/10 text-secondary',
  contacted: 'bg-primary/10 text-primary',
  scheduled: 'bg-primary/20 text-primary-dark',
  completed: 'bg-secondary/20 text-secondary-dark',
  cancelled: 'bg-neutral-light text-neutral-dark',
};

export default function DemoRequestsList({ requests, currentUserId }: DemoRequestsListProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/demo-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setUpdatingId(null);
    }
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral">No demo requests found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div
          key={request._id}
          className="p-6 border border-neutral-light rounded-lg hover:bg-neutral-light/50 transition-colors"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-neutral-dark">{request.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[request.status]}`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-neutral">
                  <Building2 className="w-4 h-4" />
                  {request.company}
                </div>
                <div className="flex items-center gap-2 text-neutral">
                  <Mail className="w-4 h-4" />
                  {request.email}
                </div>
                <div className="flex items-center gap-2 text-neutral">
                  <Phone className="w-4 h-4" />
                  {request.phone}
                </div>
                {request.message && (
                  <div className="mt-3 p-3 bg-neutral-light rounded-lg">
                    <p className="text-neutral-dark text-sm">{request.message}</p>
                  </div>
                )}
                {request.notes && (
                  <div className="mt-3 p-3 bg-primary/5 rounded-lg">
                    <p className="text-neutral-dark text-sm"><strong>Notes:</strong> {request.notes}</p>
                  </div>
                )}
                {request.scheduledDate && (
                  <div className="mt-2 text-sm text-neutral">
                    <strong>Scheduled:</strong> {formatDateTime(request.scheduledDate)}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 ml-4">
              <Link
                href={`/admin/demo-requests/${request._id}`}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Manage
              </Link>
              {request.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(request._id, 'contacted')}
                    disabled={updatingId === request._id}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    Mark Contacted
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(request._id, 'cancelled')}
                    disabled={updatingId === request._id}
                    className="px-4 py-2 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="text-xs text-neutral mt-4">
            Requested: {formatDateTime(request.createdAt)}
          </div>
        </div>
      ))}
    </div>
  );
}
