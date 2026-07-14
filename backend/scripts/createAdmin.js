import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Drop stale clerkUserId index if it exists
  try {
    await mongoose.connection.collection('users').dropIndex('clerkUserId_1');
    console.log('Dropped stale clerkUserId index.');
  } catch {
    // Index doesn't exist, safe to continue
  }

  const existing = await User.findOne({ email: 'admin@padidaw.com' });
  if (existing) {
    console.log('Admin already exists.');
    process.exit(0);
  }

  const admin = new User({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@padidaw.com',
    password: 'Admin@123',
    role: 'admin',
    isActive: true,
    isApproved: true,
  });

  await admin.save();
  console.log('Admin created successfully.');
  console.log('Email   :', admin.email);
  console.log('Password: Admin@123');
  process.exit(0);
};

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
