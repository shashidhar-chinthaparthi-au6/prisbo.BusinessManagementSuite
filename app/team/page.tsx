import { getServerSession } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Activity from '@/models/Activity';
import Task from '@/models/Task';
import TeamList from '@/components/TeamList';
import ActivityLog from '@/components/ActivityLog';
import TeamTaskAssignments from '@/components/TeamTaskAssignments';

export default async function TeamPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login');
  }

  await connectDB();

  const organizationId = session.user.currentOrganizationId || session.user.organizationId;

  const [usersData, activitiesData, tasksData] = await Promise.all([
    User.find({ organizationId }, 'name email role createdAt').sort({ createdAt: -1 }).lean(),
    Activity.find({ organizationId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),
    Task.find({ 
      organizationId,
      assignedTo: { $exists: true, $ne: null } 
    })
      .populate('assignedTo', 'name email')
      .populate('projectId', 'name')
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  const users = usersData.map((user: any) => ({
    ...user,
    _id: user._id.toString(),
  }));

  const activities = activitiesData.map((activity: any) => ({
    ...activity,
    _id: activity._id.toString(),
    userId: {
      ...activity.userId,
      _id: activity.userId._id.toString(),
    },
  }));

  const tasks = tasksData.map((task: any) => ({
    ...task,
    _id: task._id.toString(),
    projectId: {
      ...task.projectId,
      _id: task.projectId._id.toString(),
    },
    assignedTo: {
      ...task.assignedTo,
      _id: task.assignedTo._id.toString(),
    },
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-dark mb-2">Team</h1>
        <p className="text-neutral">Manage your team members, task assignments, and activity logs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <TeamList users={users} currentUserId={session.user.id} />
        </div>
        <div>
          <ActivityLog activities={activities} />
        </div>
      </div>

      <div className="mt-6">
        <TeamTaskAssignments tasks={tasks} />
      </div>
    </div>
  );
}
