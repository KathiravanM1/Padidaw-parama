import mongoose from 'mongoose';

const SeniorRoadmapSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  company: { 
    type: String, 
    default: "Not specified",
    trim: true 
  },
  linkedin: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(v);
      },
      message: 'Please enter a valid LinkedIn URL'
    }
  },
  github: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/.test(v);
      },
      message: 'Please enter a valid GitHub URL'
    }
  },
  domain: { 
    type: String, 
    required: true,
    enum: [
      'frontend', 'backend', 'fullstack', 'mobile', 'devops', 
      'data-science', 'machine-learning', 'cybersecurity', 'cloud', 
      'blockchain', 'game-dev', 'ui-ux', 'product-management', 
      'qa-testing', 'other'
    ]
  },
  technologies: { 
    type: String, 
    required: true,
    trim: true 
  },
  preparation: { 
    type: String, 
    required: true,
    trim: true 
  },
  advice: { 
    type: String, 
    default: "No additional advice provided",
    trim: true 
  },
  resumeUrl: { 
    type: String, 
    required: true 
  },
  resumeFileName: { 
    type: String, 
    required: true 
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

SeniorRoadmapSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('SeniorRoadmap', SeniorRoadmapSchema, 'seniorroadmaps');