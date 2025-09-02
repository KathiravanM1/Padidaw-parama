import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';

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

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'student_secret_key');
    console.log('Decoded token:', decoded);
    
    // Try to find student by the userId from token
    let student = await Student.findById(decoded.userId || decoded.id).select('-password');
    console.log('Student found by ID:', student ? 'Yes' : 'No');
    
    // If not found by ID, try to find by registration_no if it exists in token
    if (!student && decoded.registration_no) {
      student = await Student.findOne({ registration_no: decoded.registration_no }).select('-password');
      console.log('Student found by registration_no:', student ? 'Yes' : 'No');
    }
    
    if (!student) {
      console.log('No student found with userId:', decoded.userId || decoded.id);
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Student not found.'
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