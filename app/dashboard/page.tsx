import { getServerSession } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Customer from '@/models/Customer';
import Project from '@/models/Project';
import User from '@/models/User';
import Activity from '@/models/Activity';
import Link from 'next/link';
import { Users, FolderKanban, CheckCircle2, Clock } from 'lucide-react';
import ActivityLog from '@/components/ActivityLog';

export default async function DashboardPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login');
  }

  await connectDB();

  const organizationId = session.user.currentOrganizationId || session.user.organizationId;

  const [totalCustomers, totalProjects, activeProjects, completedProjects, totalTeam, recentActivities] = await Promise.all([
    Customer.countDocuments({ organizationId }),
    Project.countDocuments({ organizationId }),
    Project.countDocuments({ organizationId, status: 'in-progress' }),
    Project.countDocuments({ organizationId, status: 'completed' }),
    User.countDocuments({ organizationId }),
    Activity.find({ organizationId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  const stats = [
    { label: 'Total Customers', value: totalCustomers, icon: Users, colorClass: 'bg-primary/10 text-primary', href: '/customers' },
    { label: 'Total Projects', value: totalProjects, icon: FolderKanban, colorClass: 'bg-primary/10 text-primary', href: '/projects' },
    { label: 'Active Projects', value: activeProjects, icon: Clock, colorClass: 'bg-secondary/10 text-secondary', href: '/projects?status=in-progress' },
    { label: 'Completed Projects', value: completedProjects, icon: CheckCircle2, colorClass: 'bg-primary/10 text-primary', href: '/projects?status=completed' },
    { label: 'Team Members', value: totalTeam, icon: Users, colorClass: 'bg-primary/10 text-primary', href: '/team' },
  ];

  const activities = recentActivities.map((activity: any) => ({
    ...activity,
    _id: activity._id.toString(),
    userId: {
      ...activity.userId,
      _id: activity.userId._id.toString(),
    },
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-dark mb-2">
          Welcome back, {session.user.name}!
        </h1>
        <p className="text-neutral">Here&apos;s what&apos;s happening with your business today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
              href="/customers/new"
              className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-center font-medium"
            >
              Add Customer
            </Link>
            <Link
              href="/projects/new"
              className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-center font-medium"
            >
              New Project
            </Link>
            <Link
              href="/analytics"
              className="px-4 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors text-center font-medium"
            >
              View Analytics
            </Link>
            <Link
              href="/team"
              className="px-4 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors text-center font-medium"
            >
              Manage Team
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-neutral-dark mb-4">Recent Activity</h2>
          <ActivityLog activities={activities} />
        </div>
      </div>
    </div>
  );
}
