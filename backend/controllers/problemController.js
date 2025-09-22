import Problem from '../models/Problem.js';

// Create a new problem
export const createProblem = async (req, res) => {
  try {
    const { title, description, difficulty, category, subCategory, tags } = req.body;

    // Validate required fields
    if (!title || !description || !difficulty || !category || !subCategory) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Process tags
    const processedTags = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

    const newProblem = new Problem({
      title: title.trim(),
      description: description.trim(),
      difficulty,
      category,
      subCategory: subCategory.trim(),
      tags: processedTags
    });

    const savedProblem = await newProblem.save();

    res.status(201).json({
      success: true,
      message: 'Problem created successfully',
      data: savedProblem
    });
  } catch (error) {
    console.error('Error creating problem:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create problem',
      error: error.message
    });
  }
};

// Get all problems
export const getAllProblems = async (req, res) => {
  try {
    const { category, difficulty, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const problems = await Problem.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Problem.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: problems,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch problems',
      error: error.message
    });
  }
};

// Get problem by ID
export const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    res.status(200).json({
      success: true,
      data: problem
    });
  } catch (error) {
    // console.error('Error fetching problem:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch problem',
      error: error.message
    });
  }
};