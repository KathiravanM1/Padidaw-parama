import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import User from '../models/User.js';

// Legacy JWT-based student authentication (for backward compatibility)
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
    
    // Try to find user first (new system)
    const user = await User.findById(decoded.userId || decoded.id).select('-password');
    if (user && user.role === 'student') {
      // Convert to student format for legacy compatibility
      const existingStudent = await Student.findOne({ userId: user._id }).select('-password');
      
      req.student = existingStudent || {
        _id: user._id,
        registration_no: user.registrationNo || user.email,
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        current_cgpa: 0,
        semesters: [],
        isFromUserCollection: true
      };
      return next();
    }
    
    // Fallback to legacy student authentication
    const student = await Student.findById(decoded.userId || decoded.id).select('-password');
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