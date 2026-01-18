import { getServerSession } from '@/lib/auth-helpers';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Customer from '@/models/Customer';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import CustomersList from '@/components/CustomersList';
import CustomersSearch from '@/components/CustomersSearch';
import SuccessMessage from '@/components/SuccessMessage';

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { search?: string; status?: string; page?: string };
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
  
  if (searchParams.search) {
    query.$or = [
      { name: { $regex: searchParams.search, $options: 'i' } },
      { email: { $regex: searchParams.search, $options: 'i' } },
    ];
  }

  if (searchParams.status) {
    query.status = searchParams.status;
  }

  const [customersData, total] = await Promise.all([
    Customer.find(query).sort({ createdAt: -1 }).limit(limit).skip(skip).lean(),
    Customer.countDocuments(query),
  ]);

  const customers = customersData.map((customer: any) => ({
    ...customer,
    _id: customer._id.toString(),
  }));

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-dark mb-2">Customers</h1>
          <p className="text-neutral">Manage your customers and leads</p>
        </div>
        <Link
          href="/customers/new"
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Customer
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <SuccessMessage />
        <CustomersSearch />
        <CustomersList customers={customers} totalPages={totalPages} currentPage={page} />
      </div>
    </div>
  );
}
