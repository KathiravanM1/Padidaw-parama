import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Plus } from 'lucide-react';

const UserSelector = ({ currentUserId, onUserChange }) => {
  const [users, setUsers] = useState([]);
  const [newUserId, setNewUserId] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith('attendance_') && key !== 'attendance_tracker_data'
    );
    const userIds = keys.map(key => key.replace('attendance_', ''));
    setUsers(userIds);
  };

  const handleAddUser = () => {
    if (!newUserId.trim()) {
      alert('Please enter a user ID');
      return;
    }

    const userId = newUserId.trim();
    if (users.includes(userId)) {
      alert('User ID already exists');
      return;
    }

    // Initialize empty data for new user
    localStorage.setItem(`attendance_${userId}`, JSON.stringify({
      subjects: {},
      attendanceHistory: [],
      createdAt: new Date().toISOString()
    }));

    loadUsers();
    onUserChange(userId);
    setShowAddForm(false);
    setNewUserId('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
      <div className="flex items-center gap-3 mb-4">
        <User className="w-6 h-6 text-blue-600" />
        <h3 className="text-2xl font-bold text-gray-800 font-serif">Select User</h3>
      </div>

      <div className="space-y-4">
        <select 
          value={currentUserId || ''} 
          onChange={(e) => onUserChange(e.target.value)}
          className="w-full p-4 border-2 border-gray-200 rounded-xl text-base transition-colors focus:border-blue-500 focus:outline-none bg-white"
        >
          <option value="">Select your user ID...</option>
          {users.map(userId => (
            <option key={userId} value={userId}>{userId}</option>
          ))}
        </select>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add New User
        </button>

        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="overflow-hidden pt-4 border-t border-gray-200"
          >
            <div className="flex gap-3">
              <input
                type="text"
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
                placeholder="Enter your user ID (e.g., MCA001)"
                className="flex-1 p-3 border-2 border-gray-200 rounded-xl text-base transition-colors focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewUserId('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserSelector;