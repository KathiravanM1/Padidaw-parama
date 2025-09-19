import express from "express";

import { attendanceProtect } from "../middleware/attendanceAuth.js";
import { addSubject, getAllAttendance, getMyAttendance, loginAttendance, logoutAttendance, markAttendance, registerAttendance, updateAttendanceStatus, deleteAttendance, deleteSubject } from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/register", registerAttendance);
router.post("/login", loginAttendance);
router.post("/logout", attendanceProtect, logoutAttendance);
router.put("/update-status", attendanceProtect, updateAttendanceStatus);
router.delete("/attendance", attendanceProtect, deleteAttendance);
router.delete("/subject", attendanceProtect, deleteSubject);
router.post("/subject", attendanceProtect, addSubject);
router.post("/attendance", attendanceProtect, markAttendance);
router.get("/attendance/me", attendanceProtect, getMyAttendance);
router.get("/attendance/all", attendanceProtect, getAllAttendance);

export default router;
