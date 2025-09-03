import Student from '../models/Student.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Student login (legacy - for direct student accounts)
export const loginStudent = async (req, res) => {
  try {
    const { registration_no, password } = req.body;

    if (!registration_no || !password) {
      return res.status(400).json({
        success: false,
        message: 'Registration number and password are required'
      });
    }

    const student = await Student.findOne({ registration_no });
    if (!student || !(await student.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { userId: student._id, registration_no: student.registration_no },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      data: {
        registration_no: student.registration_no,
        name: student.name,
        current_cgpa: student.current_cgpa,
        semesters: student.semesters
      }
    });
  } catch (error) {
    console.error('Error logging in student:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Student registration (legacy - for direct student accounts)
export const registerStudent = async (req, res) => {
  try {
    const { registration_no, name, password } = req.body;

    if (!registration_no || !name || !password) {
      return res.status(400).json({
        success: false,
        message: 'Registration number, name, and password are required'
      });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ registration_no });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student already registered'
      });
    }

    const student = new Student({
      registration_no,
      name,
      password,
      semesters: []
    });

    await student.save();

    const token = jwt.sign(
      { userId: student._id, registration_no: student.registration_no },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      data: {
        registration_no: student.registration_no,
        name: student.name,
        current_cgpa: student.current_cgpa,
        semesters: student.semesters
      }
    });
  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// Get student scores - Main endpoint for fetching student data
export const getStudentScores = async (req, res) => {
  try {
    console.log('Getting student scores for user:', req.user._id, 'Role:', req.user.role);
    
    // Check if user is a student
    if (req.user.role !== 'student') {
      console.log('Access denied - user role is:', req.user.role);
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only students can access this endpoint.'
      });
    }

    // Find existing student data linked to this user
    let studentData = await Student.findOne({ userId: req.user._id }).select('-password');
    console.log('Student data found:', studentData ? 'Yes' : 'No');
    
    if (studentData) {
      console.log('Student data details:', {
        registration_no: studentData.registration_no,
        name: studentData.name,
        semesters_count: studentData.semesters?.length || 0
      });
    }
    
    if (!studentData) {
      // No data exists, return empty structure
      console.log('No student data found, returning empty structure');
      return res.status(200).json({
        success: true,
        data: {
          registration_no: '',
          name: `${req.user.firstName} ${req.user.lastName}`.trim(),
          current_cgpa: 0,
          semesters: [],
          hasData: false
        }
      });
    }

    console.log('Returning existing student data');
    res.status(200).json({
      success: true,
      data: {
        registration_no: studentData.registration_no,
        name: studentData.name,
        current_cgpa: studentData.current_cgpa,
        semesters: studentData.semesters,
        hasData: true
      }
    });
  } catch (error) {
    console.error('Error fetching student scores:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student data',
      error: error.message
    });
  }
};

// Add student scores - Create new student data
export const addStudentScores = async (req, res) => {
  try {
    const { registration_no, name, semesters } = req.body;

    console.log('Adding student scores for user:', req.user._id);
    
    // Check if user is a student
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only students can access this endpoint.'
      });
    }

    if (!registration_no || !name) {
      return res.status(400).json({
        success: false,
        message: 'Registration number and name are required'
      });
    }

    // Check if student data already exists
    const existingData = await Student.findOne({ userId: req.user._id });
    if (existingData) {
      return res.status(400).json({
        success: false,
        message: 'Student data already exists. Use update endpoint instead.'
      });
    }

    // Calculate CGPA and GPA
    const processedSemesters = (semesters || []).map(semester => {
      const passedCourses = semester.courses.filter(course => course.grade !== 'U');
      const totalCredits = passedCourses.reduce((sum, course) => sum + course.credits, 0);
      const totalGradePoints = passedCourses.reduce((sum, course) => sum + (course.credits * course.grade_points), 0);
      const gpa = totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;
      
      return {
        ...semester,
        gpa: parseFloat(gpa.toFixed(2))
      };
    });

    const allCourses = processedSemesters.flatMap(sem => sem.courses || []);
    const passedCourses = allCourses.filter(course => course.grade !== 'U');
    const totalCredits = passedCourses.reduce((sum, course) => sum + course.credits, 0);
    const totalGradePoints = passedCourses.reduce((sum, course) => sum + (course.credits * course.grade_points), 0);
    const current_cgpa = totalCredits > 0 ? parseFloat((totalGradePoints / totalCredits).toFixed(2)) : 0;

    // Create new student record
    const studentData = new Student({
      registration_no,
      name,
      password: 'temp_password', // Not used for login
      current_cgpa,
      semesters: processedSemesters,
      userId: req.user._id
    });

    await studentData.save();

    res.status(201).json({
      success: true,
      message: 'Student data created successfully',
      data: {
        registration_no: studentData.registration_no,
        name: studentData.name,
        current_cgpa: studentData.current_cgpa,
        semesters: studentData.semesters
      }
    });
  } catch (error) {
    console.error('Error adding student scores:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add student data',
      error: error.message
    });
  }
};

// Update student scores - Update existing student data
export const updateStudentScores = async (req, res) => {
  try {
    const { registration_no, name, semesters } = req.body;

    console.log('Updating student scores for user:', req.user._id);
    
    // Check if user is a student
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only students can access this endpoint.'
      });
    }

    if (!registration_no || !name) {
      return res.status(400).json({
        success: false,
        message: 'Registration number and name are required'
      });
    }

    // Find existing student data
    let studentData = await Student.findOne({ userId: req.user._id });
    
    if (!studentData) {
      // Create new if doesn't exist
      return addStudentScores(req, res);
    }

    // Calculate CGPA and GPA
    const processedSemesters = (semesters || []).map(semester => {
      const passedCourses = semester.courses.filter(course => course.grade !== 'U');
      const totalCredits = passedCourses.reduce((sum, course) => sum + course.credits, 0);
      const totalGradePoints = passedCourses.reduce((sum, course) => sum + (course.credits * course.grade_points), 0);
      const gpa = totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;
      
      return {
        ...semester,
        gpa: parseFloat(gpa.toFixed(2))
      };
    });

    const allCourses = processedSemesters.flatMap(sem => sem.courses || []);
    const passedCourses = allCourses.filter(course => course.grade !== 'U');
    const totalCredits = passedCourses.reduce((sum, course) => sum + course.credits, 0);
    const totalGradePoints = passedCourses.reduce((sum, course) => sum + (course.credits * course.grade_points), 0);
    const current_cgpa = totalCredits > 0 ? parseFloat((totalGradePoints / totalCredits).toFixed(2)) : 0;

    // Update student data
    studentData.registration_no = registration_no;
    studentData.name = name;
    studentData.current_cgpa = current_cgpa;
    studentData.semesters = processedSemesters;
    studentData.updatedAt = Date.now();

    await studentData.save();

    res.status(200).json({
      success: true,
      message: 'Student data updated successfully',
      data: {
        registration_no: studentData.registration_no,
        name: studentData.name,
        current_cgpa: studentData.current_cgpa,
        semesters: studentData.semesters
      }
    });
  } catch (error) {
    console.error('Error updating student scores:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update student data',
      error: error.message
    });
  }
};

// Legacy functions for backward compatibility
export const getStudentData = getStudentScores;
export const saveStudentData = updateStudentScores;
export const updateStudentData = updateStudentScores;

