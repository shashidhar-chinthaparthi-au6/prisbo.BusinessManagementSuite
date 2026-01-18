import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import DemoRequest from '@/models/DemoRequest';
import Notification from '@/models/Notification';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, company, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !company) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    await connectDB();

    // Store demo request in database
    const demoRequest = await DemoRequest.create({
      name,
      email,
      phone,
      company,
      message,
      status: 'pending',
    });

    // Create notifications for all admin users in the system (for demo requests, notify all admins)
    // In a multi-tenant system, you might want to notify only super admins
    const adminUsers = await User.find({ role: 'admin' }, '_id organizationId').lean();
    
    if (adminUsers.length > 0) {
      const notifications = adminUsers.map((admin) => ({
        userId: admin._id,
        type: 'info' as const,
        title: 'New Demo Request',
        message: `${name} from ${company} requested a demo`,
        link: `/admin/demo-requests/${demoRequest._id}`,
        read: false,
        organizationId: (admin as any).organizationId?.toString() || null,
      })).filter(n => n.organizationId);

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

    return NextResponse.json(
      {
        message: 'Demo request submitted successfully',
        success: true,
        id: demoRequest._id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Demo request error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit demo request' },
      { status: 500 }
    );
  }
}
