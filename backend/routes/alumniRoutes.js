import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { getAllPosts, createPost, deletePost } from '../controllers/alumniController.js';
import User from '../models/User.js';

const router = express.Router();

// Get all approved alumni with contact info
router.get('/directory', authenticate, async (req, res) => {
  try {
    const alumni = await User.find({ role: 'alumni', isApproved: true, isActive: true })
      .select('firstName lastName linkedinUrl githubUrl createdAt')
      .sort({ createdAt: -1 });
    res.json({ alumni });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', authenticate, getAllPosts);
router.post('/', authenticate, authorize('alumni', 'admin'), upload.single('file'), createPost);
router.delete('/:id', authenticate, authorize('alumni', 'admin'), deletePost);

export default router;
