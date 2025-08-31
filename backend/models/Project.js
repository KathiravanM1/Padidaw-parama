import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  seniorName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true,
    enum: [
      'Web Development',
      'Mobile Development', 
      'Data Science',
      'Machine Learning',
      'AI',
      'Cybersecurity',
      'Cloud Computing',
      'DevOps',
      'Blockchain',
      'Game Development',
      'UI/UX Design',
      'IoT'
    ]
  },
  github: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^https:\/\/github\.com\//.test(v);
      },
      message: 'GitHub URL must be a valid GitHub repository link'
    }
  },
  deployedLink: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\//.test(v);
      },
      message: 'Deployed link must be a valid URL'
    }
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

projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Project', projectSchema);