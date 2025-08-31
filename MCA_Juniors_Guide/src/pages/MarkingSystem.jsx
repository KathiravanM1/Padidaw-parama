import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Calculator, BookOpen, Award, Info, Plus, Trash2, Edit3, Save, User, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { studentService } from '../services/studentService';

// Curriculum Data for MCA Programme (2023 Regulations)
const mcaCurriculum = {
  1: [
    { code: 'MA3111', name: 'Mathematical Foundations of Computer Science', credits: 4 },
    { code: 'CA3101', name: 'Data Structures', credits: 4.5 },
    { code: 'CA3102', name: 'Database Technologies', credits: 4.5 },
    { code: 'CA3103', name: 'Java Programming', credits: 4 },
    { code: 'CA3104', name: 'Computer Networks and Management', credits: 4 },
    { code: 'CA3105', name: 'Advanced Software Engineering', credits: 3 },
  ],
  2: [
    { code: 'CA3201', name: 'Advanced Data Structures', credits: 4 },
    { code: 'CA3202', name: 'Advanced Database Technologies', credits: 4 },
    { code: 'CA3203', name: 'Advanced Java Programming', credits: 4 },
    { code: 'OS3201', name: 'Operating Systems', credits: 4 },
    { code: 'OE3201', name: 'Open Elective I', credits: 3 },
    { code: 'OE3202', name: 'Open Elective II', credits: 3 },
    { code: 'CA3211', name: 'Advanced Data Structures Lab', credits: 2 },
  ],
  3: [
    { code: 'CA3301', name: 'Artificial Intelligence', credits: 4 },
    { code: 'CA3302', name: 'Machine Learning', credits: 4 },
    { code: 'CA3303', name: 'Web Technologies', credits: 4 },
    { code: 'OE3301', name: 'Open Elective III', credits: 3 },
    { code: 'OE3302', name: 'Open Elective IV', credits: 3 },
    { code: 'CA3311', name: 'Web Technologies Lab', credits: 2 },
    { code: 'CA3391', name: 'Mini Project with Seminar', credits: 4 },
  ],
  4: [
    { code: 'CA3491', name: 'Project Work / Internship', credits: 24 },
  ],
};

const AnnaUniversityMarkingSystem = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [selectedSemesters, setSelectedSemesters] = useState([1]);
  const [allSemesterCourses, setAllSemesterCourses] = useState({});
  const [studentInfo, setStudentInfo] = useState({ registration_no: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const gradeOptions = useMemo(() => [
    { grade: 'O', points: 10, range: '91-100' },
    { grade: 'A+', points: 9, range: '81-90' },
    { grade: 'A', points: 8, range: '71-80' },
    { grade: 'B+', points: 7, range: '61-70' },
    { grade: 'B', points: 6, range: '56-60' },
    { grade: 'C', points: 5, range: '50-55' },
    { grade: 'U', points: 0, range: '0-49' },
  ], []);

  useEffect(() => {
    // Initialize with empty courses for Semester 1
    if (!allSemesterCourses[1]) {
      setAllSemesterCourses(prev => ({ ...prev, 1: [] }));
    }
    // Load existing data on mount
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await studentService.getStudentData();
      const student = response.data;
      
      setStudentInfo({ registration_no: student.registration_no, name: student.name });
      
      // Convert student data to component format
      const coursesData = {};
      const selectedSems = [];
      
      if (student.semesters && student.semesters.length > 0) {
        student.semesters.forEach(semester => {
          if (semester.courses && semester.courses.length > 0) {
            selectedSems.push(semester.semester_number);
            coursesData[semester.semester_number] = semester.courses.map((course, index) => ({
              id: `${semester.semester_number}-${index}`,
              name: course.course_name,
              code: course.course_code,
              credits: course.credits,
              grade: course.grade,
              gradePoints: course.grade_points
            }));
          }
        });
        
        setAllSemesterCourses(coursesData);
        setSelectedSemesters(selectedSems);
      }
      
    } catch (error) {
      console.log('No existing data found, starting fresh');
   } finally {
      setLoading(false);
    }
  };

  const saveStudentData = async () => {
    if (!studentInfo.registration_no || !studentInfo.name) {
      setError('Please enter registration number and name');
      return;
    }
    
    try {
      setSaving(true);
      setError('');
      
      // Convert component data to API format
      const semesters = Object.keys(allSemesterCourses)
        .filter(sem => allSemesterCourses[sem].length > 0)
        .map(sem => ({
          semester_number: parseInt(sem),
          courses: allSemesterCourses[sem].map(course => ({
            course_code: course.code || `COURSE_${course.id}`,
            course_name: course.name,
            credits: course.credits,
            grade: course.grade,
            grade_points: course.gradePoints
          }))
        }));
      
      const studentData = {
        registration_no: studentInfo.registration_no,
        name: studentInfo.name,
        semesters
      };
      
      await studentService.saveStudentData(studentData);
      setSuccess('Data saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      setError(error.message || 'Failed to save data');
    } finally {
      setSaving(false);
    }
  };

  const handleTabClick = useCallback((semester) => {
    setActiveTab(semester);
    // Initialize empty courses if they don't exist yet
    if (!allSemesterCourses[semester]) {
      setAllSemesterCourses(prev => ({ ...prev, [semester]: [] }));
    }
  }, [allSemesterCourses]);

  const handleSemesterCheck = useCallback((semester) => {
    if (selectedSemesters.includes(semester)) {
      setSelectedSemesters(prev => prev.filter(s => s !== semester).sort());
    } else {
      setSelectedSemesters(prev => [...prev, semester].sort());
      // Initialize empty courses if not already in state
      if (!allSemesterCourses[semester]) {
        setAllSemesterCourses(prev => ({ ...prev, [semester]: [] }));
      }
    }
  }, [selectedSemesters, allSemesterCourses]);

  const updateCourse = useCallback((id, field, value) => {
    setAllSemesterCourses(prev => ({
      ...prev,
      [activeTab]: prev[activeTab]?.map(course => {
        if (course.id === id) {
          const updated = { ...course, [field]: value };
          if (field === 'grade') {
            const gradeData = gradeOptions.find(g => g.grade === value);
            updated.gradePoints = gradeData ? gradeData.points : 0;
          } else if (field === 'credits') {
            updated.credits = parseFloat(value) || 0;
          }
          return updated;
        }
        return course;
      }) || []
    }));
  }, [activeTab, gradeOptions]);

  const addCourse = useCallback(() => {
    const newCourse = {
      id: `${activeTab}-${Date.now()}`,
      name: 'New Subject',
      code: '',
      credits: 3,
      grade: 'A',
      gradePoints: 8,
    };
    setAllSemesterCourses(prev => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), newCourse]
    }));
  }, [activeTab]);

  const removeCourse = useCallback((id) => {
    setAllSemesterCourses(prev => ({
      ...prev,
      [activeTab]: prev[activeTab]?.filter(course => course.id !== id) || []
    }));
  }, [activeTab]);

  const calculateGPA = useCallback((semester) => {
    if (!allSemesterCourses[semester]) return '0.00';
    const courses = allSemesterCourses[semester];
    const passedCourses = courses.filter(course => course.grade !== 'U');
    const totalCredits = passedCourses.reduce((sum, course) => sum + Number(course.credits), 0);
    const totalGradePoints = passedCourses.reduce((sum, course) => sum + (Number(course.credits) * course.gradePoints), 0);
    return totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '0.00';
  }, [allSemesterCourses]);

  const calculateCGPA = useCallback(() => {
    if (selectedSemesters.length === 0) return '0.00';
    const allCourses = selectedSemesters.flatMap(semester => allSemesterCourses[semester] || []);
    const passedCourses = allCourses.filter(course => course.grade !== 'U');
    const totalCredits = passedCourses.reduce((sum, course) => sum + Number(course.credits), 0);
    const totalGradePoints = passedCourses.reduce((sum, course) => sum + (Number(course.credits) * course.gradePoints), 0);
    return totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '0.00';
  }, [selectedSemesters, allSemesterCourses]);
  

  const displayedCourses = useMemo(() => allSemesterCourses[activeTab] || [], [allSemesterCourses, activeTab]);
  
  return (
    <div className="min-h-screen font-space bg-gradient-to-b from-#DDF6D2 to-white">
      {/* Header */}
      <header className="bg-#DDF6D2 shadow-sm" style={{ borderColor: '#DDF6D2' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 font-serif leading-tight">
              Anna University Marking System
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 px-2">Understanding Grades, Credits, and CGPA Calculation</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Assessment Breakdown Section */}
        <div 
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border-l-4 animate-fadeInUp" 
          style={{ borderColor: '#16A085' }}
        >
          <div className="flex items-center mb-4 sm:mb-6">
            <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 flex-shrink-0" style={{ color: '#16A085' }} />
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-800 font-serif leading-tight">
              Comprehensive Assessment Breakdown
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Theory Courses */}
            <motion.div 
              className="p-4 sm:p-6 rounded-xl border-2 animate-slide-in" 
              style={{ backgroundColor: '#DDF6D2', borderColor: '#16A085' }}
              whileHover={{ scale: 1.02, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            >
              <div className="font-bold text-base sm:text-lg lg:text-xl text-gray-800 mb-3 flex items-center">
                <span className="mr-2 text-lg">📝</span> Theory Courses (40% IA + 60% ESE)
              </div>
              <p className="text-xs sm:text-sm text-gray-700 mb-4">
                <span className="font-semibold">Typically for:</span> Mathematical Foundations, AI, Operating Systems.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                  <div className="font-semibold text-gray-700 text-xs sm:text-sm">Internal Assessment (40 Marks)</div>
                  <ul className="list-disc list-inside text-xs text-gray-600 mt-2 space-y-1">
                    <li>Test 1: 16 marks (40%)</li>
                    <li>Test 2: 16 marks (40%)</li>
                    <li>Assignment/Seminar: 8 marks (20%)</li>
                  </ul>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                  <div className="font-semibold text-gray-700 text-xs sm:text-sm">End Semester Exam (60 Marks)</div>
                  <ul className="list-disc list-inside text-xs text-gray-600 mt-2 space-y-1">
                    <li>3-hour written examination</li>
                    <li>Minimum 45% in ESE to pass</li>
                    <li>Overall 50% combined with IA to pass</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Theory with Lab Courses */}
            <motion.div 
              className="p-4 sm:p-6 rounded-xl border-2 animate-slide-in" 
              style={{ backgroundColor: '#ECFAE5', borderColor: '#16A085' }}
              whileHover={{ scale: 1.02, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            >
              <div className="font-bold text-base sm:text-lg lg:text-xl text-gray-800 mb-3 flex items-center">
                <span className="mr-2 text-lg">💻</span> Theory + Lab (50% CA + 50% ESE)
              </div>
              <p className="text-xs sm:text-sm text-gray-700 mb-4">
                <span className="font-semibold">Typically for:</span> Data Structures, Web Technologies.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                  <div className="font-semibold text-gray-700 text-xs sm:text-sm">Continuous Assessment (50 Marks)</div>
                  <ul className="list-disc list-inside text-xs text-gray-600 mt-2 space-y-1">
                    <li>Theory Tests: 25 marks (50%)</li>
                    <li>Lab Work & Test: 25 marks (50%)</li>
                  </ul>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                  <div className="font-semibold text-gray-700 text-xs sm:text-sm">End Semester Exam (50 Marks)</div>
                  <ul className="list-disc list-inside text-xs text-gray-600 mt-2 space-y-1">
                    <li>Components based on L-T-P structure</li>
                    <li>Minimum 45% required in each component</li>
                  </ul>
                </div>
              </div>
            </motion.div>

    
            <motion.div 
              className="p-4 sm:p-6 rounded-xl border-2 animate-slide-in" 
              style={{ backgroundColor: '#ECFAE5', borderColor: '#16A085' }}
              whileHover={{ scale: 1.02, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            >
              <div className="font-bold text-base sm:text-lg lg:text-xl text-gray-800 mb-3 flex items-center">
                <span className="mr-2 text-lg">🔬</span> Laboratory Courses (60% CA + 40% ESE)
              </div>
              <p className="text-xs sm:text-sm text-gray-700 mb-4">
                <span className="font-semibold">Typically for:</span> Advanced Data Structures Lab, Web Technologies Lab.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                  <div className="font-semibold text-gray-700 text-xs sm:text-sm">Continuous Assessment (60 Marks)</div>
                  <ul className="list-disc list-inside text-xs text-gray-600 mt-2 space-y-1">
                    <li>Lab Experiments: 45 marks (75%)</li>
                    <li>Midterm Test: 15 marks (25%)</li>
                  </ul>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                  <div className="font-semibold text-gray-700 text-xs sm:text-sm">End Semester Exam (40 Marks)</div>
                  <ul className="list-disc list-inside text-xs text-gray-600 mt-2 space-y-1">
                    <li>Practical Examination: 40 marks</li>
                    <li>Includes a Viva-Voce session</li>
                  </ul>
                </div>
              </div>
            </motion.div>
            
            {/* Project Work */}
            <motion.div 
              className="p-4 sm:p-6 rounded-xl border-2 animate-slide-in" 
              style={{ backgroundColor: '#DDF6D2', borderColor: '#16A085' }}
              whileHover={{ scale: 1.02, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            >
              <div className="font-bold text-base sm:text-lg lg:text-xl text-gray-800 mb-3 flex items-center">
                <span className="mr-2 text-lg">🎯</span> Project Work (60% Internal + 40% External)
              </div>
              <p className="text-xs sm:text-sm text-gray-700 mb-4">
                <span className="font-semibold">Typically for:</span> Mini Project, Final Year Project.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                  <div className="font-semibold text-gray-700 text-xs sm:text-sm">Internal Reviews (60 Marks)</div>
                  <ul className="list-disc list-inside text-xs text-gray-600 mt-2 space-y-1">
                    <li>Review 1: 10 marks</li>
                    <li>Review 2: 20 marks</li>
                    <li>Review 3: 30 marks</li>
                  </ul>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                  <div className="font-semibold text-gray-700 text-xs sm:text-sm">External Evaluation (40 Marks)</div>
                  <ul className="list-disc list-inside text-xs text-gray-600 mt-2 space-y-1">
                    <li>Project Report: 10 marks</li>
                    <li>Viva-Voce: 20 marks</li>
                    <li>External Examiner: 10 marks</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Grade System */}
        <div 
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 animate-fadeInUp"
        >
          <div className="flex items-center mb-4 sm:mb-6">
            <Award className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 flex-shrink-0" style={{ color: '#16A085' }} />
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-800 font-serif leading-tight">
              Grade Point System
            </h2>
          </div>
          
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full border-collapse border border-gray-300 min-w-[500px]">
              <thead>
                <tr style={{ backgroundColor: '#ECFAE5' }}>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-xs sm:text-sm">Letter Grade</th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-xs sm:text-sm">Grade Points</th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-xs sm:text-sm">Marks Range</th>
                  <th className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-xs sm:text-sm">Performance</th>
                </tr>
              </thead>
              <tbody>
                {gradeOptions.map((grade, index) => (
                  <tr 
                    key={grade.grade} 
                    className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  >
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 font-bold text-sm sm:text-lg font-mono">
                      {grade.grade}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 font-semibold text-center text-xs sm:text-sm">
                      {grade.points}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 font-mono text-xs sm:text-sm">
                      {grade.range}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                      {grade.grade === 'O' && 'Outstanding'}
                      {grade.grade === 'A+' && 'Excellent'}
                      {grade.grade === 'A' && 'Very Good'}
                      {grade.grade === 'B+' && 'Good'}
                      {grade.grade === 'B' && 'Average'}
                      {grade.grade === 'C' && 'Satisfactory'}
                      {grade.grade === 'U' && 'Re-appearance'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* CGPA Calculator */}
        <div 
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 animate-fadeInUp"
        >
          <div className="flex items-center mb-4 sm:mb-6">
            <Calculator className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 flex-shrink-0" style={{ color: '#16A085' }} />
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-800 font-serif leading-tight">
              GPA & CGPA Calculator
            </h2>
          </div>
          
          {/* Student Information */}
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg" style={{ backgroundColor: '#ECFAE5' }}>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-3 font-serif">
              Student Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Registration Number</label>
                <input
                  type="text"
                  value={studentInfo.registration_no}
                  onChange={(e) => setStudentInfo(prev => ({ ...prev, registration_no: e.target.value }))}
                  onBlur={(e) => loadStudentData(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#16A085] text-sm"
                  placeholder="Enter registration number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={studentInfo.name}
                  onChange={(e) => setStudentInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#16A085] text-sm"
                  placeholder="Enter student name"
                />
              </div>
            </div>
            
            {/* Save Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={saveStudentData}
                disabled={saving || !studentInfo.registration_no || !studentInfo.name}
                className="flex items-center gap-2 px-4 py-2 bg-[#16A085] text-white rounded-lg hover:bg-[#138f7a] disabled:bg-gray-400 transition-colors text-sm font-semibold"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Data'}
              </button>
            </div>
            
            {/* Messages */}
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}
            {success && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <span className="text-green-700 text-sm">{success}</span>
              </div>
            )}
          </div>

          <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg" style={{ backgroundColor: '#DDF6D2' }}>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-3 font-serif">
              1. Edit Grades per Semester
            </h3>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
              {[1, 2, 3, 4].map(sem => (
                <button
                  key={sem}
                  onClick={() => handleTabClick(sem)}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-bold transition-colors text-xs sm:text-sm ${activeTab === sem ? 'bg-[#16A085] text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
                >
                  Semester {sem}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            <div className="flex justify-between items-center">
              <h4 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800">Subjects for Semester {activeTab}</h4>
              <button
                onClick={addCourse}
                className="flex items-center gap-2 px-3 py-2 bg-[#16A085] text-white rounded-lg hover:bg-[#138f7a] transition-colors text-xs sm:text-sm font-semibold"
              >
                <Plus className="w-4 h-4" />
                Add Subject
              </button>
            </div>
            
            {displayedCourses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm sm:text-base">No subjects added yet. Click "Add Subject" to get started.</p>
              </div>
            ) : (
              displayedCourses.map((course, index) => (
                <motion.div 
                  key={`${activeTab}-${course.id}`} 
                  className="p-3 sm:p-4 border rounded-lg animate-slide-in" 
                  style={{ backgroundColor: '#ECFAE5', borderColor: '#DDF6D2' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                        Subject Name
                      </label>
                      <input
                        type="text"
                        value={course.name}
                        onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                        className="w-full px-2 sm:px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#16A085] text-xs sm:text-sm"
                        placeholder="Enter subject name"
                      />
                    </div>
                    
                    <div className="flex gap-2 sm:gap-4 items-end">
                      <div className="w-20 sm:w-24">
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Credits</label>
                        <input
                          type="number"
                          value={course.credits}
                          onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                          min="0"
                          max="10"
                          step="0.5"
                          className="w-full px-2 sm:px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#16A085] text-center font-semibold font-mono text-xs sm:text-sm"
                        />
                      </div>
                      
                      <div className="w-16 sm:w-20">
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Grade</label>
                        <select
                          value={course.grade}
                          onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                          className="w-full px-1 sm:px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#16A085] font-mono text-xs sm:text-sm"
                        >
                          {gradeOptions.map(grade => (
                            <option key={grade.grade} value={grade.grade}>{grade.grade}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="w-16 sm:w-20">
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Points</label>
                        <div className="px-2 sm:px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-center font-semibold font-mono text-xs sm:text-sm">
                          {course.gradePoints}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeCourse(course.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Remove subject"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
          
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg" style={{ backgroundColor: '#ECFAE5' }}>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-3 font-serif">
              2. Select Semesters for CGPA
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4].map(sem => (
                <div key={sem} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`sem-check-${sem}`}
                    checked={selectedSemesters.includes(sem)}
                    onChange={() => handleSemesterCheck(sem)}
                    disabled={!allSemesterCourses[sem] || allSemesterCourses[sem].length === 0}
                    className="h-4 w-4 sm:h-5 sm:w-5 rounded form-checkbox"
                    style={{ borderColor: '#16A085', color: '#16A085' }}
                  />
                  <label htmlFor={`sem-check-${sem}`} className={`ml-2 text-sm sm:text-base lg:text-lg font-bold ${!allSemesterCourses[sem] || allSemesterCourses[sem].length === 0 ? 'text-gray-400' : 'text-gray-800'}`}>
                    Semester {sem} {allSemesterCourses[sem] && allSemesterCourses[sem].length > 0 && `(${allSemesterCourses[sem].length} subjects)`}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <motion.div 
              className="p-4 sm:p-6 rounded-lg text-center border-2" 
              style={{ backgroundColor: '#DDF6D2', borderColor: '#16A085' }}
              whileHover={{ scale: 1.02, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            >
              <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-2">GPA for Semester {activeTab || 'N/A'}</div>
              <motion.div 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold font-mono" 
                style={{ color: '#16A085' }}
                key={`gpa-${activeTab}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {activeTab ? calculateGPA(activeTab) : '0.00'}
              </motion.div>
              <div className="text-xs sm:text-sm text-gray-600 mt-2">out of 10.00</div>
            </motion.div>
            
            <motion.div 
              className="p-4 sm:p-6 rounded-lg text-center border-2" 
              style={{ backgroundColor: '#ECFAE5', borderColor: '#DDF6D2' }}
              whileHover={{ scale: 1.02, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            >
              <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-2">Cumulative CGPA</div>
              <motion.div 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold font-mono" 
                style={{ color: '#16A085' }}
                key={`cgpa-${selectedSemesters.length}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {calculateCGPA()}
              </motion.div>
              <div className="text-xs sm:text-sm text-gray-600 mt-2">
                for semesters: 
                <span className="font-mono">{selectedSemesters.join(', ') || 'N/A'}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Global Styles with Animations */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Instrument+Serif:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');
        
        .font-space { font-family: 'Space Grotesk', sans-serif; }
        .font-serif { font-family: 'Instrument Serif', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out;
        }

        .animate-slide-in {
            animation: slideInRight 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AnnaUniversityMarkingSystem;