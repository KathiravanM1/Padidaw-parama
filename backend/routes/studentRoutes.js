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

export default router;