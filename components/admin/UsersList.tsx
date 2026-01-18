'use client';

import { formatDate } from '@/lib/utils';
import { Edit, Trash2, Mail, UserCog } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  createdAt: string;
}

interface UsersListProps {
  users: User[];
}

const roleColors = {
  admin: 'bg-secondary/10 text-secondary',
  manager: 'bg-primary/10 text-primary',
  user: 'bg-neutral-light text-neutral-dark',
};

export default function UsersList({ users }: UsersListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        window.location.reload();
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setDeletingId(null);
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral">No users found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-light">
            <th className="text-left py-3 px-4 font-semibold text-neutral-dark">User</th>
            <th className="text-left py-3 px-4 font-semibold text-neutral-dark">Email</th>
            <th className="text-left py-3 px-4 font-semibold text-neutral-dark">Role</th>
            <th className="text-left py-3 px-4 font-semibold text-neutral-dark">Joined</th>
            <th className="text-right py-3 px-4 font-semibold text-neutral-dark">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b border-neutral-light hover:bg-neutral-light/50">
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <UserCog className="w-5 h-5 text-primary" />
                  </div>
                  <div className="font-medium text-neutral-dark">{user.name}</div>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-2 text-sm text-neutral">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>
              </td>
              <td className="py-4 px-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </td>
              <td className="py-4 px-4 text-neutral text-sm">
                {formatDate(user.createdAt)}
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/users/${user._id}/edit`}
                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(user._id)}
                    disabled={deletingId === user._id}
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
  );
}
