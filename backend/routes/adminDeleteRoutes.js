import express from "express";
import Semester from "../models/Semester.js";
import SeniorRoadmap from "../models/SeniorRoadmap.js";
import { deleteFileFromS3 } from "../utils/s3Utils.js";

const adminDeleteRouter = express.Router();

// 🔹 Admin Delete Material
adminDeleteRouter.delete("/materials/:semId/:subjectId/:fileId", async (req, res) => {
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
      success: true,
      message: "Material deleted successfully from both S3 and database",
      deletedFile: material.name
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: "Delete failed", 
      error: err.message 
    });
  }
});

// 🔹 Admin Delete Question Paper
adminDeleteRouter.delete("/questionPapers/:semId/:subjectId/:fileId", async (req, res) => {
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
      success: true,
      message: "Question paper deleted successfully from both S3 and database",
      deletedFile: questionPaper.name
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: "Delete failed", 
      error: err.message 
    });
  }
});

// 🔹 Admin Delete Senior Roadmap
adminDeleteRouter.delete("/roadmaps/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const roadmap = await SeniorRoadmap.findById(id);

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: 'Roadmap not found'
      });
    }

    // Delete resume file from S3
    await deleteFileFromS3(roadmap.resumeUrl);

    // Delete roadmap document from MongoDB
    await SeniorRoadmap.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Roadmap and resume deleted successfully from both S3 and database',
      deletedRoadmap: {
        name: roadmap.name,
        resumeFileName: roadmap.resumeFileName
      }
    });
  } catch (error) {
    console.error('Error deleting roadmap:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete roadmap',
      error: error.message
    });
  }
});

export default adminDeleteRouter;