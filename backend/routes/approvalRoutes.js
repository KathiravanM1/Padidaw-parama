import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

router.use(authenticate, authorize('admin'));

// Get all pending approvals (senior + alumni)
router.get('/pending', async (req, res) => {
  try {
    const pending = await User.find({
      role: { $in: ['senior', 'alumni'] },
      isApproved: false,
      isActive: true,
    }).select('-password').sort({ createdAt: -1 });
    res.json({ pendingSeniors: pending });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve user (senior or alumni)
router.put('/approve/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isApproved) return res.status(400).json({ message: 'User is already approved' });

    user.isApproved = true;
    user.approvedBy = req.user._id;
    user.approvedAt = new Date();
    await user.save();

    res.json({ message: `${user.role} approved successfully`, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reject user (senior or alumni) — deletes the account
router.delete('/reject/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: 'User rejected and deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
