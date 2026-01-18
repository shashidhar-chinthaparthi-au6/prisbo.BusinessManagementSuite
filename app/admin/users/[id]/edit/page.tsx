import { getServerSession } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import UserForm from '@/components/admin/UserForm';
import { notFound } from 'next/navigation';

export default async function EditUserPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession();
  
  if (!session || session.user.role !== 'admin') {
    redirect('/dashboard');
  }

  await connectDB();

  const organizationId = session.user.currentOrganizationId || session.user.organizationId;

  const user = await User.findOne({ _id: params.id, organizationId }).lean();

  if (!user) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-dark mb-2">Edit User</h1>
        <p className="text-neutral">Update user information</p>
      </div>
      <UserForm user={JSON.parse(JSON.stringify(user))} />
    </div>
  );
}
