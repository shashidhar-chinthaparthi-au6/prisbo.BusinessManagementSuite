'use client';

import { formatDate } from '@/lib/utils';
import { UserCog, Mail } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  createdAt: string;
}

interface TeamListProps {
  users: User[];
  currentUserId: string;
}

const roleColors = {
  admin: 'bg-secondary/10 text-secondary',
  manager: 'bg-primary/10 text-primary',
  user: 'bg-neutral-light text-neutral-dark',
};

export default function TeamList({ users, currentUserId }: TeamListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-neutral-dark mb-4">Team Members</h2>
      
      {users.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral">No team members found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-4 border border-neutral-light rounded-lg hover:bg-neutral-light/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <UserCog className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-neutral-dark">{user.name}</p>
                    {user._id === currentUserId && (
                      <span className="text-xs text-neutral">(You)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral mt-1">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                <span className="text-sm text-neutral">
                  Joined {formatDate(user.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
