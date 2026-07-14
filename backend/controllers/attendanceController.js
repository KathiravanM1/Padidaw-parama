import Attendance from "../models/Attendance.js";

const getOrCreateStudent = async (userId) => {
  let student = await Attendance.findOne({ userId });
  if (!student) student = await Attendance.create({ userId });
  return student;
};

export const getMyAttendance = async (req, res) => {
  try {
    const student = await getOrCreateStudent(req.user._id);
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addSubject = async (req, res) => {
  try {
    const { id, credits, name } = req.body;
    const student = await getOrCreateStudent(req.user._id);

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

export const markAttendance = async (req, res) => {
  try {
    const { subjectId, status, hours } = req.body;
    const student = await getOrCreateStudent(req.user._id);

    const subject = student.subjects.get(subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    const newAttendance = {
      id: Date.now(),
      date: new Date(),
      subjectId,
      subjectName: subject.name,
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

    res.json({ message: "Attendance marked", attendanceHistory: student.attendanceHistory });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateAttendanceStatus = async (req, res) => {
  try {
    const { attendanceId, newHours } = req.body;
    const user = await getOrCreateStudent(req.user._id);

    const attendance = user.attendanceHistory.find((a) => a.id === attendanceId);
    if (!attendance) return res.status(404).json({ message: "Attendance record not found" });

    const subject = user.subjects.get(attendance.subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    const hourDifference = parseInt(newHours) - (attendance.hours || 1);
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
    const user = await getOrCreateStudent(req.user._id);

    const index = user.attendanceHistory.findIndex((a) => a.id === attendanceId);
    if (index === -1) return res.status(404).json({ message: "Attendance record not found" });

    const attendance = user.attendanceHistory[index];
    const subject = user.subjects.get(attendance.subjectId);
    if (subject && attendance.status === "absent") {
      subject.hoursAbsent = Math.max(0, (subject.hoursAbsent || 0) - (attendance.hours || 1));
      user.subjects.set(attendance.subjectId, subject);
    }

    user.attendanceHistory.splice(index, 1);
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
    const user = await getOrCreateStudent(req.user._id);

    if (!user.subjects.has(subjectId))
      return res.status(404).json({ message: "Subject not found" });

    user.subjects.delete(subjectId);
    user.attendanceHistory = user.attendanceHistory.filter((a) => a.subjectId !== subjectId);
    user.lastUpdated = new Date();
    await user.save();

    res.json({ message: "Subject deleted", subjects: user.subjects });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Admins only" });
    const students = await Attendance.find().populate("userId", "firstName lastName email rollNo");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
