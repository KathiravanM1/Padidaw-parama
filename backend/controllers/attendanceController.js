import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Attendance from "../models/Attendance.js";

// ------------------- REGISTER -------------------
// REGISTER
export const registerAttendance = async (req, res) => {
  try {
    const { name, email, password, rollNumber, role } = req.body;

    if (await Attendance.findOne({ email }))
      return res.status(400).json({ message: "User exists" });

    const hash = await bcrypt.hash(password, 10);
    const student = await Attendance.create({
      name,
      email,
      password: hash,
      rollNumber,
      role
    });

    res.status(201).json({ message: "Registered successfully", student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------- LOGIN -------------------
export const loginAttendance = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Attendance.findOne({ email });
    if (!student) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, student.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT token
    const token = jwt.sign(
      { id: student._id, role: student.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send JWT as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only over HTTPS in prod
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    // Send response without token
    res.json({ message: "Logged in successfully", student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------- ADD SUBJECT -------------------
export const addSubject = async (req, res) => {
  try {
    const { id, name, credits } = req.body;
    const student = await Attendance.findById(req.user.id);
    if (!student) return res.status(404).json({ message: "User not found" });

    if (student.subjects.has(id))
      return res.status(400).json({ message: "Subject already exists" });

    student.subjects.set(id, { id, name, credits });
    student.lastUpdated = new Date();
    await student.save();

    res.json({ message: "Subject added", subjects: student.subjects });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------- MARK ATTENDANCE -------------------
export const markAttendance = async (req, res) => {
  try {
    const { subjectId, status, hours = 1 } = req.body;
    const student = await Attendance.findById(req.user.id);
    if (!student) return res.status(404).json({ message: "User not found" });

    const subject = student.subjects.get(subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    const subjectName = subject.name;
    const newAttendance = { 
      id: Date.now(), 
      date: new Date(), 
      subjectId, 
      subjectName,
      status, 
      hours: parseInt(hours) 
    };
    
    if (status === "absent") {
      subject.hoursAbsent = (subject.hoursAbsent || 0) + parseInt(hours);
    }
    
    student.subjects.set(subjectId, subject);
    student.attendanceHistory.push(newAttendance);
    student.lastUpdated = new Date();
    await student.save();

    res.json({ message: "Attendance marked", attendanceHistory: student.attendanceHistory });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------- GET MY ATTENDANCE -------------------
export const getMyAttendance = async (req, res) => {
  try {
    const student = await Attendance.findById(req.user.id).select("attendanceHistory subjects rollNumber");
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------- GET ALL ATTENDANCE (ADMIN) ------------------- 
export const getAllAttendance = async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admins only" });

  const students = await Attendance.find().select("name rollNumber subjects attendanceHistory");
  res.json(students);
};

export const updateAttendanceStatus = async (req, res) => {
  try {
    const { attendanceId, newHours } = req.body;

    const user = await Attendance.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const attendance = user.attendanceHistory.find(a => a.id === attendanceId);
    if (!attendance) return res.status(404).json({ message: "Attendance record not found" });

    const subject = user.subjects.get(attendance.subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    // Adjust hoursAbsent based on hour difference
    const oldHours = attendance.hours || 1;
    const hourDifference = parseInt(newHours) - oldHours;
    
    if (attendance.status === "absent") {
      subject.hoursAbsent = Math.max(0, (subject.hoursAbsent || 0) + hourDifference);
    }

    attendance.hours = parseInt(newHours);
    user.subjects.set(attendance.subjectId, subject);
    user.lastUpdated = new Date();
    await user.save();

    res.json({ message: "Attendance updated", attendanceHistory: user.attendanceHistory });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.body;
    const user = await Attendance.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const attendanceIndex = user.attendanceHistory.findIndex(a => a.id === attendanceId);
    if (attendanceIndex === -1) return res.status(404).json({ message: "Attendance record not found" });

    const attendance = user.attendanceHistory[attendanceIndex];
    const subject = user.subjects.get(attendance.subjectId);
    
    if (subject && attendance.status === "absent") {
      const hoursToDeduct = attendance.hours || 1;
      subject.hoursAbsent = Math.max(0, (subject.hoursAbsent || 0) - hoursToDeduct);
      user.subjects.set(attendance.subjectId, subject);
    }

    user.attendanceHistory.splice(attendanceIndex, 1);
    user.lastUpdated = new Date();
    await user.save();

    res.json({ message: "Attendance deleted", attendanceHistory: user.attendanceHistory });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const { subjectId } = req.body;
    const user = await Attendance.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.subjects.has(subjectId)) {
      return res.status(404).json({ message: "Subject not found" });
    }

    user.subjects.delete(subjectId);
    user.attendanceHistory = user.attendanceHistory.filter(a => a.subjectId !== subjectId);
    user.lastUpdated = new Date();
    await user.save();

    res.json({ message: "Subject deleted", subjects: user.subjects });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logoutAttendance = (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
  res.json({ message: "Logged out successfully" });
};
