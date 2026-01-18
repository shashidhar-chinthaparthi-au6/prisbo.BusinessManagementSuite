import { getServerSession } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Organization from '@/models/Organization';
import User from '@/models/User';
import Link from 'next/link';
import { ArrowLeft, Building2, Mail, Phone, CreditCard, Users, FolderKanban, Calendar } from 'lucide-react';

export default async function OrganizationManagementPage() {
  const session = await getServerSession();
  
  if (!session || session.user.role !== 'admin') {
    redirect('/dashboard');
  }

  await connectDB();

  const organizationId = session.user.currentOrganizationId || session.user.organizationId;

  const organization = await Organization.findById(organizationId).lean();
  
  if (!organization) {
    redirect('/dashboard');
  }

  // Get organization stats
  const [totalUsers, totalCustomers, totalProjects] = await Promise.all([
    User.countDocuments({ organizationId }),
    (await import('@/models/Customer')).default.countDocuments({ organizationId }),
    (await import('@/models/Project')).default.countDocuments({ organizationId }),
  ]);

  const planLimits = {
    free: { users: 5, projects: 10 },
    starter: { users: 10, projects: 50 },
    professional: { users: 50, projects: 200 },
    enterprise: { users: 999, projects: 9999 },
  };

  const limits = planLimits[organization.plan as keyof typeof planLimits] || planLimits.free;

  const orgData = {
    ...organization,
    _id: organization._id.toString(),
    ownerId: organization.ownerId?.toString(),
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Link>
        <h1 className="text-3xl font-bold text-neutral-dark mb-2">Organization Management</h1>
        <p className="text-neutral">Manage your organization settings and view usage</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Organization Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-neutral-dark mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Organization Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">Organization Name</label>
                <p className="text-lg text-neutral-dark">{orgData.name}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <p className="text-neutral-dark">{orgData.email}</p>
                </div>
                
                {orgData.phone && (
                  <div>
                    <label className="block text-sm font-medium text-neutral mb-1 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </label>
                    <p className="text-neutral-dark">{orgData.phone}</p>
                  </div>
                )}
              </div>

              {orgData.domain && (
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">Custom Domain</label>
                  <p className="text-neutral-dark">{orgData.domain}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral mb-1">Organization Slug</label>
                <p className="text-neutral-dark font-mono text-sm">{orgData.slug}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral mb-1">Status</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  orgData.status === 'active' 
                    ? 'bg-secondary/10 text-secondary' 
                    : orgData.status === 'suspended'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-neutral-light text-neutral-dark'
                }`}>
                  {orgData.status.charAt(0).toUpperCase() + orgData.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Subscription Plan */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-neutral-dark mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Subscription Plan
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">Current Plan</label>
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-lg font-semibold">
                  {orgData.plan.charAt(0).toUpperCase() + orgData.plan.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-light">
                <div>
                  <label className="block text-sm font-medium text-neutral mb-2">User Limit</label>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-neutral" />
                    <span className="text-lg font-semibold text-neutral-dark">
                      {totalUsers} / {limits.users === 999 ? 'Unlimited' : limits.users}
                    </span>
                  </div>
                  {limits.users !== 999 && (
                    <div className="mt-2 w-full bg-neutral-light rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((totalUsers / limits.users) * 100, 100)}%` }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral mb-2">Project Limit</label>
                  <div className="flex items-center gap-2">
                    <FolderKanban className="w-4 h-4 text-neutral" />
                    <span className="text-lg font-semibold text-neutral-dark">
                      {totalProjects} / {limits.projects === 9999 ? 'Unlimited' : limits.projects}
                    </span>
                  </div>
                  {limits.projects !== 9999 && (
                    <div className="mt-2 w-full bg-neutral-light rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((totalProjects / limits.projects) * 100, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-neutral-dark mb-4">Quick Stats</h2>
            <div className="space-y-4">
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
            </div>
          </div>

          {/* Organization Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-neutral-dark mb-4">Organization Info</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-neutral">Created:</span>
                <p className="text-neutral-dark font-medium">
                  {new Date(orgData.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-neutral">Last Updated:</span>
                <p className="text-neutral-dark font-medium">
                  {new Date(orgData.updatedAt).toLocaleDateString()}
                </p>
              </div>
              {orgData.billingEmail && (
                <div>
                  <span className="text-neutral">Billing Email:</span>
                  <p className="text-neutral-dark font-medium">{orgData.billingEmail}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-neutral-dark mb-4">Actions</h2>
            <div className="space-y-2">
              <Link
                href="/admin/users"
                className="block w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-center font-medium"
              >
                Manage Users
              </Link>
              <button
                disabled
                className="block w-full px-4 py-2 bg-neutral-light text-neutral rounded-lg cursor-not-allowed text-center font-medium"
                title="Upgrade plan feature coming soon"
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
