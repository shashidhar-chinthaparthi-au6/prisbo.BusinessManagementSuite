import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helpers';
import connectDB from '@/lib/mongodb';
import DemoRequest from '@/models/DemoRequest';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Demo requests are global, but we can filter by organization if needed
    const request = await DemoRequest.findById(params.id)
      .populate('contactedBy', 'name')
      .lean();

    if (!request) {
      return NextResponse.json({ error: 'Demo request not found' }, { status: 404 });
    }

    return NextResponse.json(request);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch demo request' },
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
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { status, notes, scheduledDate } = body;

    await connectDB();

    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (scheduledDate) updateData.scheduledDate = scheduledDate;
    if (status === 'contacted' || status === 'scheduled') {
      updateData.contactedBy = session.user.id;
    }

    const request = await DemoRequest.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('contactedBy', 'name');

    if (!request) {
      return NextResponse.json({ error: 'Demo request not found' }, { status: 404 });
    }

    return NextResponse.json(request);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update demo request' },
      { status: 500 }
    );
  }
}
