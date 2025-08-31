import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, Tag } from 'lucide-react';
import { problemService } from '../services/problemService';

export default function ProblemsList() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        difficulty: ''
    });

    const difficultyColors = {
        Easy: 'bg-green-100 text-green-800',
        Medium: 'bg-yellow-100 text-yellow-800',
        Hard: 'bg-red-100 text-red-800'
    };

    useEffect(() => {
        fetchProblems();
    }, [filters]);

    const fetchProblems = async () => {
        try {
            setLoading(true);
            const response = await problemService.getAllProblems(filters);
            setProblems(response.data);
        } catch (error) {
            console.error('Error fetching problems:', error);
            setError('Failed to load problems');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading problems...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Interview Problems</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">Browse through problems shared by seniors to help with your interview preparation.</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                    <div className="flex flex-wrap gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Categories</option>
                                <option value="topics">Topics</option>
                                <option value="company">Company</option>
                                <option value="language">Language</option>
                                <option value="domain">Domain</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                            <select
                                value={filters.difficulty}
                                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Difficulties</option>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Problems List */}
                <div className="space-y-6">
                    {problems.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No problems found. Be the first to share one!</p>
                        </div>
                    ) : (
                        problems.map((problem) => (
                            <motion.div
                                key={problem._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{problem.title}</h3>
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[problem.difficulty]}`}>
                                                {problem.difficulty}
                                            </span>
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                {problem.subCategory}
                                            </span>
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                                {problem.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Clock className="w-4 h-4 mr-1" />
                                        {new Date(problem.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-4 line-clamp-3">{problem.description}</p>

                                {problem.tags && problem.tags.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-gray-400" />
                                        <div className="flex flex-wrap gap-1">
                                            {problem.tags.map((tag, index) => (
                                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}