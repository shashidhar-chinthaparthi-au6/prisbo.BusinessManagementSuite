import { getServerSession } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Customer from '@/models/Customer';
import Project from '@/models/Project';
import User from '@/models/User';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

export default async function AnalyticsPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login');
  }

  // Only admin and manager can access analytics
  if (session.user.role !== 'admin' && session.user.role !== 'manager') {
    redirect('/dashboard');
  }

  await connectDB();

  const organizationId = session.user.currentOrganizationId || session.user.organizationId;

  const [
    totalCustomers,
    newCustomers,
    contactedCustomers,
    qualifiedCustomers,
    convertedCustomers,
    totalProjects,
    pendingProjects,
    inProgressProjects,
    completedProjects,
    totalTeam,
  ] = await Promise.all([
    Customer.countDocuments({ organizationId }),
    Customer.countDocuments({ organizationId, status: 'new' }),
    Customer.countDocuments({ organizationId, status: 'contacted' }),
    Customer.countDocuments({ organizationId, status: 'qualified' }),
    Customer.countDocuments({ organizationId, status: 'converted' }),
    Project.countDocuments({ organizationId }),
    Project.countDocuments({ organizationId, status: 'pending' }),
    Project.countDocuments({ organizationId, status: 'in-progress' }),
    Project.countDocuments({ organizationId, status: 'completed' }),
    User.countDocuments({ organizationId }),
  ]);

  // Get projects by month for chart
  const projectsByMonth = await Project.aggregate([
    { $match: { organizationId: new (await import('mongoose')).default.Types.ObjectId(organizationId) } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 },
  ]);

  // Get customers by status for chart
  const customersByStatus = [
    { name: 'New', value: newCustomers },
    { name: 'Contacted', value: contactedCustomers },
    { name: 'Qualified', value: qualifiedCustomers },
    { name: 'Converted', value: convertedCustomers },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-dark mb-2">Analytics Dashboard</h1>
        <p className="text-neutral">Business insights and performance metrics</p>
      </div>

      <AnalyticsDashboard
        totalCustomers={totalCustomers}
        totalProjects={totalProjects}
        completedProjects={completedProjects}
        activeProjects={inProgressProjects}
        totalTeam={totalTeam}
        customersByStatus={customersByStatus}
        projectsByMonth={projectsByMonth}
      />
    </div>
  );
}
