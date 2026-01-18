import { getServerSession } from './auth-helpers';
import connectDB from './mongodb';
import Organization from '@/models/Organization';
import User from '@/models/User';

export async function getCurrentOrganization() {
  const session = await getServerSession();
  
  if (!session) {
    return null;
  }

  await connectDB();

  const user = await User.findById(session.user.id).lean();
  
  if (!user) {
    return null;
  }

  const orgId = (user as any).currentOrganizationId || (user as any).organizationId;
  
  if (!orgId) {
    return null;
  }

  const organization = await Organization.findById(orgId).lean();
  
  return organization ? {
    ...organization,
    _id: organization._id.toString(),
  } : null;
}

export async function getOrganizationId(): Promise<string | null> {
  const org = await getCurrentOrganization();
  return org?._id || null;
}

export function addTenantFilter(query: any, organizationId: string | null) {
  if (organizationId) {
    query.organizationId = organizationId;
  }
  return query;
}
