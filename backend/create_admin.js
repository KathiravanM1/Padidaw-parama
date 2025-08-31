import User from './models/User.js';
import { connectDB } from './db/db.js';

connectDB();

async function createAdmin() {
  try {
    
    const admin = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@vidivu.com',
      password: 'admin123',
      role: 'admin'
    });
    
    await admin.save();
    console.log('Admin created successfully!');
    console.log('Email: admin@vidivu.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();