import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from './lib/mongodb';
import User from './models/User';

const config = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Partial<Record<'email' | 'password', unknown>>) {
        if (!credentials?.email || !credentials?.password || typeof credentials.email !== 'string' || typeof credentials.password !== 'string') {
          throw new Error('Please enter your email and password');
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email.toLowerCase() }).lean();

        if (!user) {
          throw new Error('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }

        // Ensure organizationId exists
        if (!user.organizationId) {
          throw new Error('Your account is not associated with an organization. Please contact your administrator.');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          organizationId: user.organizationId.toString(),
          currentOrganizationId: (user.currentOrganizationId || user.organizationId).toString(),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.organizationId = user.organizationId;
        token.currentOrganizationId = user.currentOrganizationId;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        session.user.organizationId = token.organizationId as string;
        session.user.currentOrganizationId = token.currentOrganizationId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
