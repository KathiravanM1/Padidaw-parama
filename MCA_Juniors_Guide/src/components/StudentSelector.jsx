import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Plus, X } from 'lucide-react';
import { getAllStudents, addStudent } from '../utils/attendanceStorage';
import { getCurrentStudent } from '../utils/auth';

const StudentSelector = ({ selectedStudent, onStudentChange }) => {
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

  const handleAddStudent = () => {
    if (!newStudentName.trim() || !newStudentId.trim()) {
      alert('Please enter both student name and ID');
      return;
    }

    const existingStudent = students.find(s => s.id === newStudentId.trim());
    if (existingStudent) {
      alert('A student with this ID already exists');
      return;
    }

    const student = addStudent(newStudentId.trim(), newStudentName.trim());
    loadStudents();
    onStudentChange(student);
    setShowAddForm(false);
    setNewStudentName('');
    setNewStudentId('');
  };

  // Hide component for regular student use
  return null;
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
      <div className="flex items-center gap-3 mb-4">
        <User className="w-6 h-6 text-blue-600" />
        <h3 className="text-2xl font-bold text-gray-800 font-serif">Select Student</h3>
      </div>

      <div className="space-y-4">
        <select 
          value={selectedStudent?.id || ''} 
          onChange={(e) => {
            const student = students.find(s => s.id === e.target.value);
            onStudentChange(student);
          }}
          className="w-full p-4 border-2 border-gray-200 rounded-xl text-base transition-colors focus:border-blue-500 focus:outline-none bg-white"
        >
          <option value="">Select a student...</option>
          {students.map(student => (
            <option key={student.id} value={student.id}>
              {student.name} ({student.id})
            </option>
          ))}
        </select>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add New Student
        </button>

        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Student Name</label>
                  <input
                    type="text"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="e.g., John Doe"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl text-base transition-colors focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Student ID</label>
                  <input
                    type="text"
                    value={newStudentId}
                    onChange={(e) => setNewStudentId(e.target.value)}
                    placeholder="e.g., MCA001"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl text-base transition-colors focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleAddStudent}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
                >
                  Add Student
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewStudentName('');
                    setNewStudentId('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudentSelector;