import { getServerSession } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Customer from '@/models/Customer';
import Project from '@/models/Project';
import User from '@/models/User';
import DemoRequest from '@/models/DemoRequest';
import Task from '@/models/Task';
import Notification from '@/models/Notification';
import Link from 'next/link';
import { Users, FolderKanban, UserPlus, Mail, Bell, TrendingUp } from 'lucide-react';

export default async function AdminDashboardPage() {
  const session = await getServerSession();
  
  if (!session || session.user.role !== 'admin') {
    redirect('/dashboard');
  }

  await connectDB();

  const organizationId = session.user.currentOrganizationId || session.user.organizationId;

  const [
    totalCustomers,
    totalProjects,
    totalUsers,
    pendingDemoRequests,
    unreadNotifications,
    activeTasks,
    completedProjects,
  ] = await Promise.all([
    Customer.countDocuments({ organizationId }),
    Project.countDocuments({ organizationId }),
    User.countDocuments({ organizationId }),
    DemoRequest.countDocuments({ status: 'pending' }), // Demo requests are global
    Notification.countDocuments({ organizationId, read: false }),
    Task.countDocuments({ organizationId, status: 'in-progress' }),
    Project.countDocuments({ organizationId, status: 'completed' }),
  ]);

  const stats = [
    { 
      label: 'Total Customers', 
      value: totalCustomers, 
      icon: Users, 
      colorClass: 'bg-primary/10 text-primary', 
      href: '/customers' 
    },
    { 
      label: 'Total Projects', 
      value: totalProjects, 
      icon: FolderKanban, 
      colorClass: 'bg-primary/10 text-primary', 
      href: '/projects' 
    },
    { 
      label: 'Team Members', 
      value: totalUsers, 
      icon: UserPlus, 
      colorClass: 'bg-primary/10 text-primary', 
      href: '/admin/users' 
    },
    { 
      label: 'Pending Demo Requests', 
      value: pendingDemoRequests, 
      icon: Mail, 
      colorClass: 'bg-secondary/10 text-secondary', 
      href: '/admin/demo-requests' 
    },
    { 
      label: 'Unread Notifications', 
      value: unreadNotifications, 
      icon: Bell, 
      colorClass: 'bg-secondary/10 text-secondary', 
      href: '/admin/notifications' 
    },
    { 
      label: 'Active Tasks', 
      value: activeTasks, 
      icon: TrendingUp, 
      colorClass: 'bg-primary/10 text-primary', 
      href: '/projects' 
    },
    { 
      label: 'Completed Projects', 
      value: completedProjects, 
      icon: FolderKanban, 
      colorClass: 'bg-secondary/10 text-secondary', 
      href: '/projects?status=completed' 
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-dark mb-2">Admin Dashboard</h1>
        <p className="text-neutral">Manage your business and system settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-neutral-dark">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.colorClass} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-neutral-dark mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/users"
              className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-center font-medium"
            >
              Manage Users
            </Link>
            <Link
              href="/admin/demo-requests"
              className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-center font-medium"
            >
              Demo Requests
            </Link>
            <Link
              href="/admin/notifications"
              className="px-4 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors text-center font-medium"
            >
              View Notifications
            </Link>
            <Link
              href="/analytics"
              className="px-4 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors text-center font-medium"
            >
              View Analytics
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-neutral-dark mb-4">System Overview</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-neutral">Total Users</span>
              <span className="font-semibold text-neutral-dark">{totalUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral">Total Customers</span>
              <span className="font-semibold text-neutral-dark">{totalCustomers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral">Total Projects</span>
              <span className="font-semibold text-neutral-dark">{totalProjects}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral">Pending Demos</span>
              <span className="font-semibold text-secondary">{pendingDemoRequests}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral">Unread Notifications</span>
              <span className="font-semibold text-secondary">{unreadNotifications}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
