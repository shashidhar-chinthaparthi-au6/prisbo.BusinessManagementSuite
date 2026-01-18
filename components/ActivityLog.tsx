'use client';

import { formatDateTime } from '@/lib/utils';
import { Activity as ActivityIcon } from 'lucide-react';

interface Activity {
  _id: string;
  type: 'customer' | 'project' | 'team';
  action: string;
  description: string;
  userId: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface ActivityLogProps {
  activities: Activity[];
}

const typeColors = {
  customer: 'bg-primary/10 text-primary',
  project: 'bg-secondary/10 text-secondary',
  team: 'bg-neutral-light text-neutral-dark',
};

export default function ActivityLog({ activities }: ActivityLogProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-neutral-dark mb-4">Recent Activity</h2>
      
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-neutral text-sm">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity._id} className="border-l-2 border-neutral-light pl-4">
              <div className="flex items-start gap-2 mb-1">
                <ActivityIcon className="w-4 h-4 text-neutral mt-0.5" />
                <p className="text-sm font-medium text-neutral-dark">{activity.action}</p>
              </div>
              <p className="text-xs text-neutral mb-2">{activity.description}</p>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs ${typeColors[activity.type]}`}>
                  {activity.type}
                </span>
                <span className="text-xs text-neutral">
                  by {activity.userId.name}
                </span>
              </div>
              <p className="text-xs text-neutral mt-1">
                {formatDateTime(activity.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
