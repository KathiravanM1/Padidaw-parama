import express from 'express';
import upload from '../middleware/upload.js';
import {
  submitRoadmap,
  getAllRoadmaps,
  getRoadmapById,
  downloadResume
} from '../controllers/seniorRoadmapController.js';

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log(`Roadmap Route: ${req.method} ${req.path}`);
  next();
});

// Test route
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Roadmap routes working!' });
});

// Health check route
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'Roadmap API is healthy', timestamp: new Date().toISOString() });
});

// Direct test for /all route
router.get('/all-direct', (req, res) => {
  res.json({ success: true, message: 'Direct /all route working!', query: req.query });
});

// Database test route
router.get('/db-test', async (req, res) => {
  try {
    const collections = await SeniorRoadmap.db.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    const count = await SeniorRoadmap.countDocuments();
    
    res.json({ 
      success: true, 
      collections: collectionNames,
      seniorRoadmapCount: count,
      modelName: SeniorRoadmap.modelName,
      collectionName: SeniorRoadmap.collection.name
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/submit', upload.single('resume'), submitRoadmap);
router.get('/all', getAllRoadmaps);
router.get('/download/:id', downloadResume);
router.get('/:id', getRoadmapById);

// Catch-all for debugging
router.use('*', (req, res) => {
  console.log('Unmatched roadmap route:', req.method, req.originalUrl);
  res.status(404).json({ message: 'Roadmap route not found', path: req.originalUrl });
});

export default router;