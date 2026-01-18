import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helpers';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
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

    const task = await Task.findOne({ 
      _id: params.id, 
      organizationId // Tenant isolation
    })
      .populate('projectId', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name')
      .lean();

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch task' },
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
    const { title, description, status, priority, dueDate, assignedTo } = body;

    await connectDB();

    const organizationId = session.user.currentOrganizationId || session.user.organizationId;

    const task = await Task.findOneAndUpdate(
      { _id: params.id, organizationId }, // Tenant isolation
      { title, description, status, priority, dueDate, assignedTo: assignedTo || undefined },
      { new: true, runValidators: true }
    )
      .populate('projectId', 'name');

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Log activity
    await logActivity(
      'project',
      'Task Updated',
      `Updated task: ${task.title}`,
      session.user.id,
      (task.projectId as any)._id.toString(),
      organizationId
    );

    return NextResponse.json(task);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update task' },
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

    const task = await Task.findOneAndDelete({ 
      _id: params.id, 
      organizationId // Tenant isolation
    })
      .populate('projectId', 'name');

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Log activity
    await logActivity(
      'project',
      'Task Deleted',
      `Deleted task: ${task.title}`,
      session.user.id,
      (task.projectId as any)._id.toString(),
      organizationId
    );

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete task' },
      { status: 500 }
    );
  }
}
