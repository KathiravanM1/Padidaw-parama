import mongoose from 'mongoose';
import SeniorRoadmap from './models/SeniorRoadmap.js';
import { connectDB } from './db/db.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleRoadmaps = [
  {
    name: "John Doe",
    company: "Google",
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
    domain: "frontend",
    technologies: "React, TypeScript, Node.js, MongoDB, AWS",
    preparation: "I spent 6 months preparing for interviews. Started with DSA fundamentals, then moved to system design. Built 3 full-stack projects and practiced coding daily on LeetCode.",
    advice: "Focus on fundamentals first. Don't jump to advanced topics without mastering basics. Build projects that solve real problems.",
    resumeUrl: "https://example.com/resume1.pdf",
    resumeFileName: "john_doe_resume.pdf",
    isApproved: true
  },
  {
    name: "Jane Smith",
    company: "Microsoft",
    linkedin: "https://linkedin.com/in/janesmith",
    github: "https://github.com/janesmith",
    domain: "backend",
    technologies: "Java, Spring Boot, PostgreSQL, Docker, Kubernetes",
    preparation: "My preparation took 8 months. I focused heavily on system design and backend architecture. Contributed to open source projects and built microservices.",
    advice: "System design is crucial for backend roles. Understand scalability, databases, and distributed systems.",
    resumeUrl: "https://example.com/resume2.pdf",
    resumeFileName: "jane_smith_resume.pdf",
    isApproved: true
  },
  {
    name: "Alex Johnson",
    company: "Amazon",
    linkedin: "https://linkedin.com/in/alexjohnson",
    github: "https://github.com/alexjohnson",
    domain: "fullstack",
    technologies: "Python, Django, React, PostgreSQL, Redis, AWS",
    preparation: "Balanced approach over 7 months. Equal focus on frontend and backend. Built an e-commerce platform from scratch. Studied AWS services and got certified.",
    advice: "For fullstack roles, don't try to be expert in everything. Be solid in fundamentals of both frontend and backend.",
    resumeUrl: "https://example.com/resume3.pdf",
    resumeFileName: "alex_johnson_resume.pdf",
    isApproved: true
  }
];

async function seedDatabase() {
  try {
    await connectDB();
    await SeniorRoadmap.deleteMany({});
    await SeniorRoadmap.insertMany(sampleRoadmaps);
    console.log('Sample data inserted successfully');
    const count = await SeniorRoadmap.countDocuments();
    console.log(`Total roadmaps: ${count}`);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();