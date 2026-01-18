import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helpers';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Organization from '@/models/Organization';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { organizationId } = body;

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify user belongs to this organization
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has access to this organization
    if (user.organizationId.toString() !== organizationId) {
      // In future, you can add multi-org support where users can belong to multiple orgs
      return NextResponse.json(
        { error: 'You do not have access to this organization' },
        { status: 403 }
      );
    }

    // Verify organization exists and is active
    const organization = await Organization.findById(organizationId);
    
    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    if (organization.status !== 'active') {
      return NextResponse.json(
        { error: 'Organization is not active' },
        { status: 403 }
      );
    }

    // Update user's current organization
    user.currentOrganizationId = organizationId;
    await user.save();

    return NextResponse.json({
      message: 'Organization switched successfully',
      organizationId: organizationId,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to switch organization' },
      { status: 500 }
    );
  }
}
