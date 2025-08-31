import Semester from "../models/Semester.js";

// Add a new semester
export const addSemester = async (req, res) => {
  try {
    const semester = new Semester(req.body);
    await semester.save();
    res.status(201).json(semester);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all semesters
export const getSemesters = async (req, res) => {
  try {
    const semesters = await Semester.find();
    res.json(semesters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add subject to existing semester
export const addSubjectToSemester = async (req, res) => {
  try {
    const { semesterId } = req.params;
    const { id, name, code } = req.body;

    const semester = await Semester.findOne({ semId: parseInt(semesterId) });
    if (!semester) {
      return res.status(404).json({ message: 'Semester not found' });
    }

    // Check if subject with same id already exists
    const existingSubject = semester.subjects.find(subject => subject.id === id);
    if (existingSubject) {
      return res.status(400).json({ message: 'Subject with this ID already exists' });
    }

    const newSubject = {
      id,
      name,
      code,
      materials: [],
      questionPapers: []
    };

    semester.subjects.push(newSubject);
    await semester.save();

    res.status(201).json({ message: 'Subject added successfully', subject: newSubject });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
