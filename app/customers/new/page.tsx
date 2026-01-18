import CustomerForm from '@/components/CustomerForm';

export default function NewCustomerPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-dark mb-2">Add New Customer</h1>
        <p className="text-neutral">Create a new customer or lead in your CRM</p>
      </div>
      <CustomerForm />
    </div>
  );
}
