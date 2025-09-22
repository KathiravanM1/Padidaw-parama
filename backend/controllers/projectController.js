import Project from '../models/Project.js';

// Create a new project
export const createProject = async (req, res) => {
  try {
    const { name, seniorName, description, domain, github, deployedLink } = req.body;

    // Validate required fields
    if (!name || !seniorName || !description || !domain || !github) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    const newProject = new Project({
      name: name.trim(),
      seniorName: seniorName.trim(),
      description: description.trim(),
      domain,
      github: github.trim(),
      deployedLink: deployedLink ? deployedLink.trim() : undefined
    });

    const savedProject = await newProject.save();

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: savedProject
    });
  } catch (error) {
    // console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
};

// Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const { domain, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (domain) filter.domain = domain;

    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: projects,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
};

// Get project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    // console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: error.message
    });
  }
};