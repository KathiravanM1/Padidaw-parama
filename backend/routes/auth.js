import express from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { registerValidation, loginValidation } from '../middleware/validation.js';
import User from '../models/User.js';
import SeniorRoadmap from '../models/SeniorRoadmap.js';
import Problem from '../models/Problem.js';
import Project from '../models/Project.js';
import Semester from '../models/Semester.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

// Admin routes
router.get('/admin/users', authenticate, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get pending senior approvals
router.get('/admin/pending-seniors', authenticate, authorize('admin'), async (req, res) => {
  try {
    const pendingSeniors = await User.find({ 
      role: 'senior', 
      isApproved: false,
      isActive: true 
    }).select('-password').sort({ createdAt: -1 });
    
    res.json({ pendingSeniors });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve senior user
router.put('/admin/approve-senior/:userId', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'senior') {
      return res.status(400).json({ message: 'User is not a senior' });
    }
    
    if (user.isApproved) {
      return res.status(400).json({ message: 'User is already approved' });
    }
    
    user.isApproved = true;
    user.approvedBy = req.user._id;
    user.approvedAt = new Date();
    await user.save();
    
    res.json({ 
      message: 'Senior user approved successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isApproved: user.isApproved,
        approvedAt: user.approvedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reject senior user
router.delete('/admin/reject-senior/:userId', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'senior') {
      return res.status(400).json({ message: 'User is not a senior' });
    }
    
    await User.findByIdAndDelete(userId);
    
    res.json({ message: 'Senior user rejected and deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user
router.delete('/admin/users/:userId', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await User.findByIdAndDelete(userId);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user
router.put('/admin/users/:userId', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email, role, phoneNumber } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (role) user.role = role;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    
    await user.save();
    
    res.json({ 
      message: 'User updated successfully',
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        isApproved: user.isApproved,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all interview experiences (senior roadmaps)
router.get('/admin/interview-experiences', authenticate, authorize('admin'), async (req, res) => {
  try {
    const experiences = await SeniorRoadmap.find()
      .sort({ createdAt: -1 });
    
    res.json({ experiences });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete interview experience
router.delete('/admin/interview-experiences/:experienceId', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { experienceId } = req.params;
    
    const experience = await SeniorRoadmap.findById(experienceId);
    if (!experience) {
      return res.status(404).json({ message: 'Interview experience not found' });
    }
    
    // Delete resume from S3 if it exists
    if (experience.resumeUrl) {
      try {
        const { deleteFileFromS3 } = await import('../utils/s3Utils.js');
        await deleteFileFromS3(experience.resumeUrl);
      } catch (s3Error) {
        console.error('Failed to delete resume from S3:', s3Error);
        // Continue with MongoDB deletion even if S3 deletion fails
      }
    }
    
    await SeniorRoadmap.findByIdAndDelete(experienceId);
    
    res.json({ message: 'Interview experience and resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all problems
router.get('/admin/problems', authenticate, authorize('admin'), async (req, res) => {
  try {
    const problems = await Problem.find()
      .sort({ createdAt: -1 });
    
    res.json({ problems });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete problem
router.delete('/admin/problems/:problemId', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { problemId } = req.params;
    
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    
    await Problem.findByIdAndDelete(problemId);
    
    res.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all projects
router.get('/admin/projects', authenticate, authorize('admin'), async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ createdAt: -1 });
    
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete project
router.delete('/admin/projects/:projectId', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    await Project.findByIdAndDelete(projectId);
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all academic resources
router.get('/admin/academic-resources', authenticate, authorize('admin'), async (req, res) => {
  try {
    const semesters = await Semester.find();
    const resources = [];
    
    semesters.forEach(semester => {
      semester.subjects.forEach(subject => {
        subject.materials.forEach(material => {
          resources.push({
            _id: material._id,
            name: material.name,
            type: 'Material',
            semester: semester.name,
            subject: subject.name,
            uploadedBy: material.uploadedBy,
            date: material.date,
            url: material.url,
            resourceType: 'material',
            semesterId: semester._id,
            subjectId: subject._id
          });
        });
        subject.questionPapers.forEach(paper => {
          resources.push({
            _id: paper._id,
            name: paper.name,
            type: 'Question Paper',
            semester: semester.name,
            subject: subject.name,
            marks: paper.marks,
            date: paper.date,
            url: paper.url,
            resourceType: 'questionPaper',
            semesterId: semester._id,
            subjectId: subject._id
          });
        });
      });
    });
    
    res.json({ resources: resources.sort((a, b) => new Date(b.date) - new Date(a.date)) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete academic resource
router.delete('/admin/academic-resources/:resourceId', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { resourceType, semesterId, subjectId } = req.query;
    
    const semester = await Semester.findById(semesterId);
    if (!semester) {
      return res.status(404).json({ message: 'Semester not found' });
    }
    
    const subject = semester.subjects.id(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    if (resourceType === 'material') {
      const material = subject.materials.id(resourceId);
      if (!material) {
        return res.status(404).json({ message: 'Material not found' });
      }
      material.deleteOne();
    } else if (resourceType === 'questionPaper') {
      const paper = subject.questionPapers.id(resourceId);
      if (!paper) {
        return res.status(404).json({ message: 'Question paper not found' });
      }
      paper.deleteOne();
    } else {
      return res.status(400).json({ message: 'Invalid resource type' });
    }
    
    await semester.save();
    
    res.json({ message: 'Academic resource deleted successfully' });
  } catch (error) {
    console.error('Delete academic resource error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;