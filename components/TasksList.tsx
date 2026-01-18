'use client';

import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { CheckCircle2, Circle, Clock, Trash2, Edit, User } from 'lucide-react';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface TasksListProps {
  tasks: Task[];
  projectId: string;
}

const statusColors = {
  pending: 'bg-neutral-light text-neutral-dark',
  'in-progress': 'bg-primary/10 text-primary',
  completed: 'bg-secondary/10 text-secondary',
};

const priorityColors = {
  low: 'bg-neutral-light text-neutral-dark',
  medium: 'bg-primary/10 text-primary',
  high: 'bg-secondary/10 text-secondary',
};

export default function TasksList({ tasks, projectId }: TasksListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        window.location.reload();
      } else {
        alert('Failed to delete task');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'pending' | 'in-progress' | 'completed') => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        window.location.reload();
      }
    } catch (error) {
      alert('Failed to update task status');
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral">No tasks yet. Create your first task above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="p-4 border border-neutral-light rounded-lg hover:bg-neutral-light/50 transition-colors"
        >
          <div className="flex items-start gap-3">
            <button
              onClick={() => handleStatusChange(task._id, task.status === 'completed' ? 'pending' : 'completed')}
              className="mt-1"
            >
              {task.status === 'completed' ? (
                <CheckCircle2 className="w-5 h-5 text-secondary" />
              ) : (
                <Circle className="w-5 h-5 text-neutral" />
              )}
            </button>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className={`font-medium mb-1 ${task.status === 'completed' ? 'line-through text-neutral' : 'text-neutral-dark'}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-neutral mb-2">{task.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className={`px-2 py-1 rounded ${statusColors[task.status]}`}>
                      {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                    <span className={`px-2 py-1 rounded ${priorityColors[task.priority]}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                    </span>
                    {task.dueDate && (
                      <span className="flex items-center gap-1 text-neutral">
                        <Clock className="w-3 h-3" />
                        {formatDate(task.dueDate)}
                      </span>
                    )}
                    {task.assignedTo && (
                      <span className="flex items-center gap-1 text-neutral">
                        <User className="w-3 h-3" />
                        {task.assignedTo.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(task._id)}
                    disabled={deletingId === task._id}
                    className="p-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
