import express from 'express';
import { 
  loginStudent, 
  registerStudent, 
  getStudentScores, 
  addStudentScores, 
  updateStudentScores,
  // Legacy functions
  getStudentData,
  saveStudentData,
  updateStudentData
} from '../controllers/studentController.js';
import { authenticate } from '../middleware/auth.js';
import { authenticateStudent } from '../middleware/studentAuth.js';

const router = express.Router();

// Legacy routes for backward compatibility
router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.post('/data', authenticateStudent, saveStudentData);
router.put('/data', authenticateStudent, updateStudentData);
router.get('/data', authenticateStudent, getStudentData);

// New routes using User authentication
// GET /api/students/scores - Get student scores (requires User auth with student role)
router.get('/scores', authenticate, getStudentScores);

// POST /api/students/scores - Add student scores (requires User auth with student role)
router.post('/scores', authenticate, addStudentScores);

// PUT /api/students/scores - Update student scores (requires User auth with student role)
router.put('/scores', authenticate, updateStudentScores);

// Debug endpoint to test if routes are working
router.get('/test', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Student routes are working',
    user: {
      id: req.user._id,
      role: req.user.role,
      name: `${req.user.firstName} ${req.user.lastName}`.trim()
    }
  });
});

// Debug endpoint to check all students in database
router.get('/debug/all', authenticate, async (req, res) => {
  try {
    const students = await Student.find({}).select('-password').limit(10);
    res.json({
      success: true,
      count: students.length,
      students: students.map(s => ({
        _id: s._id,
        name: s.name,
        registration_no: s.registration_no,
        userId: s.userId,
        current_cgpa: s.current_cgpa,
        semesters_count: s.semesters?.length || 0
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;