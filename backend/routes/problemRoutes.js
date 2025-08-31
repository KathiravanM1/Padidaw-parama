import express from 'express';
import { createProblem, getAllProblems, getProblemById } from '../controllers/problemController.js';

const router = express.Router();

// POST /api/problems - Create a new problem
router.post('/', createProblem);

// GET /api/problems - Get all problems with optional filtering
router.get('/', getAllProblems);

// GET /api/problems/:id - Get a specific problem by ID
router.get('/:id', getProblemById);

export default router;