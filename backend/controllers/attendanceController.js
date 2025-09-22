import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Attendance from "../models/Attendance.js";

// ------------------- GET USER BY ROLL NUMBER -------------------
export const getUserByRollNumber = async (req, res) => {
  try {
    const { rollNumber } = req.params;
    
    if (!rollNumber || rollNumber === 'undefined') {
      return res.status(400).json({ message: "Roll number is required" });
    }
    
    let student = await Attendance.findOne({ rollNumber });
    
    // If student doesn't exist, create new one
    if (!student) {
      student = await Attendance.create({
        rollNumber,
      });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------- ADD SUBJECT -------------------
export const addSubject = async (req, res) => {
  try {
    const { id, credits, name, rollNumber } = req.body;
    const student = await Attendance.findOne({ rollNumber });
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
    const { subjectId, status, hours, rollNumber } = req.body;
    const student = await Attendance.findOne({ rollNumber });
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
      hours: parseInt(hours),
    };

    if (status === "absent") {
      subject.hoursAbsent = (subject.hoursAbsent || 0) + parseInt(hours);
    }

    student.subjects.set(subjectId, subject);
    student.attendanceHistory.push(newAttendance);
    student.lastUpdated = new Date();
    await student.save();

    res.json({
      message: "Attendance marked",
      attendanceHistory: student.attendanceHistory,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------- GET MY ATTENDANCE -------------------


// ------------------- GET ALL ATTENDANCE (ADMIN) -------------------
export const getAllAttendance = async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admins only" });

  const students = await Attendance.find().select(
    "name rollNumber subjects attendanceHistory"
  );
  res.json(students);
};

export const updateAttendanceStatus = async (req, res) => {
  try {
    const { attendanceId, newHours, rollNumber } = req.body;

    const user = await Attendance.findOne({ rollNumber });
    if (!user) return res.status(404).json({ message: "User not found" });

    const attendance = user.attendanceHistory.find(
      (a) => a.id === attendanceId
    );
    if (!attendance)
      return res.status(404).json({ message: "Attendance record not found" });

    const subject = user.subjects.get(attendance.subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    // Adjust hoursAbsent based on hour difference
    const oldHours = attendance.hours || 1;
    const hourDifference = parseInt(newHours) - oldHours;

    if (attendance.status === "absent") {
      subject.hoursAbsent = Math.max(
        0,
        (subject.hoursAbsent || 0) + hourDifference
      );
    }

    attendance.hours = parseInt(newHours);
    user.subjects.set(attendance.subjectId, subject);
    user.lastUpdated = new Date();
    await user.save();

    res.json({
      message: "Attendance updated",
      attendanceHistory: user.attendanceHistory,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteAttendance = async (req, res) => {
  try {
    const { attendanceId, rollNumber } = req.body;
    const user = await Attendance.findOne({ rollNumber });
    if (!user) return res.status(404).json({ message: "User not found" });

    const attendanceIndex = user.attendanceHistory.findIndex(
      (a) => a.id === attendanceId
    );
    if (attendanceIndex === -1)
      return res.status(404).json({ message: "Attendance record not found" });

    const attendance = user.attendanceHistory[attendanceIndex];
    const subject = user.subjects.get(attendance.subjectId);

    if (subject && attendance.status === "absent") {
      const hoursToDeduct = attendance.hours || 1;
      subject.hoursAbsent = Math.max(
        0,
        (subject.hoursAbsent || 0) - hoursToDeduct
      );
      user.subjects.set(attendance.subjectId, subject);
    }

    user.attendanceHistory.splice(attendanceIndex, 1);
    user.lastUpdated = new Date();
    await user.save();

    res.json({
      message: "Attendance deleted",
      attendanceHistory: user.attendanceHistory,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const { subjectId, rollNumber } = req.body;
    const user = await Attendance.findOne({ rollNumber });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.subjects.has(subjectId)) {
      return res.status(404).json({ message: "Subject not found" });
    }

    user.subjects.delete(subjectId);
    user.attendanceHistory = user.attendanceHistory.filter(
      (a) => a.subjectId !== subjectId
    );
    user.lastUpdated = new Date();
    await user.save();

    res.json({ message: "Subject deleted", subjects: user.subjects });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAttendancebyId = (req,res)=>{
  try {
    const attendanceId = req.params.id;
    const data = Attendance.findById(attendanceId);
    res.json({message:"Data Successfully fetched" , data : data})
    
  } catch (error) {
    res.json({error: error})    
  }

}


