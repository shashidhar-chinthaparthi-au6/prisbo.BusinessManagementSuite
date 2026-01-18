const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'manager', 'user'], default: 'user' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await User.findOne({ email: 'admin@prisbo.com' });
    
    if (!admin) {
      await User.create({
        name: 'Admin User',
        email: 'admin@prisbo.com',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('✅ Admin user created!');
      console.log('Email: admin@prisbo.com');
      console.log('Password: admin123');
    } else {
      console.log('Admin user already exists');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seed();
