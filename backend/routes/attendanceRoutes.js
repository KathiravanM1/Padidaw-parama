import express from "express";

import { addSubject, getAllAttendance, getUserByRollNumber, markAttendance, updateAttendanceStatus, deleteAttendance, deleteSubject } from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/user/:rollNumber", getUserByRollNumber);
router.put("/update-status", updateAttendanceStatus);
router.delete("/attendance", deleteAttendance);
router.delete("/subject", deleteSubject);
router.post("/subject", addSubject);
router.post("/attendance", markAttendance);
router.get("/attendance/all", getAllAttendance);

export default router;
