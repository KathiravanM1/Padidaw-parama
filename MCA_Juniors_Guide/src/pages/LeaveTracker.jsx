import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, BookOpen, AlertTriangle, Plus, CheckCircle, XCircle, Trash2, Edit, X, LogOut } from 'lucide-react';
import LoginPage from '../components/LoginPage';
import { getCurrentUser, logoutUser } from '../utils/sessionAuth';
import { getCurrentUserData, addSubject, markAttendance, deleteSubject, updateAttendance, deleteAttendance, getMaxLeaveHours } from '../utils/attendanceDB';


const EditAbsenceModal = ({ entry, onSave, onClose }) => {
    const [newHours, setNewHours] = useState(entry.hours);

    const handleSave = () => {
        onSave(entry.id, parseInt(newHours));
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="relative w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-xl overflow-hidden mx-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900">Edit Absence Entry</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100">
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
                <div className="p-4 sm:p-6 space-y-4">
                    <div>
                        <p className="font-semibold text-sm sm:text-base">{entry.subjectName}</p>
                        <p className="text-xs sm:text-sm text-gray-500">{new Date(entry.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Hours Absent</label>
                        <input 
                            type="number" 
                            value={newHours} 
                            onChange={(e) => setNewHours(e.target.value)} 
                            min="1" 
                            max="8" 
                            className="w-full p-3 border-2 border-gray-200 rounded-xl text-sm sm:text-base transition-colors focus:border-green-500 focus:outline-none" 
                        />
                    </div>
                </div>
                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold text-sm sm:text-base order-2 sm:order-1">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600 font-semibold text-sm sm:text-base order-1 sm:order-2">Save Changes</button>
                </div>
            </motion.div>
        </motion.div>
    );
};


// --- MAIN COMPONENT ---
export default function AttendanceTracker() {
    // Authentication state
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    
    // State for subjects the user is actively tracking (initially empty)
    const [trackedSubjects, setTrackedSubjects] = useState([]);
    
    // State for the form inputs
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newSubjectName, setNewSubjectName] = useState('');
    const [newSubjectCredits, setNewSubjectCredits] = useState('');
    const [hoursAbsent, setHoursAbsent] = useState('1');
    
    // State for the log of all absences
    const [ attendanceHistory, setAttendanceHistory] = useState([]);
    
    // State for the edit modal
    const [editingEntry, setEditingEntry] = useState(null);

    // Check session on mount
    useEffect(() => {
        const rollNumber = getCurrentUser();
        if (rollNumber) {
            const userData = getCurrentUserData();
            if (userData) {
                setCurrentUser(userData);
                setIsLoggedIn(true);
                refreshData();
            }
        }
    }, []);

    const refreshData = () => {
        const userData = getCurrentUserData();
        if (userData) {
            setTrackedSubjects(Object.values(userData.subjects));
            setAttendanceHistory(userData.attendanceHistory);
        }
    };

    const handleLogin = (userDoc) => {
        setCurrentUser(userDoc);
        setIsLoggedIn(true);
        refreshData();
    };

    const handleLogout = () => {
        logoutUser();
        setIsLoggedIn(false);
        setCurrentUser(null);
        setTrackedSubjects([]);
        setAttendanceHistory([]);
    };

    // --- Core Logic ---

    const handleDropdownChange = (e) => {
        const value = e.target.value;
        if (value === 'add_new') {
            setIsAddingNew(true);
            setSelectedSubjectId('add_new');
        } else {
            setIsAddingNew(false);
            setSelectedSubjectId(value);
        }
    };

    const handleMarkAbsence = () => {
        const hours = parseInt(hoursAbsent);
        let subjectId = selectedSubjectId;

        if (isAddingNew) {
            if (!newSubjectName.trim() || !newSubjectCredits || !hoursAbsent) {
                alert('Please fill in all new subject details and the hours.');
                return;
            }
            
            const existingSubject = trackedSubjects.find(s => s.name.toLowerCase() === newSubjectName.trim().toLowerCase());
            if (existingSubject) {
                alert('A subject with this name already exists. Please select it from the dropdown.');
                return;
            }

            const newSubject = addSubject({
                name: newSubjectName.trim(),
                credits: parseFloat(newSubjectCredits)
            });
            
            if (newSubject) {
                subjectId = newSubject.id;
            }
        }

        if (!subjectId) {
            alert('Please select a subject.');
            return;
        }

        markAttendance(subjectId, hours);
        refreshData();

        // Reset form
        setHoursAbsent('1');
        setSelectedSubjectId('');
        setIsAddingNew(false);
        setNewSubjectName('');
        setNewSubjectCredits('');
    };
    
    // Duplicate handleDeleteSubject removed to fix redeclaration error.

    // Removed duplicate handleDeleteHistoryEntry and handleUpdateHistoryEntry to fix redeclaration error.

    // --- Memoized Calculations for Performance ---

    const handleDeleteSubject = (subjectId) => {
        if (window.confirm('Are you sure you want to delete this subject and all its records?')) {
            deleteSubject(subjectId);
            refreshData();
        }
    };

    const handleDeleteHistoryEntry = (entryId) => {
        deleteAttendance(entryId);
        refreshData();
    };

    const handleUpdateHistoryEntry = (entryId, newHours) => {
        if (isNaN(newHours) || newHours < 1) {
            alert('Please enter a valid number of hours (at least 1).');
            return;
        }
        updateAttendance(entryId, newHours);
        refreshData();
        setEditingEntry(null);
    };

    

    const overallStats = useMemo(() => {
        if (trackedSubjects.length === 0) {
            return { criticalCount: 0 };
        }
        let criticalCount = 0;
        trackedSubjects.forEach(subject => {
            const maxLeave = getMaxLeaveHours(subject.credits);
            if (subject.hoursAbsent > maxLeave) {
                criticalCount++;
            }
        });
        return { criticalCount };
    }, [trackedSubjects]);



    if (!isLoggedIn) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <>
        <div className="min-h-screen bg-gradient-to-br from-[#ECFAE5] to-[#DDF6D2] font-sans">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&family=Space+Grotesk:wght@400;500;700&display=swap');
                body { font-family: 'Space Grotesk', sans-serif; }
                .font-serif { font-family: 'Instrument Serif', serif; }
            `}</style>
            
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8 lg:mb-12 bg-white/80 backdrop-blur-sm p-6 sm:p-8 lg:p-10 rounded-2xl lg:rounded-3xl shadow-lg relative"
                >
                    <button
                        onClick={handleLogout}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-4 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold text-sm sm:text-base"
                    >
                        <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 font-serif pr-16 sm:pr-0">
                        Attendance Tracker
                    </h1>
                    <p className="text-sm sm:text-lg text-gray-600 max-w-3xl mx-auto px-2">
                        Welcome {currentUser?.rollNumber}! Track your attendance for the current semester.
                    </p>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
                    {/* Form Section */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-2 bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg"
                    >
                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                            <h3 className="text-lg sm:text-2xl font-bold text-gray-800 font-serif">Mark an Absence</h3>
                        </div>
                        
                        <div className="space-y-4 sm:space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                                <select value={selectedSubjectId} onChange={handleDropdownChange} className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl text-sm sm:text-base transition-colors focus:border-green-500 focus:outline-none bg-white">
                                    <option value="" disabled>Choose a subject...</option>
                                    {trackedSubjects.map(subject => (
                                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                                    ))}
                                    <option value="add_new">Add New Subject...</option>
                                </select>
                            </div>

                            <AnimatePresence>
                                {isAddingNew && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-6 overflow-hidden"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-gray-200">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">New Subject Name</label>
                                                <input type="text" value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)} placeholder="e.g., Machine Learning" className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl text-sm sm:text-base transition-colors focus:border-green-500 focus:outline-none bg-white" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Credits</label>
                                                <input type="number" value={newSubjectCredits} onChange={(e) => setNewSubjectCredits(e.target.value)} placeholder="e.g., 4.5" step="0.5" min="1" className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl text-sm sm:text-base transition-colors focus:border-green-500 focus:outline-none" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Hours Absent</label>
                                <input type="number" value={hoursAbsent} onChange={(e) => setHoursAbsent(e.target.value)} min="1" max="8" className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl text-sm sm:text-base transition-colors focus:border-green-500 focus:outline-none" />
                            </div>

                            <button onClick={handleMarkAbsence} className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg hover:from-green-600 hover:to-green-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                Add Absence Entry
                            </button>
                        </div>
                    </motion.div>

                    {/* Stats & History */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="space-y-4 sm:space-y-6 lg:space-y-8"
                    >
                         <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border-l-4 border-red-500">
                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-600 mb-1 sm:mb-2">{overallStats.criticalCount}</h3>
                            <p className="text-sm sm:text-base text-gray-600 font-medium">Subjects in Critical Zone</p>
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
                            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800 font-serif">Recent History</h3>
                            </div>
                            <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-60 overflow-y-auto pr-1 sm:pr-2">
                                {attendanceHistory.length > 0 ? (
                                    attendanceHistory.map(entry => (
                                        <div key={entry.id} className="flex items-center justify-between text-xs sm:text-sm group p-2 sm:p-0 rounded-lg sm:rounded-none hover:bg-gray-50 sm:hover:bg-transparent">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-700 truncate">{entry.subjectName}</p>
                                                <p className="text-xs text-gray-500">{new Date(entry.date).toLocaleDateString()} - {entry.hours} hour(s)</p>
                                            </div>
                                            <div className="flex items-center opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                                <button onClick={() => setEditingEntry(entry)} className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50">
                                                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </button>
                                                <button onClick={() => handleDeleteHistoryEntry(entry.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50">
                                                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 py-4 text-sm">No absences marked yet.</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Subjects Overview Table */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                    <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white p-6">
                        <h3 className="text-xl font-bold font-serif">Subject Attendance Overview</h3>
                    </div>
                    
                    <div className="p-3 sm:p-4">
                        <AnimatePresence>
                            {trackedSubjects.length > 0 ? (
                                trackedSubjects.map(subject => {
                                    const maxLeave = getMaxLeaveHours(subject.credits);
                                    const remainingHours = maxLeave - subject.hoursAbsent;
                                    const percentage = ((maxLeave - subject.hoursAbsent) / maxLeave) * 100;
                                    const isCritical = remainingHours < 0;

                                    return (
                                        <motion.div 
                                            key={subject.id} 
                                            layout
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className={`p-3 sm:p-4 border-b border-gray-100 last:border-0 ${isCritical ? 'bg-red-50 rounded-lg mb-2' : ''}`}
                                        >
                                            {/* Mobile Layout */}
                                            <div className="block md:hidden space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-gray-800 text-sm truncate">{subject.name}</p>
                                                        <p className="text-xs text-gray-500">{subject.credits} Credits</p>
                                                    </div>
                                                    <button onClick={() => handleDeleteSubject(subject.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 ml-2">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{subject.hoursAbsent} / {maxLeave} hrs</p>
                                                        <p className="text-xs text-gray-500">Absent / Max</p>
                                                    </div>
                                                    <span className={`font-bold text-sm ${isCritical ? 'text-red-600' : 'text-green-600'}`}>
                                                        {remainingHours >= 0 ? `${remainingHours} left` : `${Math.abs(remainingHours)} over`}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div className={`h-2 rounded-full ${isCritical ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.max(0, percentage)}%` }}></div>
                                                </div>
                                            </div>

                                            {/* Desktop Layout */}
                                            <div className="hidden md:grid md:grid-cols-5 gap-4 items-center">
                                                <div className="col-span-2">
                                                    <p className="font-semibold text-gray-800">{subject.name}</p>
                                                    <p className="text-sm text-gray-500">{subject.credits} Credits</p>
                                                </div>
                                                <div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                        <div className={`h-2.5 rounded-full ${isCritical ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.max(0, percentage)}%` }}></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">{subject.hoursAbsent} / {maxLeave} hrs</p>
                                                    <p className="text-sm text-gray-500">Absent / Max Leave</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-bold text-lg ${isCritical ? 'text-red-600' : 'text-green-600'}`}>
                                                        {remainingHours >= 0 ? `${remainingHours} hrs left` : `${Math.abs(remainingHours)} hrs over`}
                                                    </span>
                                                    <button onClick={() => handleDeleteSubject(subject.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <div className="text-center text-gray-500 py-8 sm:py-12">
                                    <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm sm:text-base">Mark an absence to start tracking your subjects here.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
        
        <AnimatePresence>
            {editingEntry && (
                <EditAbsenceModal 
                    entry={editingEntry} 
                    onClose={() => setEditingEntry(null)}
                    onSave={handleUpdateHistoryEntry}
                />
            )}
        </AnimatePresence>
        </>
    );
}

