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

    let student;
    
    // Handle users from User collection
    if (req.student.isFromUserCollection) {
      // Find existing Student record by userId
      student = await Student.findOne({ userId: req.student._id });
      
      if (student) {
        // Update existing Student record
        student.current_cgpa = current_cgpa;
        student.semesters = processedSemesters;
        student.updatedAt = Date.now();
        await student.save();
      } else {
        // Create new Student record if it doesn't exist
        student = new Student({
          registration_no: req.student.registration_no,
          name: req.student.name,
          password: 'temp_password',
          current_cgpa,
          semesters: processedSemesters,
          userId: req.student._id // Link to User collection
        });
        await student.save();
      }
    } else {
      // Handle users from Student collection
      student = await Student.findByIdAndUpdate(
        req.student._id,
        {
          current_cgpa,
          semesters: processedSemesters
        },
        { new: true, runValidators: true }
      ).select('-password');
    }

    // Remove password from response
    const studentData = student.toObject();
    delete studentData.password;

    res.status(200).json({
      success: true,
      message: 'Student data updated successfully',
      data: studentData
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
    let student;
    
    // If user is from User collection, try to find corresponding Student record
    if (req.student.isFromUserCollection) {
      // Find by userId field that links to User collection
      student = await Student.findOne({ userId: req.student._id }).select('-password');
      
      console.log('Student record found for User:', student ? 'Yes' : 'No');
      if (student) {
        console.log('Found student data:', {
          registration_no: student.registration_no,
          name: student.name,
          semesters_count: student.semesters?.length || 0
        });
      }
      
      // If no Student record exists, return empty data structure
      if (!student) {
        return res.status(200).json({
          success: true,
          data: {
            registration_no: '', // Don't pre-fill with email
            name: req.student.name,
            current_cgpa: 0,
            semesters: []
          }
        });
      }
    } else {
      student = await Student.findById(req.student._id).select('-password');
    }

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

    let student;
    
    // Handle users from User collection
    if (req.student.isFromUserCollection) {
      // Find existing Student record by userId
      student = await Student.findOne({ userId: req.student._id });
      
      if (student) {
        // Update existing Student record
        student.registration_no = registration_no;
        student.name = name;
        student.current_cgpa = current_cgpa;
        student.semesters = processedSemesters;
        student.updatedAt = Date.now();
        await student.save();
      } else {
        // Create new Student record linked to User
        student = new Student({
          registration_no,
          name,
          password: 'temp_password',
          current_cgpa,
          semesters: processedSemesters,
          userId: req.student._id // Link to User collection
        });
        await student.save();
      }
    } else {
      // Handle users from Student collection
      student = await Student.findByIdAndUpdate(
        req.student._id,
        {
          registration_no,
          name,
          current_cgpa,
          semesters: processedSemesters
        },
        { new: true, runValidators: true }
      ).select('-password');
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Remove password from response
    const studentData = student.toObject();
    delete studentData.password;

    res.status(200).json({
      success: true,
      message: 'Student data saved successfully',
      data: studentData
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

