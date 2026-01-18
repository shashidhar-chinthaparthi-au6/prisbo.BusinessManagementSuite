import { getServerSession } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import Task from '@/models/Task';
import Activity from '@/models/Activity';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Building2 } from 'lucide-react';
import TasksList from '@/components/TasksList';
import TaskForm from '@/components/TaskForm';
import ProjectActivityLog from '@/components/ProjectActivityLog';

export default async function ProjectDetailPage({
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

  const [project, tasks, activities] = await Promise.all([
    Project.findOne({ _id: params.id, organizationId })
      .populate('customerId', 'name email phone')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name')
      .lean(),
    Task.find({ projectId: params.id, organizationId })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .lean(),
    Activity.find({ 
      type: 'project',
      relatedId: params.id,
      organizationId
    })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  if (!project) {
    redirect('/projects');
  }

  const projectData = {
    ...project,
    _id: project._id.toString(),
    customerId: {
      ...(project.customerId as any),
      _id: (project.customerId as any)._id.toString(),
    },
    assignedTo: project.assignedTo ? {
      ...(project.assignedTo as any),
      _id: (project.assignedTo as any)._id.toString(),
    } : undefined,
  };

  const tasksData = tasks.map((task: any) => ({
    ...task,
    _id: task._id.toString(),
    projectId: task.projectId.toString(),
    assignedTo: task.assignedTo ? {
      ...task.assignedTo,
      _id: task.assignedTo._id.toString(),
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
    pending: 'bg-neutral-light text-neutral-dark',
    'in-progress': 'bg-primary/10 text-primary',
    completed: 'bg-secondary/10 text-secondary',
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-neutral-dark mb-2">{projectData.name}</h1>
            {projectData.description && (
              <p className="text-neutral mb-4">{projectData.description}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-neutral" />
                <span className="text-neutral">Customer:</span>
                <span className="font-medium text-neutral-dark">{projectData.customerId.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral" />
                <span className="text-neutral">Due:</span>
                <span className="font-medium text-neutral-dark">
                  {new Date(projectData.dueDate).toLocaleDateString()}
                </span>
              </div>
              {projectData.assignedTo && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-neutral" />
                  <span className="text-neutral">Assigned to:</span>
                  <span className="font-medium text-neutral-dark">{projectData.assignedTo.name}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-4 py-2 rounded-lg text-sm font-medium ${statusColors[projectData.status as keyof typeof statusColors]}`}>
              {projectData.status === 'in-progress' ? 'In Progress' : projectData.status.charAt(0).toUpperCase() + projectData.status.slice(1)}
            </span>
            <Link
              href={`/projects/${params.id}/edit`}
              className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium"
            >
              Edit Project
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-neutral-dark">Tasks</h2>
            </div>
            <TaskForm projectId={params.id} />
            <TasksList tasks={tasksData} projectId={params.id} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-neutral-dark mb-4">Project Activity</h2>
            <ProjectActivityLog activities={activitiesData} />
          </div>
        </div>
      </div>
    </div>
  );
}
