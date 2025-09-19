import mongoose from "mongoose";

const MaterialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["pdf", "pptx", "docx", "other"], required: true },
  size: { type: String },
  uploadedBy: { type: String },
  date: { type: Date, default: Date.now },
  url: { type: String, required: true }
});

const QuestionPaperSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["pdf","docx","pptx"], required: true },
  marks: { type: Number },
  date: { type: Date, default: Date.now },
  url: { type: String, required: true }
});

const SubjectSchema = new mongoose.Schema({
  id: { type: Number },
  name: { type: String, required: true },
  code: { type: String, required: true },
  materials: [MaterialSchema],
  questionPapers: [QuestionPaperSchema]
});

const SemesterSchema = new mongoose.Schema({
  semId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  subjects: [SubjectSchema]
});

const Semester = mongoose.model("Semester", SemesterSchema);

export default Semester;
