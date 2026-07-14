// MongoDB Schema for Student CGPA Data
// This would be implemented on the backend

const StudentCGPASchema = {
  userId: {
    type: 'ObjectId',
    required: true,
    ref: 'User',
    index: true
  },
  registrationNo: {
    type: 'String',
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: 'String',
    required: true,
    trim: true
  },
  semesters: [{
    semesterNumber: {
      type: 'Number',
      required: true,
      min: 1,
      max: 8
    },
    courses: [{
      courseCode: {
        type: 'String',
        required: true,
        trim: true
      },
      courseName: {
        type: 'String',
        required: true,
        trim: true
      },
      credits: {
        type: 'Number',
        required: true,
        min: 0,
        max: 10
      },
      grade: {
        type: 'String',
        required: true,
        enum: ['O', 'A+', 'A', 'B+', 'B', 'C', 'U']
      },
      gradePoints: {
        type: 'Number',
        required: true,
        min: 0,
        max: 10
      }
    }],
    gpa: {
      type: 'Number',
      min: 0,
      max: 10
    }
  }],
  overallCGPA: {
    type: 'Number',
    min: 0,
    max: 10
  },
  createdAt: {
    type: 'Date',
    default: Date.now
  },
  updatedAt: {
    type: 'Date',
    default: Date.now
  }
};

// Indexes for better query performance
const indexes = [
  { userId: 1 },
  { registrationNo: 1 },
  { userId: 1, updatedAt: -1 }
];

export default StudentCGPASchema;