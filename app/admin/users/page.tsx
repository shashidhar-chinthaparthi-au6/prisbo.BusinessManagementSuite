import { getServerSession } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import UsersList from '@/components/admin/UsersList';
import SuccessMessage from '@/components/SuccessMessage';

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { success?: string };
}) {
  const session = await getServerSession();
  
  if (!session || session.user.role !== 'admin') {
    redirect('/dashboard');
  }

  await connectDB();

  const organizationId = session.user.currentOrganizationId || session.user.organizationId;

  const users = await User.find({ organizationId }, 'name email role createdAt')
    .sort({ createdAt: -1 })
    .lean();

  const usersData = users.map((user: any) => ({
    ...user,
    _id: user._id.toString(),
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-dark mb-2">User Management</h1>
          <p className="text-neutral">Manage team members and their roles</p>
        </div>
        <Link
          href="/admin/users/new"
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Add User
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <SuccessMessage />
        <UsersList users={usersData} />
      </div>
    </div>
  );
}
