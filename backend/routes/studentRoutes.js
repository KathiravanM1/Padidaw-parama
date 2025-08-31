import express from 'express';
import { loginStudent, registerStudent, updateStudentData, getStudentData, saveStudentData } from '../controllers/studentController.js';
import { authenticateStudent } from '../middleware/studentAuth.js';

const router = express.Router();

// POST /api/students/register - Register new student
router.post('/register', registerStudent);

// POST /api/students/login - Student login
router.post('/login', loginStudent);

// POST /api/students/data - Create/Save student data (single user)
router.post('/data', authenticateStudent, saveStudentData);

// PUT /api/students/data - Update student data (authenticated)
router.put('/data', authenticateStudent, updateStudentData);

// GET /api/students/data - Get authenticated student's data
router.get('/data', authenticateStudent, getStudentData);

export default router;