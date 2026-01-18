import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helpers';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const organizationId = session.user.currentOrganizationId || session.user.organizationId;

    await Notification.updateMany(
      { userId: session.user.id, organizationId, read: false }, // Tenant isolation
      { read: true }
    );

    return NextResponse.json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update notifications' },
      { status: 500 }
    );
  }
}
