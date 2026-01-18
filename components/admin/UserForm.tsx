'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserForm({ user }: { user?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'user',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = user?._id ? `/api/admin/users/${user._id}` : '/api/admin/users';
      const method = user?._id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save user');
      }

      router.push('/admin/users?success=' + encodeURIComponent(user?._id ? 'User updated successfully!' : 'User created successfully!'));
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
            Full Name *
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
          <label htmlFor="password" className="block text-sm font-medium text-neutral-dark mb-2">
            Password {user?._id ? '(leave blank to keep current)' : '*'}
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!user?._id}
            minLength={6}
            className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-neutral-dark mb-2">
            Role *
          </label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
            required
            className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : user?._id ? 'Update User' : 'Create User'}
          </button>
          <Link
            href="/admin/users"
            className="px-6 py-3 border border-neutral-light text-neutral-dark rounded-lg hover:bg-neutral-light transition-colors font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
