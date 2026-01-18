import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helpers';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, role, password } = body;

    await connectDB();

    const organizationId = session.user.currentOrganizationId || session.user.organizationId;

    const updateData: any = { name, email, role };
    
    if (password && password.length >= 6) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findOneAndUpdate(
      { _id: params.id, organizationId }, // Tenant isolation
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Prevent deleting yourself
    if (params.id === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      );
    }

    await connectDB();

    const organizationId = session.user.currentOrganizationId || session.user.organizationId;

    const user = await User.findOneAndDelete({ 
      _id: params.id, 
      organizationId // Tenant isolation
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}
