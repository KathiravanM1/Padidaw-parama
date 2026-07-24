import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const updateSeniorToAlumni = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const result = await User.updateMany({ role: 'student' }, { $set: { role: 'senior' } });

  console.log(`Updated ${result.modifiedCount} user(s) from senior → alumni.`);
  process.exit(0);
};

updateSeniorToAlumni().catch((err) => {
  console.error(err);
  process.exit(1);
});
