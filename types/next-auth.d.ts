import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'admin' | 'manager' | 'user';
      organizationId: string;
      currentOrganizationId: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'manager' | 'user';
    organizationId: string;
    currentOrganizationId: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'admin' | 'manager' | 'user';
    organizationId: string;
    currentOrganizationId: string;
  }
}
