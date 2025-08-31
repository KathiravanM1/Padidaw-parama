import Student from '../models/Student.js';

// Single user authentication - always use the first student or create one
export const authenticateStudent = async (req, res, next) => {
  try {
    // Find the first student or create a default one
    let student = await Student.findOne().select('-password');
    
    if (!student) {
      // Create default student if none exists
      student = new Student({
        registration_no: 'DEFAULT_USER',
        name: 'Default Student',
        password: 'default123',
        semesters: []
      });
      await student.save();
      student = await Student.findById(student._id).select('-password');
    }

    req.student = student;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message
    });
  }
};