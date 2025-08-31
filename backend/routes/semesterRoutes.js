import express from "express";
import { addSemester, getSemesters, addSubjectToSemester } from "../controllers/semesterController.js";

const semrouter = express.Router();

semrouter.post("/", addSemester);
semrouter.get("/", getSemesters);
semrouter.post("/:semesterId/subjects", addSubjectToSemester);

export default semrouter;
