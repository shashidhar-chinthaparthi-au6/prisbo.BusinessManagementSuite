import { getServerSession } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import DemoRequest from '@/models/DemoRequest';
import DemoRequestForm from '@/components/admin/DemoRequestForm';
import { notFound } from 'next/navigation';

export default async function DemoRequestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession();
  
  if (!session || session.user.role !== 'admin') {
    redirect('/dashboard');
  }

  await connectDB();

  const request = await DemoRequest.findById(params.id)
    .populate('contactedBy', 'name')
    .lean();

  if (!request) {
    notFound();
  }

  const requestData = {
    ...request,
    _id: request._id.toString(),
    contactedBy: request.contactedBy ? {
      ...(request.contactedBy as any),
      _id: (request.contactedBy as any)._id.toString(),
    } : undefined,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-dark mb-2">Manage Demo Request</h1>
        <p className="text-neutral">Update status and add notes</p>
      </div>
      <DemoRequestForm request={requestData} currentUserId={session.user.id} />
    </div>
  );
}
