import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  id: String,
  name: String,
  credits: Number,
  hoursAbsent: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const attendanceEntrySchema = new mongoose.Schema({
  id: Number, // timestamp ID
  date: { type: Date, default: Date.now },
  subjectId: String,
  status: { type: String, enum: ["present", "absent"], required: true }
}, { _id: false });

const attendanceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "admin"], default: "student" },
  rollNumber: { type: String, unique: true, required: true },

  subjects: { type: Map, of: subjectSchema, default: {} },
  attendanceHistory: { type: [attendanceEntrySchema], default: [] },

  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
