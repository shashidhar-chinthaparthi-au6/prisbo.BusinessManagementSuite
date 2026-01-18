'use client';

import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Edit, Trash2, Calendar } from 'lucide-react';
import { useState } from 'react';

interface Project {
  _id: string;
  name: string;
  description?: string;
  customerId: {
    _id: string;
    name: string;
    email: string;
  };
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  assignedTo?: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface ProjectsListProps {
  projects: Project[];
  totalPages: number;
  currentPage: number;
}

const statusColors = {
  pending: 'bg-neutral-light text-neutral-dark',
  'in-progress': 'bg-primary/10 text-primary',
  completed: 'bg-secondary/10 text-secondary',
};

export default function ProjectsList({ projects, totalPages, currentPage }: ProjectsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        window.location.href = '/projects?success=' + encodeURIComponent('Project deleted successfully!');
      } else {
        alert('Failed to delete project');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setDeletingId(null);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral">No projects found. Create your first project to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-light">
              <th className="text-left py-3 px-4 font-semibold text-neutral-dark">Project</th>
              <th className="text-left py-3 px-4 font-semibold text-neutral-dark">Customer</th>
              <th className="text-left py-3 px-4 font-semibold text-neutral-dark">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-neutral-dark">Due Date</th>
              <th className="text-left py-3 px-4 font-semibold text-neutral-dark">Assigned To</th>
              <th className="text-right py-3 px-4 font-semibold text-neutral-dark">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id} className="border-b border-neutral-light hover:bg-neutral-light/50">
                <td className="py-4 px-4">
                  <Link href={`/projects/${project._id}`} className="font-medium text-neutral-dark hover:text-primary">
                    {project.name}
                  </Link>
                  {project.description && (
                    <div className="text-sm text-neutral mt-1">{project.description}</div>
                  )}
                </td>
                <td className="py-4 px-4">
                  <div className="font-medium text-neutral-dark">{project.customerId.name}</div>
                  <div className="text-sm text-neutral">{project.customerId.email}</div>
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                    {project.status === 'in-progress' ? 'In Progress' : project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2 text-sm text-neutral">
                    <Calendar className="w-4 h-4" />
                    {formatDate(project.dueDate)}
                  </div>
                </td>
                <td className="py-4 px-4 text-neutral text-sm">
                  {project.assignedTo?.name || 'Unassigned'}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/projects/${project._id}/edit`}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(project._id)}
                      disabled={deletingId === project._id}
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
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={`/projects?page=${page}`}
              className={`px-4 py-2 rounded-lg ${
                page === currentPage
                  ? 'bg-primary text-white'
                  : 'bg-neutral-light text-neutral-dark hover:bg-primary/10'
              }`}
            >
              {page}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
