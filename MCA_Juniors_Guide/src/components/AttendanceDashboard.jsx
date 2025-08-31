import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, BookOpen, Download, Upload } from 'lucide-react';
import { getAllStudents, getStudentSummary, exportAttendanceData, importAttendanceData } from '../utils/attendanceStorage';

const AttendanceDashboard = () => {
  const [students, setStudents] = useState([]);
  const [overallStats, setOverallStats] = useState({
    totalStudents: 0,
    totalCriticalStudents: 0,
    totalSubjects: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const allStudents = getAllStudents();
    setStudents(allStudents);

    let totalCritical = 0;
    let totalSubjects = 0;

    allStudents.forEach(student => {
      const summary = getStudentSummary(student.id);
      if (summary) {
        totalCritical += summary.criticalSubjects;
        totalSubjects += summary.totalSubjects;
      }
    });

    setOverallStats({
      totalStudents: allStudents.length,
      totalCriticalStudents: totalCritical,
      totalSubjects
    });
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      importAttendanceData(file)
        .then(() => {
          alert('Data imported successfully!');
          loadDashboardData();
        })
        .catch((error) => {
          alert('Error importing data: ' + error.message);
        });
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500"
        >
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="text-2xl font-bold text-blue-600">{overallStats.totalStudents}</h3>
              <p className="text-gray-600 font-medium">Total Students</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-red-500"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <h3 className="text-2xl font-bold text-red-600">{overallStats.totalCriticalStudents}</h3>
              <p className="text-gray-600 font-medium">Critical Subjects</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="text-2xl font-bold text-green-600">{overallStats.totalSubjects}</h3>
              <p className="text-gray-600 font-medium">Total Subjects</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-6 rounded-2xl shadow-lg"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4 font-serif">Data Management</h3>
        <div className="flex gap-4">
          <button
            onClick={exportAttendanceData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold cursor-pointer">
            <Upload className="w-4 h-4" />
            Import Data
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </motion.div>

      {/* Students List */}
      {students.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white p-6">
            <h3 className="text-xl font-bold font-serif">Students Overview</h3>
          </div>
          <div className="p-4">
            {students.map(student => {
              const summary = getStudentSummary(student.id);
              return (
                <div key={student.id} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0">
                  <div>
                    <h4 className="font-semibold text-gray-800">{student.name}</h4>
                    <p className="text-sm text-gray-500">ID: {student.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{summary?.totalSubjects || 0} subjects</p>
                    <p className={`text-sm ${summary?.criticalSubjects > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {summary?.criticalSubjects || 0} critical
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AttendanceDashboard;