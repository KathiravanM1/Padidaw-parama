import express from 'express';
import mongoose from 'mongoose';
import s3 from '../config/s3.js';

const healthrouter = express.Router();

healthrouter.get('/health', async (req, res) => {
  let mongoStatus = "Unknown";
  let s3Status = "Unknown";

  // Check MongoDB connection
  if (mongoose.connection.readyState === 1) {
    mongoStatus = "Connected";
  } else {
    mongoStatus = "Disconnected";
  }

  // Check AWS S3 (try listing buckets as a lightweight check)
  try {
    await s3.listBuckets().promise();
    s3Status = "Connected";
  } catch (err) {
    s3Status = "Error: " + err.message;
  }

  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      backend: "OK",
      mongodb: mongoStatus,
      aws_s3: s3Status,
    }
  });
});

export default healthrouter;