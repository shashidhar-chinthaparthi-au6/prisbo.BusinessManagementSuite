import { getServerSession } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Customer from '@/models/Customer';
import Project from '@/models/Project';
import Activity from '@/models/Activity';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Building2, Edit } from 'lucide-react';
import CustomerActivityLog from '@/components/CustomerActivityLog';

export default async function CustomerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login');
  }

  await connectDB();

  const organizationId = session.user.currentOrganizationId || session.user.organizationId;

  const [customer, projects, activities] = await Promise.all([
    Customer.findOne({ _id: params.id, organizationId }).lean(),
    Project.find({ customerId: params.id, organizationId })
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .lean(),
    Activity.find({ 
      type: 'customer',
      relatedId: params.id,
      organizationId
    })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  if (!customer) {
    redirect('/customers');
  }

  const customerData = {
    ...customer,
    _id: customer._id.toString(),
  };

  const projectsData = projects.map((project: any) => ({
    ...project,
    _id: project._id.toString(),
    customerId: project.customerId.toString(),
    assignedTo: project.assignedTo ? {
      ...project.assignedTo,
      _id: project.assignedTo._id.toString(),
    } : undefined,
  }));

  const activitiesData = activities.map((activity: any) => ({
    ...activity,
    _id: activity._id.toString(),
    userId: {
      ...activity.userId,
      _id: activity.userId._id.toString(),
    },
  }));

  const statusColors = {
    new: 'bg-neutral-light text-neutral-dark',
    contacted: 'bg-primary/10 text-primary',
    qualified: 'bg-primary/20 text-primary-dark',
    converted: 'bg-secondary/10 text-secondary',
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/customers"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Customers
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-neutral-dark mb-2">{customerData.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm mb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neutral" />
                <span className="text-neutral-dark">{customerData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-neutral" />
                <span className="text-neutral-dark">{customerData.phone}</span>
              </div>
            </div>
            {customerData.notes && (
              <div className="bg-neutral-light rounded-lg p-4 mb-4">
                <p className="text-sm text-neutral-dark">{customerData.notes}</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-4 py-2 rounded-lg text-sm font-medium ${statusColors[customerData.status as keyof typeof statusColors]}`}>
              {customerData.status.charAt(0).toUpperCase() + customerData.status.slice(1)}
            </span>
            <Link
              href={`/customers/${params.id}/edit`}
              className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Customer
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-neutral-dark">Projects</h2>
              <Link
                href={`/projects/new?customerId=${params.id}`}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
              >
                New Project
              </Link>
            </div>
            {projectsData.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="w-12 h-12 text-neutral mx-auto mb-2" />
                <p className="text-neutral">No projects for this customer</p>
                <Link
                  href={`/projects/new?customerId=${params.id}`}
                  className="text-primary hover:text-primary-dark mt-2 inline-block"
                >
                  Create first project
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {projectsData.map((project) => (
                  <Link
                    key={project._id}
                    href={`/projects/${project._id}`}
                    className="block p-4 border border-neutral-light rounded-lg hover:bg-neutral-light/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-neutral-dark mb-1">{project.name}</h3>
                        {project.description && (
                          <p className="text-sm text-neutral mb-2">{project.description}</p>
                        )}
                        <div className="flex gap-4 text-xs text-neutral">
                          <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                          {project.assignedTo && (
                            <span>Assigned: {project.assignedTo.name}</span>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === 'in-progress' 
                          ? 'bg-primary/10 text-primary' 
                          : project.status === 'completed'
                          ? 'bg-secondary/10 text-secondary'
                          : 'bg-neutral-light text-neutral-dark'
                      }`}>
                        {project.status === 'in-progress' ? 'In Progress' : project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-neutral-dark mb-4">Activity History</h2>
            <CustomerActivityLog activities={activitiesData} />
          </div>
        </div>
      </div>
    </div>
  );
}
