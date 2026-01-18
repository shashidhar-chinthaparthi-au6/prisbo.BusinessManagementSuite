import connectDB from './mongodb';
import Notification from '@/models/Notification';
import User from '@/models/User';
import { getOrganizationId } from './tenant';

export async function createNotification(
  userId: string,
  type: 'info' | 'success' | 'warning' | 'error',
  title: string,
  message: string,
  link?: string,
  organizationId?: string
) {
  try {
    await connectDB();
    
    // Get organization ID from user if not provided
    let orgId = organizationId;
    if (!orgId) {
      const user = await User.findById(userId).lean();
      orgId = user ? (user as any).organizationId?.toString() : null;
    }
    
    if (!orgId) {
      console.warn('No organization ID available for notification');
      return;
    }

    await Notification.create({
      userId,
      type,
      title,
      message,
      link,
      read: false,
      organizationId: orgId,
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
}

export async function createNotificationForRole(
  role: 'admin' | 'manager' | 'user',
  type: 'info' | 'success' | 'warning' | 'error',
  title: string,
  message: string,
  link?: string,
  organizationId?: string
) {
  try {
    await connectDB();
    const UserModel = (await import('@/models/User')).default;
    
    const query: any = { role };
    if (organizationId) {
      query.organizationId = organizationId;
    }
    
    const users = await UserModel.find(query, '_id organizationId').lean();
    
    if (users.length > 0) {
      const notifications = users.map((user) => ({
        userId: user._id,
        type,
        title,
        message,
        link,
        read: false,
        organizationId: organizationId || (user as any).organizationId?.toString(),
      })).filter(n => n.organizationId); // Filter out users without org

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }
  } catch (error) {
    console.error('Failed to create notifications for role:', error);
  }
}
