import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helpers';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const organizationId = session.user.currentOrganizationId || session.user.organizationId;

    const notifications = await Notification.find({ 
      userId: session.user.id,
      organizationId // Tenant isolation
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const unreadCount = await Notification.countDocuments({
      userId: session.user.id,
      organizationId,
      read: false,
    });

    const notificationsData = notifications.map((notif: any) => ({
      ...notif,
      _id: notif._id.toString(),
    }));

    return NextResponse.json({
      notifications: notificationsData,
      unreadCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
