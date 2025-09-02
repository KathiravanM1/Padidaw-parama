import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';

// JWT-based student authentication
export const authenticateStudent = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'student_secret_key');
    const student = await Student.findById(decoded.id).select('-password');
    
    if (!student) {
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