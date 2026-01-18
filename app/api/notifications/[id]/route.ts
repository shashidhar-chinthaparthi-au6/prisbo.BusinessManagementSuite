import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helpers';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    await connectDB();

    const organizationId = session.user.currentOrganizationId || session.user.organizationId;

    const notification = await Notification.findOneAndUpdate(
      { _id: params.id, userId: session.user.id, organizationId }, // Tenant isolation
      { read: body.read },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json(notification);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update notification' },
      { status: 500 }
    );
  }
}
