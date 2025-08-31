import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, CheckCircle, Loader, Star, AlertCircle } from 'lucide-react';
import { problemService } from '../services/problemService';

// --- MAIN COMPONENT ---
export default function PostProblemPage() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        difficulty: "Easy",
        category: "topics",
        subCategory: "",
        tags: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        
        try {
            const problemData = {
                title: formData.title,
                description: formData.description,
                difficulty: formData.difficulty,
                category: formData.category,
                subCategory: formData.subCategory,
                tags: formData.tags
            };

            const response = await problemService.createProblem(problemData);
            console.log("Problem created successfully:", response);

            setSubmitted(true);
            
            // Reset form and success message after a delay
            setTimeout(() => {
                setFormData({ title: "", description: "", difficulty: "Easy", category: "topics", subCategory: "", tags: "" });
                setSubmitted(false);
            }, 4000);
        } catch (error) {
            console.error('Error creating problem:', error);
            setError(error.message || 'Failed to submit problem. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Data for dropdowns ---

    const difficultyColors = { Easy: 'bg-green-100 text-green-800', Medium: 'bg-yellow-100 text-yellow-800', Hard: 'bg-red-100 text-red-800' };

    return (
        <div className="min-h-screen bg-gradient-to-b from-#DDF6D2 to-white font-sans text-gray-800">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&family=Space+Grotesk:wght@400;500;700&display=swap');
                body { font-family: 'Space Grotesk', sans-serif; }
                .font-serif { font-family: 'Instrument Serif', serif; }
                .font-space { font-family: 'Space Grotesk', sans-serif; }
            `}</style>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900">Post a New Problem</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Share your interview experience and help juniors prepare for their dream jobs.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Side: Form */}
                    <div className="lg:w-1/2 w-full">
                        <AnimatePresence mode="wait">
                            {submitted ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="text-center p-8 bg-green-50 rounded-2xl border border-green-200 h-full flex flex-col justify-center"
                                >
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <h2 className="font-serif text-2xl font-bold text-gray-900">Problem Submitted!</h2>
                                    <p className="mt-2 text-gray-600">Thank you for your contribution. The problem is now available for students.</p>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">Problem Title</label>
                                        <input type="text" name="title" id="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g., Two Sum" />
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                        <textarea name="description" id="description" required rows="6" value={formData.description} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Provide a clear and concise description of the problem..."></textarea>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="difficulty" className="block text-sm font-bold text-gray-700 mb-2">Difficulty</label>
                                            <select name="difficulty" id="difficulty" required value={formData.difficulty} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                                                <option>Easy</option>
                                                <option>Medium</option>
                                                <option>Hard</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-2">Main Category</label>
                                            <select name="category" id="category" required value={formData.category} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
                                                <option value="topics">Topic</option>
                                                <option value="company">Company</option>
                                                <option value="language">Language</option>
                                                <option value="domain">Domain</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="subCategory" className="block text-sm font-bold text-gray-700 mb-2">Specific Category</label>
                                        <input type="text" name="subCategory" id="subCategory" required value={formData.subCategory} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder={`e.g., ${formData.category === 'topics' ? 'Arrays' : formData.category === 'company' ? 'Google' : formData.category === 'language' ? 'Python' : 'AI/ML'}`} />
                                    </div>

                                     <div>
                                        <label htmlFor="tags" className="block text-sm font-bold text-gray-700 mb-2">Tags (comma-separated)</label>
                                        <input type="text" name="tags" id="tags" value={formData.tags} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g., Array, Hash Table" />
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
                                        >
                                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                            <p className="text-red-700 text-sm">{error}</p>
                                        </motion.div>
                                    )}

                                    <div className='white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 rounded-lg transition-colors'>
                                        <button type="submit" disabled={isSubmitting} className="flex items-center justify-center gap-2 w-full px-6 py-3 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                                            {isSubmitting ? (
                                                <>
                                                    <Loader className="w-5 h-5 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <PlusCircle className="w-5 h-5" />
                                                    Post Problem
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Side: Preview */}
                    <div className="lg:w-1/2 w-full">
                        <div className="bg-white rounded-2xl border border-gray-200 p-8 h-full">
                            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">Preview</h2>
                            
                            {formData.title || formData.description ? (
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{formData.title || 'Problem Title'}</h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[formData.difficulty]}`}>
                                                {formData.difficulty}
                                            </span>
                                            <span className="px-2 py-1 bg-blue-100 text-green-800 rounded-full text-xs font-medium">
                                                {formData.subCategory || 'Category'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <p className="text-gray-700 whitespace-pre-wrap">{formData.description || 'Problem description will appear here...'}</p>
                                    </div>
                                    
                                    {formData.tags && (
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Tags:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.tags.split(',').map((tag, index) => (
                                                    tag.trim() && (
                                                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                                            {tag.trim()}
                                                        </span>
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500">
                                    <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>Fill out the form to see a preview of your problem</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
