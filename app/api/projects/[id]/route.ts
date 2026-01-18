import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helpers';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
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

    const project = await Project.findOne({ 
      _id: params.id, 
      organizationId // Tenant isolation
    })
      .populate('customerId')
      .populate('assignedTo')
      .lean();

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch project' },
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
    const { name, description, customerId, status, dueDate, assignedTo } = body;

    await connectDB();

    const organizationId = session.user.currentOrganizationId || session.user.organizationId;

    const project = await Project.findOneAndUpdate(
      { _id: params.id, organizationId }, // Tenant isolation
      { name, description, customerId, status, dueDate, assignedTo: assignedTo || undefined },
      { new: true, runValidators: true }
    );

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Log activity
    await logActivity(
      'project',
      'Project Updated',
      `Updated project: ${project.name}`,
      session.user.id,
      project._id.toString(),
      organizationId
    );

    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update project' },
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

    const project = await Project.findOneAndDelete({ 
      _id: params.id, 
      organizationId // Tenant isolation
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Log activity
    await logActivity(
      'project',
      'Project Deleted',
      `Deleted project: ${project.name}`,
      session.user.id,
      project._id.toString(),
      organizationId
    );

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete project' },
      { status: 500 }
    );
  }
}
