import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helpers';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import { logActivity } from '@/lib/activity-logger';
import Customer from '@/models/Customer';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, customerId, status, dueDate, assignedTo } = body;

    if (!name || !customerId || !status || !dueDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const organizationId = session.user.currentOrganizationId || session.user.organizationId;

    // Verify customer belongs to same organization
    const customer = await Customer.findOne({ _id: customerId, organizationId });
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found or access denied' },
        { status: 404 }
      );
    }

    const project = await Project.create({
      name,
      description,
      customerId,
      status,
      dueDate,
      assignedTo: assignedTo || undefined,
      createdBy: session.user.id,
      organizationId,
    });

    // Log activity
    await logActivity(
      'project',
      'Project Created',
      `Created project: ${name}`,
      session.user.id,
      project._id.toString(),
      organizationId
    );

    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create project' },
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
    
    if (searchParams.get('status')) {
      query.status = searchParams.get('status');
    }

    const [projects, total] = await Promise.all([
      Project.find(query)
        .populate('customerId', 'name email')
        .populate('assignedTo', 'name')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean(),
      Project.countDocuments(query),
    ]);

    return NextResponse.json({
      projects,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
