import { getServerSession } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import Customer from '@/models/Customer';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import ProjectsList from '@/components/ProjectsList';
import ProjectsSearch from '@/components/ProjectsSearch';
import SuccessMessage from '@/components/SuccessMessage';

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string };
}) {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login');
  }

  await connectDB();

  const organizationId = session.user.currentOrganizationId || session.user.organizationId;

  const page = parseInt(searchParams.page || '1');
  const limit = 10;
  const skip = (page - 1) * limit;

  const query: any = {
    organizationId, // Tenant isolation
  };
  
  if (searchParams.status) {
    query.status = searchParams.status;
  }

  const [projectsData, total] = await Promise.all([
    Project.find(query)
      .populate('customerId', 'name email')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean(),
    Project.countDocuments(query),
  ]);

  const projects = projectsData.map((project: any) => ({
    ...project,
    _id: project._id.toString(),
    customerId: {
      ...project.customerId,
      _id: project.customerId._id.toString(),
    },
    assignedTo: project.assignedTo ? {
      ...project.assignedTo,
      _id: project.assignedTo._id.toString(),
    } : undefined,
  }));

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-dark mb-2">Projects</h1>
          <p className="text-neutral">Track and manage your projects</p>
        </div>
        <Link
          href="/projects/new"
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          New Project
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <SuccessMessage />
        <ProjectsSearch />
        <ProjectsList projects={projects} totalPages={totalPages} currentPage={page} />
      </div>
    </div>
  );
}
