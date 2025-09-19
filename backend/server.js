// server/index.js
import express from 'express';
import cors from 'cors';
import { connectDB } from './db/db.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import uploadrouter from './routes/uploadRoutes.js';
import semrouter from './routes/semesterRoutes.js';
import healthRoutes from './routes/healthRoute.js';
import problemRoutes from './routes/problemRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import seniorRoadmapRoutes from './routes/seniorRoadmapRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import adminDeleteRouter from './routes/adminDeleteRoutes.js';
import cookieParser from "cookie-parser";
import attendanceRoutes from "./routes/attendanceRoutes.js"

dotenv.config();

const PORT = process.env.PORT || 5002;

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();
app.use(cookieParser());


// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/semesters", semrouter);
app.use("/api/upload", uploadrouter);
app.use('/api/problems', problemRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/roadmaps', seniorRoadmapRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/admin/delete', adminDeleteRouter);
app.use('/api', healthRoutes);
app.use("/api/attendance", attendanceRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the MCA Guide Project API', status: 'running' });
});


// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});