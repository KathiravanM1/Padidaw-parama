import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  id: String,
  name: String,
  credits: Number,
  hoursAbsent: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const attendanceEntrySchema = new mongoose.Schema({
  id: Number,
  date: { type: Date, default: Date.now },
  subjectId: String,
  subjectName: String,
  status: { type: String, enum: ["present", "absent"], required: true },
  hours: { type: Number, default: 1 }
}, { _id: false });

const attendanceSchema = new mongoose.Schema({
  rollNumber: { type: String, unique: true, required: true },
  role: { type: String, default: "student" },
  subjects: { type: Map, of: subjectSchema, default: {} },
  attendanceHistory: { type: [attendanceEntrySchema], default: [] },
  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
