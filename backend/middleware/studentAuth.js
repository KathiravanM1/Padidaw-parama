import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import User from '../models/User.js';

// JWT-based student authentication
export const authenticateStudent = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Decoded token:', decoded);
    
    let student = null;
    
    // First, try to find in Student collection
    student = await Student.findById(decoded.userId || decoded.id).select('-password');
    console.log('Student found in Student collection:', student ? 'Yes' : 'No');
    
    // If not found by ID, try to find by registration_no if it exists in token
    if (!student && decoded.registration_no) {
      student = await Student.findOne({ registration_no: decoded.registration_no }).select('-password');
      console.log('Student found by registration_no in Student collection:', student ? 'Yes' : 'No');
    }
    
    // If still not found, check User collection for users with role 'student'
    if (!student) {
      const user = await User.findById(decoded.userId || decoded.id).select('-password');
      console.log('User found in User collection:', user ? 'Yes' : 'No');
      
      if (user && user.role === 'student') {
        // Check if there's an existing Student record linked to this user
        const existingStudent = await Student.findOne({ userId: user._id }).select('-password');
        console.log('Existing Student record found for User:', existingStudent ? 'Yes' : 'No');
        
        if (existingStudent) {
          // Use the existing Student record
          student = existingStudent;
        } else {
          // Convert User to Student-like object for compatibility
          student = {
            _id: user._id,
            registration_no: user.registrationNo || user.email,
            name: `${user.firstName} ${user.lastName}`.trim(),
            email: user.email,
            current_cgpa: 0,
            semesters: [],
            isFromUserCollection: true
          };
          console.log('User converted to student object:', student.name);
        }
      }
    }
    
    if (!student) {
      console.log('No student found with userId:', decoded.userId || decoded.id);
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Student not found or user is not a student.'
      });
    }

    req.student = student;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token.',
      error: error.message
    });
  }
};