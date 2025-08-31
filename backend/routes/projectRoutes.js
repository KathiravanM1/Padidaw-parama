import express from 'express';
import { createProject, getAllProjects, getProjectById } from '../controllers/projectController.js';

const router = express.Router();

// POST /api/projects - Create a new project
router.post('/', createProject);

// GET /api/projects - Get all projects with optional filtering
router.get('/', getAllProjects);

// GET /api/projects/:id - Get a specific project by ID
router.get('/:id', getProjectById);

export default router;