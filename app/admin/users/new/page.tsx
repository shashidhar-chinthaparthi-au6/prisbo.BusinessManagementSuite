import UserForm from '@/components/admin/UserForm';

export default function NewUserPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-dark mb-2">Add New User</h1>
        <p className="text-neutral">Create a new team member account</p>
      </div>
      <UserForm />
    </div>
  );
}
