import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helpers';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { createNotification } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    const organizationId = session.user.currentOrganizationId || session.user.organizationId;

    // Check if user already exists in this organization
    const existingUser = await User.findOne({ 
      email: email.toLowerCase(),
      organizationId 
    });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists in your organization' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      organizationId,
      currentOrganizationId: organizationId,
    });

    // Notify the new user
    await createNotification(
      user._id.toString(),
      'success',
      'Welcome to Prisbo!',
      `Your account has been created. You can now log in.`,
      '/dashboard'
    );

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}
