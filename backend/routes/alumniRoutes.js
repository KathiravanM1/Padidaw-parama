import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { getAllPosts, createPost, deletePost } from '../controllers/alumniController.js';

const router = express.Router();

router.get('/', authenticate, getAllPosts);
router.post('/', authenticate, authorize('alumni', 'admin'), upload.single('file'), createPost);
router.delete('/:id', authenticate, authorize('alumni', 'admin'), deletePost);

export default router;
