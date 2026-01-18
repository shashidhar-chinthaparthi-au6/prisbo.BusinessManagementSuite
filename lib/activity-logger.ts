import connectDB from './mongodb';
import Activity from '@/models/Activity';
import { createNotification } from './notifications';
import { getOrganizationId } from './tenant';

export async function logActivity(
  type: 'customer' | 'project' | 'team',
  action: string,
  description: string,
  userId: string,
  relatedId?: string,
  organizationId?: string
) {
  try {
    await connectDB();
    const orgId = organizationId || await getOrganizationId();
    
    if (!orgId) {
      console.warn('No organization ID available for activity logging');
      return;
    }

    await Activity.create({
      type,
      action,
      description,
      userId,
      relatedId,
      organizationId: orgId,
    });
  } catch (error) {
    // Don't throw - activity logging shouldn't break the main flow
    console.error('Failed to log activity:', error);
  }
}

export async function logActivityWithNotification(
  type: 'customer' | 'project' | 'team',
  action: string,
  description: string,
  userId: string,
  relatedId?: string,
  notifyUserId?: string
) {
  await logActivity(type, action, description, userId, relatedId);
  
  if (notifyUserId) {
    await createNotification(
      notifyUserId,
      'info',
      action,
      description,
      relatedId ? `/${type}s/${relatedId}` : undefined
    );
  }
}
