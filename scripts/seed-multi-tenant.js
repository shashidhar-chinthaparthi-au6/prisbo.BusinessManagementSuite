const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define MONGODB_URI in .env.local');
  process.exit(1);
}

// Schemas
const OrganizationSchema = new mongoose.Schema({
  name: String,
  slug: String,
  email: String,
  phone: String,
  plan: { type: String, enum: ['free', 'starter', 'professional', 'enterprise'], default: 'free' },
  status: { type: String, enum: ['active', 'suspended', 'cancelled'], default: 'active' },
  ownerId: mongoose.Schema.Types.ObjectId,
  maxUsers: Number,
  maxProjects: Number,
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  role: { type: String, enum: ['admin', 'manager', 'user'], default: 'user' },
  organizationId: mongoose.Schema.Types.ObjectId,
  currentOrganizationId: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

const CustomerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  status: { type: String, enum: ['new', 'contacted', 'qualified', 'converted'], default: 'new' },
  notes: String,
  createdBy: mongoose.Schema.Types.ObjectId,
  organizationId: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

const ProjectSchema = new mongoose.Schema({
  name: String,
  description: String,
  customerId: mongoose.Schema.Types.ObjectId,
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  dueDate: Date,
  assignedTo: mongoose.Schema.Types.ObjectId,
  createdBy: mongoose.Schema.Types.ObjectId,
  organizationId: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  projectId: mongoose.Schema.Types.ObjectId,
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: Date,
  assignedTo: mongoose.Schema.Types.ObjectId,
  createdBy: mongoose.Schema.Types.ObjectId,
  organizationId: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

const ActivitySchema = new mongoose.Schema({
  type: { type: String, enum: ['customer', 'project', 'team'] },
  action: String,
  description: String,
  userId: mongoose.Schema.Types.ObjectId,
  relatedId: mongoose.Schema.Types.ObjectId,
  organizationId: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

const NotificationSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  type: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
  title: String,
  message: String,
  link: String,
  read: { type: Boolean, default: false },
  organizationId: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

const Organization = mongoose.models.Organization || mongoose.model('Organization', OrganizationSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);
const Activity = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);
const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

async function seedMultiTenant() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Organization.deleteMany({});
    await User.deleteMany({});
    await Customer.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    await Activity.deleteMany({});
    await Notification.deleteMany({});

    // Organization 1: Acme Corporation (Professional Plan)
    console.log('📦 Creating Organization 1: Acme Corporation...');
    const org1 = await Organization.create({
      name: 'Acme Corporation',
      slug: 'acme-corporation',
      email: 'contact@acme.com',
      phone: '+1-555-0101',
      plan: 'professional',
      status: 'active',
      maxUsers: 50,
      maxProjects: 200,
    });

    const org1Owner = await User.create({
      name: 'John Admin',
      email: 'admin@acme.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      organizationId: org1._id,
      currentOrganizationId: org1._id,
    });

    org1.ownerId = org1Owner._id;
    await org1.save();

    const org1Manager = await User.create({
      name: 'Sarah Manager',
      email: 'sarah@acme.com',
      password: await bcrypt.hash('manager123', 10),
      role: 'manager',
      organizationId: org1._id,
      currentOrganizationId: org1._id,
    });

    const org1User = await User.create({
      name: 'Mike User',
      email: 'mike@acme.com',
      password: await bcrypt.hash('user123', 10),
      role: 'user',
      organizationId: org1._id,
      currentOrganizationId: org1._id,
    });

    // Customers for Org 1
    const org1Customer1 = await Customer.create({
      name: 'Tech Solutions Inc',
      email: 'contact@techsolutions.com',
      phone: '+1-555-1001',
      status: 'qualified',
      notes: 'Interested in enterprise features',
      createdBy: org1Owner._id,
      organizationId: org1._id,
    });

    const org1Customer2 = await Customer.create({
      name: 'Global Industries',
      email: 'sales@globalind.com',
      phone: '+1-555-1002',
      status: 'converted',
      notes: 'Long-term client',
      createdBy: org1Owner._id,
      organizationId: org1._id,
    });

    const org1Customer3 = await Customer.create({
      name: 'StartupXYZ',
      email: 'hello@startupxyz.com',
      phone: '+1-555-1003',
      status: 'new',
      createdBy: org1Manager._id,
      organizationId: org1._id,
    });

    // Projects for Org 1
    const org1Project1 = await Project.create({
      name: 'Website Redesign',
      description: 'Complete website overhaul',
      customerId: org1Customer1._id,
      status: 'in-progress',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      assignedTo: org1Manager._id,
      createdBy: org1Owner._id,
      organizationId: org1._id,
    });

    const org1Project2 = await Project.create({
      name: 'Mobile App Development',
      description: 'iOS and Android app',
      customerId: org1Customer2._id,
      status: 'completed',
      dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      assignedTo: org1User._id,
      createdBy: org1Owner._id,
      organizationId: org1._id,
    });

    // Tasks for Org 1
    await Task.create({
      title: 'Design mockups',
      description: 'Create initial design mockups',
      projectId: org1Project1._id,
      status: 'completed',
      priority: 'high',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      assignedTo: org1Manager._id,
      createdBy: org1Owner._id,
      organizationId: org1._id,
    });

    await Task.create({
      title: 'Frontend development',
      description: 'Build React components',
      projectId: org1Project1._id,
      status: 'in-progress',
      priority: 'high',
      assignedTo: org1User._id,
      createdBy: org1Manager._id,
      organizationId: org1._id,
    });

    // Activities for Org 1
    await Activity.create({
      type: 'customer',
      action: 'Customer Created',
      description: 'Created customer: Tech Solutions Inc',
      userId: org1Owner._id,
      relatedId: org1Customer1._id,
      organizationId: org1._id,
    });

    await Activity.create({
      type: 'project',
      action: 'Project Created',
      description: 'Created project: Website Redesign',
      userId: org1Owner._id,
      relatedId: org1Project1._id,
      organizationId: org1._id,
    });

    // Notifications for Org 1
    await Notification.create({
      userId: org1Owner._id,
      type: 'success',
      title: 'Welcome to Prisbo!',
      message: 'Your organization has been set up successfully',
      link: '/dashboard',
      organizationId: org1._id,
    });

    console.log('✅ Organization 1 created with 3 users, 3 customers, 2 projects, 2 tasks');

    // Organization 2: StartupHub (Starter Plan)
    console.log('📦 Creating Organization 2: StartupHub...');
    const org2 = await Organization.create({
      name: 'StartupHub',
      slug: 'startuphub',
      email: 'hello@startuphub.com',
      phone: '+1-555-0202',
      plan: 'starter',
      status: 'active',
      maxUsers: 10,
      maxProjects: 50,
    });

    const org2Owner = await User.create({
      name: 'Emma Founder',
      email: 'emma@startuphub.com',
      password: await bcrypt.hash('emma123', 10),
      role: 'admin',
      organizationId: org2._id,
      currentOrganizationId: org2._id,
    });

    org2.ownerId = org2Owner._id;
    await org2.save();

    const org2User = await User.create({
      name: 'Alex Developer',
      email: 'alex@startuphub.com',
      password: await bcrypt.hash('alex123', 10),
      role: 'user',
      organizationId: org2._id,
      currentOrganizationId: org2._id,
    });

    // Customers for Org 2
    const org2Customer1 = await Customer.create({
      name: 'Local Business Co',
      email: 'info@localbiz.com',
      phone: '+1-555-2001',
      status: 'contacted',
      notes: 'Follow up next week',
      createdBy: org2Owner._id,
      organizationId: org2._id,
    });

    const org2Customer2 = await Customer.create({
      name: 'Small Business Inc',
      email: 'contact@smallbiz.com',
      phone: '+1-555-2002',
      status: 'new',
      createdBy: org2Owner._id,
      organizationId: org2._id,
    });

    // Projects for Org 2
    const org2Project1 = await Project.create({
      name: 'Brand Identity',
      description: 'Logo and branding design',
      customerId: org2Customer1._id,
      status: 'pending',
      dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      assignedTo: org2User._id,
      createdBy: org2Owner._id,
      organizationId: org2._id,
    });

    // Tasks for Org 2
    await Task.create({
      title: 'Research competitors',
      description: 'Analyze competitor branding',
      projectId: org2Project1._id,
      status: 'pending',
      priority: 'medium',
      assignedTo: org2User._id,
      createdBy: org2Owner._id,
      organizationId: org2._id,
    });

    // Activities for Org 2
    await Activity.create({
      type: 'customer',
      action: 'Customer Created',
      description: 'Created customer: Local Business Co',
      userId: org2Owner._id,
      relatedId: org2Customer1._id,
      organizationId: org2._id,
    });

    console.log('✅ Organization 2 created with 2 users, 2 customers, 1 project, 1 task');

    // Organization 3: Enterprise Solutions (Enterprise Plan)
    console.log('📦 Creating Organization 3: Enterprise Solutions...');
    const org3 = await Organization.create({
      name: 'Enterprise Solutions',
      slug: 'enterprise-solutions',
      email: 'contact@enterprise.com',
      phone: '+1-555-0303',
      plan: 'enterprise',
      status: 'active',
      maxUsers: 999,
      maxProjects: 9999,
    });

    const org3Owner = await User.create({
      name: 'David CEO',
      email: 'david@enterprise.com',
      password: await bcrypt.hash('david123', 10),
      role: 'admin',
      organizationId: org3._id,
      currentOrganizationId: org3._id,
    });

    org3.ownerId = org3Owner._id;
    await org3.save();

    const org3Manager1 = await User.create({
      name: 'Lisa Director',
      email: 'lisa@enterprise.com',
      password: await bcrypt.hash('lisa123', 10),
      role: 'manager',
      organizationId: org3._id,
      currentOrganizationId: org3._id,
    });

    const org3Manager2 = await User.create({
      name: 'Tom Lead',
      email: 'tom@enterprise.com',
      password: await bcrypt.hash('tom123', 10),
      role: 'manager',
      organizationId: org3._id,
      currentOrganizationId: org3._id,
    });

    // Customers for Org 3
    const org3Customer1 = await Customer.create({
      name: 'Fortune 500 Corp',
      email: 'procurement@fortune500.com',
      phone: '+1-555-3001',
      status: 'qualified',
      notes: 'Enterprise deal in progress',
      createdBy: org3Owner._id,
      organizationId: org3._id,
    });

    const org3Customer2 = await Customer.create({
      name: 'Mega Corp Industries',
      email: 'sales@megacorp.com',
      phone: '+1-555-3002',
      status: 'converted',
      notes: 'Multi-year contract',
      createdBy: org3Owner._id,
      organizationId: org3._id,
    });

    const org3Customer3 = await Customer.create({
      name: 'Big Tech Company',
      email: 'contact@bigtech.com',
      phone: '+1-555-3003',
      status: 'contacted',
      createdBy: org3Manager1._id,
      organizationId: org3._id,
    });

    const org3Customer4 = await Customer.create({
      name: 'Global Enterprise',
      email: 'info@globalent.com',
      phone: '+1-555-3004',
      status: 'new',
      createdBy: org3Manager2._id,
      organizationId: org3._id,
    });

    // Projects for Org 3
    const org3Project1 = await Project.create({
      name: 'Enterprise Platform',
      description: 'Large-scale platform development',
      customerId: org3Customer1._id,
      status: 'in-progress',
      dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      assignedTo: org3Manager1._id,
      createdBy: org3Owner._id,
      organizationId: org3._id,
    });

    const org3Project2 = await Project.create({
      name: 'Cloud Migration',
      description: 'Migrate to cloud infrastructure',
      customerId: org3Customer2._id,
      status: 'in-progress',
      dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      assignedTo: org3Manager2._id,
      createdBy: org3Owner._id,
      organizationId: org3._id,
    });

    const org3Project3 = await Project.create({
      name: 'API Integration',
      description: 'Third-party API integration',
      customerId: org3Customer3._id,
      status: 'pending',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdBy: org3Manager1._id,
      organizationId: org3._id,
    });

    // Tasks for Org 3
    await Task.create({
      title: 'Architecture design',
      description: 'Design system architecture',
      projectId: org3Project1._id,
      status: 'completed',
      priority: 'high',
      assignedTo: org3Manager1._id,
      createdBy: org3Owner._id,
      organizationId: org3._id,
    });

    await Task.create({
      title: 'Database setup',
      description: 'Configure database cluster',
      projectId: org3Project1._id,
      status: 'in-progress',
      priority: 'high',
      assignedTo: org3Manager1._id,
      createdBy: org3Owner._id,
      organizationId: org3._id,
    });

    await Task.create({
      title: 'Security audit',
      description: 'Perform security review',
      projectId: org3Project2._id,
      status: 'pending',
      priority: 'high',
      assignedTo: org3Manager2._id,
      createdBy: org3Owner._id,
      organizationId: org3._id,
    });

    // Activities for Org 3
    await Activity.create({
      type: 'customer',
      action: 'Customer Created',
      description: 'Created customer: Fortune 500 Corp',
      userId: org3Owner._id,
      relatedId: org3Customer1._id,
      organizationId: org3._id,
    });

    await Activity.create({
      type: 'project',
      action: 'Project Created',
      description: 'Created project: Enterprise Platform',
      userId: org3Owner._id,
      relatedId: org3Project1._id,
      organizationId: org3._id,
    });

    // Notifications for Org 3
    await Notification.create({
      userId: org3Owner._id,
      type: 'info',
      title: 'New Customer Added',
      message: 'Fortune 500 Corp has been added',
      link: '/customers',
      organizationId: org3._id,
    });

    console.log('✅ Organization 3 created with 4 users, 4 customers, 3 projects, 3 tasks');

    console.log('\n🎉 Multi-tenant seed data created successfully!\n');
    console.log('📊 Summary:');
    console.log('   - 3 Organizations');
    console.log('   - 9 Users (3 owners, 3 managers, 3 users)');
    console.log('   - 9 Customers');
    console.log('   - 6 Projects');
    console.log('   - 6 Tasks');
    console.log('   - 3 Activities');
    console.log('   - 2 Notifications\n');

    console.log('🔑 Login Credentials:\n');
    console.log('Organization 1 - Acme Corporation (Professional):');
    console.log('   Admin: admin@acme.com / admin123');
    console.log('   Manager: sarah@acme.com / manager123');
    console.log('   User: mike@acme.com / user123\n');

    console.log('Organization 2 - StartupHub (Starter):');
    console.log('   Admin: emma@startuphub.com / emma123');
    console.log('   User: alex@startuphub.com / alex123\n');

    console.log('Organization 3 - Enterprise Solutions (Enterprise):');
    console.log('   Admin: david@enterprise.com / david123');
    console.log('   Manager: lisa@enterprise.com / lisa123');
    console.log('   Manager: tom@enterprise.com / tom123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedMultiTenant();
