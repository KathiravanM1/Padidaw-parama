import express from "express";
import upload from "../middleware/upload.js";
import Semester from "../models/Semester.js";
import { deleteFileFromS3 } from "../utils/s3Utils.js";

const uploadrouter = express.Router();

// 🔹 Helper function to update subject array (materials or questionPapers)
async function saveFileToSubject(semId, subjectId, file, type) {
  const semester = await Semester.findOne({ semId: parseInt(semId) });
  if (!semester) throw new Error("Semester not found");

  const subject =
    semester.subjects.id(subjectId) ||
    semester.subjects.find((s) => s.id === parseInt(subjectId));
  if (!subject) throw new Error("Subject not found");

  // 🔹 Extract just file extension (pdf, docx, pptx, etc.)
  const fileType =
    file.mimetype && file.mimetype.includes("/")
      ? file.mimetype.split("/")[1]
      : "unknown";

  // Construct file object
  const fileObj = {
    name: file.originalname,
    url: file.location,
    type: fileType, 
  };

  if (type === "materials") {
    subject.materials.push(fileObj);
  } else if (type === "questionPapers") {
    subject.questionPapers.push(fileObj);
  }

  await semester.save();
  return { subject, fileObj };
}

// 🔹 Upload Material
uploadrouter.post(
  "/:semId/:subjectId/materials",
  upload.single("file"),
  async (req, res) => {
    try {
      const { semId, subjectId } = req.params;

      const { subject, fileObj } = await saveFileToSubject(
        semId,
        subjectId,
        req.file,
        "materials"
      );

      res.json({
        message: "Material uploaded & saved successfully",
        file: fileObj,
        subject,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed", error: err.message });
    }
  }
);

// 🔹 Upload Question Paper
uploadrouter.post(
  "/:semId/:subjectId/questionPapers",
  upload.single("file"),
  async (req, res) => {
    try {
      const { semId, subjectId } = req.params;

      const { subject, fileObj } = await saveFileToSubject(
        semId,
        subjectId,
        req.file,
        "questionPapers"
      );

      res.json({
        message: "Question Paper uploaded & saved successfully",
        file: fileObj,
        subject,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed", error: err.message });
    }
  }
);

// 🔹 Delete Material
uploadrouter.delete(
  "/:semId/:subjectId/materials/:fileId",
  async (req, res) => {
    try {
      const { semId, subjectId, fileId } = req.params;

      const semester = await Semester.findOne({ semId: parseInt(semId) });
      if (!semester) {
        return res.status(404).json({ message: "Semester not found" });
      }

      const subject = semester.subjects.id(subjectId) || 
                     semester.subjects.find((s) => s.id === parseInt(subjectId));
      if (!subject) {
        return res.status(404).json({ message: "Subject not found" });
      }

      const material = subject.materials.id(fileId);
      if (!material) {
        return res.status(404).json({ message: "Material not found" });
      }

      // Delete from S3 first
      await deleteFileFromS3(material.url);

      // Remove from MongoDB
      subject.materials.pull(fileId);
      await semester.save();

      res.json({
        message: "Material deleted successfully from both S3 and database",
        deletedFile: material.name
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ 
        message: "Delete failed", 
        error: err.message 
      });
    }
  }
);

// 🔹 Delete Question Paper
uploadrouter.delete(
  "/:semId/:subjectId/questionPapers/:fileId",
  async (req, res) => {
    try {
      const { semId, subjectId, fileId } = req.params;

      const semester = await Semester.findOne({ semId: parseInt(semId) });
      if (!semester) {
        return res.status(404).json({ message: "Semester not found" });
      }

      const subject = semester.subjects.id(subjectId) || 
                     semester.subjects.find((s) => s.id === parseInt(subjectId));
      if (!subject) {
        return res.status(404).json({ message: "Subject not found" });
      }

      const questionPaper = subject.questionPapers.id(fileId);
      if (!questionPaper) {
        return res.status(404).json({ message: "Question paper not found" });
      }

      // Delete from S3 first
      await deleteFileFromS3(questionPaper.url);

      // Remove from MongoDB
      subject.questionPapers.pull(fileId);
      await semester.save();

      res.json({
        message: "Question paper deleted successfully from both S3 and database",
        deletedFile: questionPaper.name
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ 
        message: "Delete failed", 
        error: err.message 
      });
    }
  }
);

export default uploadrouter;
