import crypto from 'crypto';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { sendMail } from '../utils/mailer.js';

export const register = async (req, res) => {
  try {
    // console.log('Register request body:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { email, password, firstName, lastName, role, linkedinUrl, githubUrl } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const userRole = role || 'student';

    if ((userRole === 'senior' || userRole === 'alumni') && !linkedinUrl) {
      return res.status(400).json({ message: 'LinkedIn URL is required for senior/alumni.' });
    }

    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role: userRole,
      ...(linkedinUrl && { linkedinUrl }),
      ...(githubUrl && { githubUrl }),
    });

    // console.log('Saving user...');
    await user.save();
    // console.log('User saved successfully');

    if (userRole === 'senior' || userRole === 'alumni') {
      res.status(201).json({
        message: `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} registration submitted successfully. Please wait for admin approval before you can login.`,
        requiresApproval: true,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isApproved: user.isApproved
        }
      });
    } else {
      // Student registration is auto-approved
      const token = generateToken({ userId: user._id, role: user.role });
      // console.log('Token generated');

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isApproved: user.isApproved
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if senior or alumni user is approved
    if ((user.role === 'senior' || user.role === 'alumni') && !user.isApproved) {
      return res.status(403).json({ 
        message: 'Your account is pending admin approval. Please wait for approval before logging in.',
        requiresApproval: true
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken({ userId: user._id, role: user.role });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isApproved: user.isApproved
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account found with that email.' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpiry = Date.now() + 1000 * 60 * 30; // 30 minutes
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <p>Hi ${user.firstName},</p>
        <p>Click the link below to reset your password. This link expires in 30 minutes.</p>
        <a href="${resetUrl}" style="background:#16a34a;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Reset Password</a>
        <p>If you didn't request this, ignore this email.</p>
      `,
    });

    res.json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token.' });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, rollNo, registrationNo, linkedinUrl, githubUrl } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, rollNo, registrationNo, linkedinUrl, githubUrl },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};