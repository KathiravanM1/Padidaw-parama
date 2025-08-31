import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Plus, X } from 'lucide-react';
import { getAllStudents, addStudent } from '../utils/attendanceStorage';
import { getCurrentStudent } from '../utils/auth';

const StudentSelector = () => {
  const [students, setStudents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentId, setNewStudentId] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    // Only show current student in dropdown (for admin use)
    const currentStudentId = getCurrentStudent();
    if (currentStudentId) {
      const allStudents = getAllStudents();
      const currentStudentData = allStudents.find(s => s.id === currentStudentId);
      setStudents(currentStudentData ? [currentStudentData] : []);
    }
  };


  // Hide component for regular student use
  return null;
  
};

export default StudentSelector;