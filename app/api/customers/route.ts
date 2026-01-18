import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helpers';
import connectDB from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { logActivity } from '@/lib/activity-logger';
import { getOrganizationId } from '@/lib/tenant';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, phone, status, notes } = body;

    if (!name || !email || !phone || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const organizationId = session.user.currentOrganizationId || session.user.organizationId;

    const customer = await Customer.create({
      name,
      email,
      phone,
      status,
      notes,
      createdBy: session.user.id,
      organizationId,
    });

    // Log activity
    await logActivity(
      'customer',
      'Customer Created',
      `Created customer: ${name}`,
      session.user.id,
      customer._id.toString(),
      organizationId
    );

    return NextResponse.json(customer, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create customer' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const organizationId = session.user.currentOrganizationId || session.user.organizationId;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const query: any = {
      organizationId, // Tenant isolation
    };
    
    if (searchParams.get('search')) {
      query.$or = [
        { name: { $regex: searchParams.get('search'), $options: 'i' } },
        { email: { $regex: searchParams.get('search'), $options: 'i' } },
      ];
    }

    if (searchParams.get('status')) {
      query.status = searchParams.get('status');
    }

    const [customers, total] = await Promise.all([
      Customer.find(query).sort({ createdAt: -1 }).limit(limit).skip(skip).lean(),
      Customer.countDocuments(query),
    ]);

    return NextResponse.json({
      customers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}
