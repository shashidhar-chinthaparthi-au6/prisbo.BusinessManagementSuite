import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helpers';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import Project from '@/models/Project';
import { logActivity } from '@/lib/activity-logger';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, projectId, status, priority, dueDate, assignedTo } = body;

    if (!title || !projectId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const organizationId = session.user.currentOrganizationId || session.user.organizationId;

    // Verify project belongs to same organization
    const project = await Project.findOne({ _id: projectId, organizationId });
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      );
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate || undefined,
      assignedTo: assignedTo || undefined,
      createdBy: session.user.id,
      organizationId,
    });

    // Log activity
    await logActivity(
      'project',
      'Task Created',
      `Created task: ${title}`,
      session.user.id,
      projectId,
      organizationId
    );

    return NextResponse.json(task, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create task' },
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
    const projectId = searchParams.get('projectId');
    const assignedTo = searchParams.get('assignedTo');
    const status = searchParams.get('status');

    const query: any = {
      organizationId, // Tenant isolation
    };
    
    if (projectId) {
      query.projectId = projectId;
    }

    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    if (status) {
      query.status = status;
    }

    const tasks = await Task.find(query)
      .populate('projectId', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ tasks });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}
