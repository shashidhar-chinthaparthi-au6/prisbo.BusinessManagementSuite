import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helpers';
import connectDB from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { logActivity } from '@/lib/activity-logger';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const organizationId = session.user.currentOrganizationId || session.user.organizationId;

    const customer = await Customer.findOne({ 
      _id: params.id, 
      organizationId // Tenant isolation
    }).lean();

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

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
    const { name, email, phone, status, notes } = body;

    await connectDB();

    const organizationId = session.user.currentOrganizationId || session.user.organizationId;

    const customer = await Customer.findOneAndUpdate(
      { _id: params.id, organizationId }, // Tenant isolation
      { name, email, phone, status, notes },
      { new: true, runValidators: true }
    );

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Log activity
    await logActivity(
      'customer',
      'Customer Updated',
      `Updated customer: ${customer.name}`,
      session.user.id,
      customer._id.toString(),
      organizationId
    );

    return NextResponse.json(customer);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update customer' },
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
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const organizationId = session.user.currentOrganizationId || session.user.organizationId;

    const customer = await Customer.findOneAndDelete({ 
      _id: params.id, 
      organizationId // Tenant isolation
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Log activity
    await logActivity(
      'customer',
      'Customer Deleted',
      `Deleted customer: ${customer.name}`,
      session.user.id,
      customer._id.toString(),
      organizationId
    );

    return NextResponse.json({ message: 'Customer deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
