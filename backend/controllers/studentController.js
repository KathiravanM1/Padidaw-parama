import Student from '../models/Student.js';
import jwt from 'jsonwebtoken';

// Student login
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
      { id: student._id, registration_no: student.registration_no },
      process.env.JWT_SECRET || 'student_secret_key',
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

// Student registration
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
      { id: student._id, registration_no: student.registration_no },
      process.env.JWT_SECRET || 'student_secret_key',
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

// Update student data (authenticated)
export const updateStudentData = async (req, res) => {
  try {
    const { semesters } = req.body;

    if (!semesters) {
      return res.status(400).json({
        success: false,
        message: 'Semesters data is required'
      });
    }

    // Calculate CGPA
    const calculateCGPA = (semesters) => {
      const allCourses = semesters.flatMap(sem => sem.courses || []);
      const passedCourses = allCourses.filter(course => course.grade !== 'U');
      const totalCredits = passedCourses.reduce((sum, course) => sum + course.credits, 0);
      const totalGradePoints = passedCourses.reduce((sum, course) => sum + (course.credits * course.grade_points), 0);
      return totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;
    };

    // Calculate GPA for each semester
    const processedSemesters = semesters.map(semester => {
      const passedCourses = semester.courses.filter(course => course.grade !== 'U');
      const totalCredits = passedCourses.reduce((sum, course) => sum + course.credits, 0);
      const totalGradePoints = passedCourses.reduce((sum, course) => sum + (course.credits * course.grade_points), 0);
      const gpa = totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;
      
      return {
        ...semester,
        gpa: parseFloat(gpa.toFixed(2))
      };
    });

    const current_cgpa = parseFloat(calculateCGPA(processedSemesters).toFixed(2));

    // Update only the authenticated student's data
    const student = await Student.findByIdAndUpdate(
      req.student._id,
      {
        current_cgpa,
        semesters: processedSemesters
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Student data updated successfully',
      data: student
    });
  } catch (error) {
    console.error('Error updating student data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update student data',
      error: error.message
    });
  }
};

// Get authenticated student's data
export const getStudentData = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id).select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Error fetching student data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student data',
      error: error.message
    });
  }
};

// Create or update student CGPA data for authenticated student
export const saveStudentData = async (req, res) => {
  try {
    const { registration_no, name, semesters } = req.body;

    if (!registration_no || !name) {
      return res.status(400).json({
        success: false,
        message: 'Registration number and name are required'
      });
    }

    // Calculate CGPA
    const calculateCGPA = (semesters) => {
      const allCourses = semesters.flatMap(sem => sem.courses || []);
      const passedCourses = allCourses.filter(course => course.grade !== 'U');
      const totalCredits = passedCourses.reduce((sum, course) => sum + course.credits, 0);
      const totalGradePoints = passedCourses.reduce((sum, course) => sum + (course.credits * course.grade_points), 0);
      return totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;
    };

    // Calculate GPA for each semester
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

    const current_cgpa = parseFloat(calculateCGPA(processedSemesters).toFixed(2));

    // Update only the authenticated student's data
    const student = await Student.findByIdAndUpdate(
      req.student._id,
      {
        registration_no,
        name,
        current_cgpa,
        semesters: processedSemesters
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student data saved successfully',
      data: student
    });
  } catch (error) {
    console.error('Error saving student data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save student data',
      error: error.message
    });
  }
};

