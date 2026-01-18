'use client';

import { formatDateTime } from '@/lib/utils';
import { Activity as ActivityIcon } from 'lucide-react';

interface Activity {
  _id: string;
  action: string;
  description: string;
  userId: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface ProjectActivityLogProps {
  activities: Activity[];
}

export default function ProjectActivityLog({ activities }: ProjectActivityLogProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral text-sm">No activity history</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity._id} className="border-l-2 border-secondary pl-4">
          <div className="flex items-start gap-2 mb-1">
            <ActivityIcon className="w-4 h-4 text-secondary mt-0.5" />
            <p className="text-sm font-medium text-neutral-dark">{activity.action}</p>
          </div>
          <p className="text-xs text-neutral mb-2">{activity.description}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral">
              by {activity.userId.name}
            </span>
            <span className="text-xs text-neutral">•</span>
            <span className="text-xs text-neutral">
              {formatDateTime(activity.createdAt)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
