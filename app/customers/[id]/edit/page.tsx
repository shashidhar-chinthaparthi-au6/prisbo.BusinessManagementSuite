import { getServerSession } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Customer from '@/models/Customer';
import CustomerForm from '@/components/CustomerForm';
import { notFound } from 'next/navigation';

export default async function EditCustomerPage({
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

  const customer = await Customer.findOne({ _id: params.id, organizationId }).lean();

  if (!customer) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-dark mb-2">Edit Customer</h1>
        <p className="text-neutral">Update customer information</p>
      </div>
      <CustomerForm customer={JSON.parse(JSON.stringify(customer))} />
    </div>
  );
}
