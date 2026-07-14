import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  getMyAttendance,
  addSubject,
  markAttendance,
  updateAttendanceStatus,
  deleteAttendance,
  deleteSubject,
  getAllAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.use(authenticate);

router.get("/me", getMyAttendance);
router.post("/subject", addSubject);
router.delete("/subject", deleteSubject);
router.post("/mark", markAttendance);
router.put("/update", updateAttendanceStatus);
router.delete("/entry", deleteAttendance);
router.get("/all", getAllAttendance);

export default router;
