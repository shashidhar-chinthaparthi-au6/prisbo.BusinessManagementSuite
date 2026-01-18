'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Project {
  _id?: string;
  name: string;
  description?: string;
  customerId: string | { _id: string; name: string };
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  assignedTo?: string;
}

interface ProjectFormProps {
  project?: Project;
}

export default function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState<Array<{ _id: string; name: string }>>([]);
  const [users, setUsers] = useState<Array<{ _id: string; name: string }>>([]);
  const [formData, setFormData] = useState<Project>({
    name: project?.name || '',
    description: project?.description || '',
    customerId: typeof project?.customerId === 'object' ? project.customerId._id : project?.customerId || '',
    status: project?.status || 'pending',
    dueDate: project?.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : '',
    assignedTo: typeof project?.assignedTo === 'object' ? (project.assignedTo as any)?._id : project?.assignedTo || '',
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [customersRes, usersRes] = await Promise.all([
          fetch('/api/customers'),
          fetch('/api/users'),
        ]);

        const customersData = await customersRes.json();
        const usersData = await usersRes.json();

        setCustomers(customersData.customers || []);
        setUsers(usersData.users || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }

    fetchData();
  }, []);

  // Handle customerId from query params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const customerId = urlParams.get('customerId');
    if (customerId && !project?._id) {
      setFormData({ ...formData, customerId });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = project?._id ? `/api/projects/${project._id}` : '/api/projects';
      const method = project?._id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save project');
      }

      router.push(`/projects?success=${encodeURIComponent(project?._id ? 'Project updated successfully!' : 'Project created successfully!')}`);
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
            Project Name *
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
          <label htmlFor="description" className="block text-sm font-medium text-neutral-dark mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="customerId" className="block text-sm font-medium text-neutral-dark mb-2">
            Customer *
          </label>
          <select
            id="customerId"
            value={typeof formData.customerId === 'string' ? formData.customerId : (formData.customerId as any)?._id || ''}
            onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
            required
            className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-neutral-dark mb-2">
              Due Date *
            </label>
            <input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
              className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="assignedTo" className="block text-sm font-medium text-neutral-dark mb-2">
            Assign To
          </label>
          <select
            id="assignedTo"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : project?._id ? 'Update Project' : 'Create Project'}
          </button>
          <Link
            href="/projects"
            className="px-6 py-3 border border-neutral-light text-neutral-dark rounded-lg hover:bg-neutral-light transition-colors font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
