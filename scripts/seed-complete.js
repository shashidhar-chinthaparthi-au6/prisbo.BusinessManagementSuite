const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// Models
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'manager', 'user'], default: 'user' },
}, { timestamps: true });

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, enum: ['new', 'contacted', 'qualified', 'converted'], default: 'new' },
  notes: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  dueDate: { type: Date, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: Date,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const DemoRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String, required: true },
  message: String,
  status: { type: String, enum: ['pending', 'contacted', 'scheduled', 'completed', 'cancelled'], default: 'pending' },
  notes: String,
  contactedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  scheduledDate: Date,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);
const DemoRequest = mongoose.models.DemoRequest || mongoose.model('DemoRequest', DemoRequestSchema);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await User.deleteMany({});
    // await Customer.deleteMany({});
    // await Project.deleteMany({});
    // await Task.deleteMany({});
    // await DemoRequest.deleteMany({});

    // Create Admin User
    const adminExists = await User.findOne({ email: 'admin@prisbo.com' });
    if (!adminExists) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      const admin = await User.create({
        name: 'Admin User',
        email: 'admin@prisbo.com',
        password: adminPassword,
        role: 'admin',
      });
      console.log('✅ Admin user created:', admin.email);
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create Manager User
    const managerExists = await User.findOne({ email: 'manager@prisbo.com' });
    let manager;
    if (!managerExists) {
      const managerPassword = await bcrypt.hash('manager123', 10);
      manager = await User.create({
        name: 'Manager User',
        email: 'manager@prisbo.com',
        password: managerPassword,
        role: 'manager',
      });
      console.log('✅ Manager user created:', manager.email);
    } else {
      manager = managerExists;
      console.log('ℹ️  Manager user already exists');
    }

    // Create Regular User
    const userExists = await User.findOne({ email: 'user@prisbo.com' });
    let regularUser;
    if (!userExists) {
      const userPassword = await bcrypt.hash('user123', 10);
      regularUser = await User.create({
        name: 'Regular User',
        email: 'user@prisbo.com',
        password: userPassword,
        role: 'user',
      });
      console.log('✅ Regular user created:', regularUser.email);
    } else {
      regularUser = userExists;
      console.log('ℹ️  Regular user already exists');
    }

    // Get admin for creating customers/projects
    const admin = await User.findOne({ email: 'admin@prisbo.com' });

    // Create Sample Customers
    const customers = [
      {
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '+1-555-0100',
        status: 'qualified',
        notes: 'Enterprise client, interested in full suite',
        createdBy: admin._id,
      },
      {
        name: 'Tech Startup Inc',
        email: 'hello@techstartup.com',
        phone: '+1-555-0200',
        status: 'contacted',
        notes: 'Initial contact made, follow-up scheduled',
        createdBy: admin._id,
      },
      {
        name: 'Global Solutions Ltd',
        email: 'info@globalsolutions.com',
        phone: '+1-555-0300',
        status: 'new',
        notes: 'New lead from website',
        createdBy: admin._id,
      },
      {
        name: 'Digital Agency Co',
        email: 'sales@digitalagency.com',
        phone: '+1-555-0400',
        status: 'converted',
        notes: 'Converted customer, active project',
        createdBy: admin._id,
      },
      {
        name: 'Innovation Labs',
        email: 'contact@innovationlabs.com',
        phone: '+1-555-0500',
        status: 'qualified',
        notes: 'Qualified lead, demo scheduled',
        createdBy: admin._id,
      },
    ];

    const createdCustomers = [];
    for (const customerData of customers) {
      const existing = await Customer.findOne({ email: customerData.email });
      if (!existing) {
        const customer = await Customer.create(customerData);
        createdCustomers.push(customer);
        console.log(`✅ Customer created: ${customer.name}`);
      } else {
        createdCustomers.push(existing);
        console.log(`ℹ️  Customer already exists: ${existing.name}`);
      }
    }

    // Create Sample Projects
    const projects = [
      {
        name: 'Website Redesign',
        description: 'Complete website redesign and development project',
        customerId: createdCustomers[0]._id,
        status: 'in-progress',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        assignedTo: manager._id,
        createdBy: admin._id,
      },
      {
        name: 'Mobile App Development',
        description: 'iOS and Android mobile application development',
        customerId: createdCustomers[1]._id,
        status: 'pending',
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        assignedTo: regularUser._id,
        createdBy: admin._id,
      },
      {
        name: 'E-commerce Platform',
        description: 'Build complete e-commerce solution',
        customerId: createdCustomers[3]._id,
        status: 'completed',
        dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        assignedTo: manager._id,
        createdBy: admin._id,
      },
      {
        name: 'API Integration',
        description: 'Third-party API integration project',
        customerId: createdCustomers[2]._id,
        status: 'in-progress',
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        assignedTo: regularUser._id,
        createdBy: admin._id,
      },
    ];

    const createdProjects = [];
    for (const projectData of projects) {
      const existing = await Project.findOne({ name: projectData.name });
      if (!existing) {
        const project = await Project.create(projectData);
        createdProjects.push(project);
        console.log(`✅ Project created: ${project.name}`);
      } else {
        createdProjects.push(existing);
        console.log(`ℹ️  Project already exists: ${existing.name}`);
      }
    }

    // Create Sample Tasks
    const tasks = [
      {
        title: 'Design mockups',
        description: 'Create initial design mockups for homepage',
        projectId: createdProjects[0]._id,
        status: 'completed',
        priority: 'high',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        assignedTo: manager._id,
        createdBy: admin._id,
      },
      {
        title: 'Frontend development',
        description: 'Build responsive frontend components',
        projectId: createdProjects[0]._id,
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        assignedTo: regularUser._id,
        createdBy: admin._id,
      },
      {
        title: 'Backend API setup',
        description: 'Set up backend API endpoints',
        projectId: createdProjects[0]._id,
        status: 'pending',
        priority: 'medium',
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        assignedTo: manager._id,
        createdBy: admin._id,
      },
      {
        title: 'UI/UX Design',
        description: 'Design user interface and experience',
        projectId: createdProjects[1]._id,
        status: 'pending',
        priority: 'high',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        assignedTo: manager._id,
        createdBy: admin._id,
      },
      {
        title: 'Database schema',
        description: 'Design and implement database schema',
        projectId: createdProjects[1]._id,
        status: 'in-progress',
        priority: 'medium',
        dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        assignedTo: regularUser._id,
        createdBy: admin._id,
      },
      {
        title: 'Testing',
        description: 'Comprehensive testing of all features',
        projectId: createdProjects[2]._id,
        status: 'completed',
        priority: 'high',
        assignedTo: manager._id,
        createdBy: admin._id,
      },
    ];

    for (const taskData of tasks) {
      const existing = await Task.findOne({ 
        title: taskData.title, 
        projectId: taskData.projectId 
      });
      if (!existing) {
        await Task.create(taskData);
        console.log(`✅ Task created: ${taskData.title}`);
      } else {
        console.log(`ℹ️  Task already exists: ${taskData.title}`);
      }
    }

    // Create Sample Demo Requests
    const demoRequests = [
      {
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1-555-1000',
        company: 'Example Corp',
        message: 'Interested in learning more about your platform',
        status: 'pending',
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+1-555-2000',
        company: 'Business Solutions',
        message: 'Would like to schedule a demo for our team',
        status: 'contacted',
      },
      {
        name: 'Mike Davis',
        email: 'mike@example.com',
        phone: '+1-555-3000',
        company: 'Tech Innovations',
        message: 'Looking for a comprehensive business management solution',
        status: 'scheduled',
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ];

    for (const requestData of demoRequests) {
      const existing = await DemoRequest.findOne({ email: requestData.email });
      if (!existing) {
        await DemoRequest.create(requestData);
        console.log(`✅ Demo request created: ${requestData.name}`);
      } else {
        console.log(`ℹ️  Demo request already exists: ${requestData.name}`);
      }
    }

    console.log('\n🎉 Seed data created successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('Admin: admin@prisbo.com / admin123');
    console.log('Manager: manager@prisbo.com / manager123');
    console.log('User: user@prisbo.com / user123');
    console.log('\n✅ Sample data includes:');
    console.log('- 5 Customers (various statuses)');
    console.log('- 4 Projects (various statuses)');
    console.log('- 6 Tasks (across projects)');
    console.log('- 3 Demo Requests (various statuses)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding:', error);
    process.exit(1);
  }
}

seed();
