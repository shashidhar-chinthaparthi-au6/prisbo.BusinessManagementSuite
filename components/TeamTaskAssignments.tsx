'use client';

import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { CheckCircle2, Circle, Clock, FolderKanban } from 'lucide-react';

interface Task {
  _id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedTo: {
    _id: string;
    name: string;
    email: string;
  };
  projectId: {
    _id: string;
    name: string;
  };
}

interface TeamTaskAssignmentsProps {
  tasks: Task[];
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

export default function TeamTaskAssignments({ tasks }: TeamTaskAssignmentsProps) {
  // Group tasks by assigned user
  const tasksByUser = tasks.reduce((acc, task) => {
    const userId = task.assignedTo._id;
    if (!acc[userId]) {
      acc[userId] = {
        user: task.assignedTo,
        tasks: [],
      };
    }
    acc[userId].tasks.push(task);
    return acc;
  }, {} as Record<string, { user: Task['assignedTo']; tasks: Task[] }>);

  const userGroups = Object.values(tasksByUser);

  if (userGroups.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-neutral-dark mb-4">Task Assignments</h2>
        <div className="text-center py-8">
          <p className="text-neutral">No tasks assigned to team members</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-neutral-dark mb-4">Task Assignments</h2>
      <div className="space-y-6">
        {userGroups.map((group) => (
          <div key={group.user._id} className="border-b border-neutral-light pb-6 last:border-0 last:pb-0">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold text-neutral-dark">{group.user.name}</h3>
              <span className="text-sm text-neutral">({group.tasks.length} {group.tasks.length === 1 ? 'task' : 'tasks'})</span>
            </div>
            <div className="space-y-2">
              {group.tasks.map((task) => (
                <Link
                  key={task._id}
                  href={`/projects/${task.projectId._id}`}
                  className="block p-3 border border-neutral-light rounded-lg hover:bg-neutral-light/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5" />
                    ) : (
                      <Circle className="w-4 h-4 text-neutral mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className={`text-sm font-medium mb-1 ${task.status === 'completed' ? 'line-through text-neutral' : 'text-neutral-dark'}`}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-neutral mb-1">
                            <FolderKanban className="w-3 h-3" />
                            <span>{task.projectId.name}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-xs ${statusColors[task.status]}`}>
                              {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs ${priorityColors[task.priority]}`}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </span>
                            {task.dueDate && (
                              <span className="flex items-center gap-1 text-xs text-neutral">
                                <Clock className="w-3 h-3" />
                                {formatDate(task.dueDate)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
