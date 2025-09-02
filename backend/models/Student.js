import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const CourseSchema = new mongoose.Schema({
  course_code: { type: String, required: true },
  course_name: { type: String, required: true },
  credits: { type: Number, required: true },
  grade: { type: String, required: true },
  grade_points: { type: Number, required: true }
}, { _id: false });

const SemesterSchema = new mongoose.Schema({
  semester_number: { type: Number, required: true },
  gpa: { type: Number, default: 0 },
  courses: [CourseSchema]
}, { _id: false });

const StudentSchema = new mongoose.Schema({
  registration_no: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  current_cgpa: { type: Number, default: 0 },
  semesters: [SemesterSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add compound unique index for registration_no to prevent duplicates per student
StudentSchema.index({ registration_no: 1 }, { unique: true });

StudentSchema.pre('save', async function(next) {
  this.updatedAt = Date.now();
  
  // Hash password if it's modified
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  
  next();
});

StudentSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('Student', StudentSchema);