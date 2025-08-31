import SeniorRoadmap from '../models/SeniorRoadmap.js';

export const submitRoadmap = async (req, res) => {
  try {
    const { name, company, linkedin, github, domain, technologies, preparation, advice } = req.body;

    if (!name || !linkedin || !github || !domain || !technologies || !preparation) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: name, linkedin, github, domain, technologies, preparation'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Resume file is required'
      });
    }

    const roadmap = new SeniorRoadmap({
      name: name.trim(),
      company: company?.trim() || "Not specified",
      linkedin: linkedin.trim(),
      github: github.trim(),
      domain,
      technologies: technologies.trim(),
      preparation: preparation.trim(),
      advice: advice?.trim() || "No additional advice provided",
      resumeUrl: req.file.location,
      resumeFileName: req.file.originalname
    });

    await roadmap.save();

    res.status(201).json({
      success: true,
      message: 'Roadmap submitted successfully',
      data: {
        id: roadmap._id,
        name: roadmap.name,
        company: roadmap.company,
        domain: roadmap.domain,
        createdAt: roadmap.createdAt
      }
    });
  } catch (error) {
    console.error('Error submitting roadmap:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit roadmap',
      error: error.message
    });
  }
};

export const getAllRoadmaps = async (req, res) => {
  try {
    const { domain } = req.query;
    
    const filter = {};
    if (domain && domain !== 'all') {
      filter.domain = domain;
    }
    
    const roadmaps = await SeniorRoadmap.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: roadmaps
    });
  } catch (error) {
    console.error('Error fetching roadmaps:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch roadmaps',
      error: error.message
    });
  }
};

export const getRoadmapById = async (req, res) => {
  try {
    const { id } = req.params;

    const roadmap = await SeniorRoadmap.findById(id);

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: 'Roadmap not found'
      });
    }

    res.status(200).json({
      success: true,
      data: roadmap
    });
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch roadmap',
      error: error.message
    });
  }
};

export const downloadResume = async (req, res) => {
  try {
    const { id } = req.params;

    const roadmap = await SeniorRoadmap.findById(id)
      .select('resumeUrl resumeFileName');

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: 'Roadmap not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        resumeUrl: roadmap.resumeUrl,
        resumeFileName: roadmap.resumeFileName
      }
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resume',
      error: error.message
    });
  }
};