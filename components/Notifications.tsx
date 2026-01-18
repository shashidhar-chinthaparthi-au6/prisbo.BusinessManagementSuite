'use client';

import { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';

interface Notification {
  _id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      });

      if (res.ok) {
        setNotifications(notifications.map(n => 
          n._id === id ? { ...n, read: true } : n
        ));
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications/read-all', {
        method: 'PUT',
      });

      if (res.ok) {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const typeColors = {
    info: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-secondary/10 text-secondary border-secondary/20',
    warning: 'bg-secondary/20 text-secondary-dark border-secondary/30',
    error: 'bg-secondary/10 text-secondary border-secondary/20',
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-neutral-light hover:text-white transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary rounded-full text-white text-xs flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-neutral-light z-20 max-h-[600px] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-neutral-light flex justify-between items-center">
              <h3 className="font-semibold text-neutral-dark">Notifications</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:text-primary-dark"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setShowDropdown(false)}
                  className="text-neutral hover:text-neutral-dark"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="p-8 text-center text-neutral">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-neutral">No notifications</div>
              ) : (
                <div className="divide-y divide-neutral-light">
                  {notifications.map((notification) => {
                    const content = (
                      <div
                        className={`p-4 hover:bg-neutral-light/50 transition-colors ${
                          !notification.read ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-1 border-l-2 pl-3 ${typeColors[notification.type]}`}>
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-medium text-neutral-dark text-sm">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-xs text-neutral mb-2">{notification.message}</p>
                            <p className="text-xs text-neutral">
                              {formatDateTime(notification.createdAt)}
                            </p>
                          </div>
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="p-1 text-neutral hover:text-primary transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );

                    return notification.link ? (
                      <Link key={notification._id} href={notification.link} onClick={() => {
                        markAsRead(notification._id);
                        setShowDropdown(false);
                      }}>
                        {content}
                      </Link>
                    ) : (
                      <div key={notification._id}>{content}</div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
