'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

interface TaskFormProps {
  projectId: string;
}

export default function TaskForm({ projectId }: TaskFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    assignedTo: '',
  });
  const [users, setUsers] = useState<Array<{ _id: string; name: string }>>([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    }
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          projectId,
          assignedTo: formData.assignedTo || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create task');
      }

      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium mb-4"
      >
        <Plus className="w-4 h-4" />
        Add Task
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 border border-neutral-light rounded-lg bg-neutral-light/50">
      {error && (
        <div className="mb-4 bg-secondary/10 border border-secondary text-secondary px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <div>
          <input
            type="text"
            placeholder="Task title *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
        </div>

        <div>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div>
          <select
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setFormData({
                title: '',
                description: '',
                priority: 'medium',
                dueDate: '',
                assignedTo: '',
              });
              setError('');
            }}
            className="px-4 py-2 border border-neutral-light text-neutral-dark rounded-lg hover:bg-neutral-light transition-colors text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
