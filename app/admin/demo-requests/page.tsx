import { getServerSession } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import DemoRequest from '@/models/DemoRequest';
import DemoRequestsList from '@/components/admin/DemoRequestsList';
import SuccessMessage from '@/components/SuccessMessage';

export default async function AdminDemoRequestsPage({
  searchParams,
}: {
  searchParams: { success?: string };
}) {
  const session = await getServerSession();
  
  if (!session || session.user.role !== 'admin') {
    redirect('/dashboard');
  }

  await connectDB();

  // Demo requests are global (not tenant-specific)
  // In production, you might want to filter by organization or have a super admin view
  const demoRequests = await DemoRequest.find({})
    .populate('contactedBy', 'name')
    .sort({ createdAt: -1 })
    .lean();

  const requestsData = demoRequests.map((request: any) => ({
    ...request,
    _id: request._id.toString(),
    contactedBy: request.contactedBy ? {
      ...(request.contactedBy as any),
      _id: (request.contactedBy as any)._id.toString(),
    } : undefined,
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-dark mb-2">Demo Requests</h1>
        <p className="text-neutral">Manage and respond to demo requests</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <SuccessMessage />
        <DemoRequestsList requests={requestsData} currentUserId={session.user.id} />
      </div>
    </div>
  );
}
