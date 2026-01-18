import { getServerSession } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import ProjectForm from '@/components/ProjectForm';
import { notFound } from 'next/navigation';

export default async function EditProjectPage({
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

  const project = await Project.findOne({ _id: params.id, organizationId }).populate('customerId').lean();

  if (!project) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-dark mb-2">Edit Project</h1>
        <p className="text-neutral">Update project information</p>
      </div>
      <ProjectForm project={JSON.parse(JSON.stringify(project))} />
    </div>
  );
}
