import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { loginUser, getUserDocument, createUserDocument } from '../utils/sessionAuth';

const LoginPage = ({ onLogin }) => {
  const [rollNumber, setRollNumber] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!rollNumber.trim()) {
      alert('Please enter your roll number');
      return;
    }

    const userRoll = rollNumber.trim().toUpperCase();
    loginUser(userRoll);
    
    // Check if user document exists, create if not
    let userDoc = getUserDocument(userRoll);
    if (!userDoc) {
      userDoc = createUserDocument(userRoll);
    }
    
    onLogin(userDoc);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ECFAE5] to-[#DDF6D2] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Attendance Tracker</h1>
          <p className="text-gray-600">Enter your roll number to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Roll Number</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                placeholder="e.g., MCA001, CS2024"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all"
          >
            Continue
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;