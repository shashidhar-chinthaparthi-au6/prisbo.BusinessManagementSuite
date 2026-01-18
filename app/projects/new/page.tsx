import ProjectForm from '@/components/ProjectForm';

export default function NewProjectPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-dark mb-2">New Project</h1>
        <p className="text-neutral">Create a new project and link it to a customer</p>
      </div>
      <ProjectForm />
    </div>
  );
}
