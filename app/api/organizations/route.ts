import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-helpers';
import connectDB from '@/lib/mongodb';
import Organization from '@/models/Organization';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { createNotification } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, phone, domain, plan, ownerName, ownerEmail, ownerPassword } = body;

    if (!name || !email || !ownerName || !ownerEmail || !ownerPassword) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    // Generate unique slug
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    let slug = baseSlug;
    let counter = 1;
    
    while (await Organization.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create organization owner user
    const hashedPassword = await bcrypt.hash(ownerPassword, 10);
    
    // Check if owner email already exists
    const existingUser = await User.findOne({ email: ownerEmail.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create organization first
    const organization = await Organization.create({
      name,
      slug,
      email: email.toLowerCase(),
      phone,
      domain,
      plan: plan || 'free',
      status: 'active',
      billingEmail: email.toLowerCase(),
      ownerId: null, // Will update after user creation
      maxUsers: plan === 'free' ? 5 : plan === 'starter' ? 10 : plan === 'professional' ? 50 : 999,
      maxProjects: plan === 'free' ? 10 : plan === 'starter' ? 50 : plan === 'professional' ? 200 : 9999,
    });

    // Create owner user
    const owner = await User.create({
      name: ownerName,
      email: ownerEmail.toLowerCase(),
      password: hashedPassword,
      role: 'admin',
      organizationId: organization._id,
      currentOrganizationId: organization._id,
    });

    // Update organization with owner
    organization.ownerId = owner._id;
    await organization.save();

    // Notify owner
    await createNotification(
      owner._id.toString(),
      'success',
      'Welcome to Prisbo!',
      `Your organization "${name}" has been created. You can now start managing your business.`,
      '/dashboard'
    );

    return NextResponse.json({
      organization: {
        ...organization.toObject(),
        _id: organization._id.toString(),
      },
      owner: {
        ...owner.toObject(),
        _id: owner._id.toString(),
        password: undefined,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Organization creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create organization' },
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

    const organization = await Organization.findById(session.user.currentOrganizationId).lean();

    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    return NextResponse.json({
      organization: {
        ...organization,
        _id: organization._id.toString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch organization' },
      { status: 500 }
    );
  }
}
