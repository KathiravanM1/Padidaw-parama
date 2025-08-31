import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle, Loader, AlertCircle } from 'lucide-react';
import { projectService } from '../services/projectService';

// --- MAIN COMPONENT ---
export default function ShareProject() {
    const [formData, setFormData] = useState({
        name: "",
        seniorName: "",
        description: "",
        domain: "",
        github: "",
        deployedLink: ""
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
            const response = await projectService.createProject(formData);
            console.log("Project created successfully:", response);
            
            setSubmitted(true);
            
            // Reset form and success message
            setTimeout(() => {
                setFormData({ 
                    name: "", 
                    seniorName: "",
                    description: "", 
                    domain: "", 
                    github: "",
                    deployedLink: ""
                });
                setSubmitted(false);
            }, 4000);
        } catch (error) {
            console.error('Error creating project:', error);
            setError(error.message || 'Failed to submit project. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const domains = [
        "Web Development", "Mobile Development", "Data Science", "Machine Learning",
        "AI", "Cybersecurity", "Cloud Computing", "DevOps", "Blockchain",
        "Game Development", "UI/UX Design", "IoT"
    ];

    // --- Animation Variants ---
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1, y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&family=Space+Grotesk:wght@400;500;700&display=swap');
                body { font-family: 'Space Grotesk', sans-serif; }
                .font-serif { font-family: 'Instrument Serif', serif; }
                .font-space { font-family: 'Space Grotesk', sans-serif; }
            `}</style>

            <div className="flex flex-col lg:flex-row min-h-screen">
                {/* Left Side: Title and Showcase */}
                <div className="lg:w-1/2 bg-gradient-to-br from-[#ECFAE5] to-[#DDF6D2] p-8 sm:p-12 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="max-w-md"
                    >
                        <motion.h1 variants={itemVariants} className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            Share Your Project
                        </motion.h1>
                        <motion.p variants={itemVariants} className="mt-4 text-lg text-gray-700 max-w-lg">
                            Showcase your work, inspire your peers, and build a portfolio that stands out.
                        </motion.p>

                        {/* Showcase Card */}
                        <motion.div variants={itemVariants} className="mt-10 w-full">
                            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
                                <h3 className="font-bold text-lg text-gray-800">{formData.name || "Your Project Name"}</h3>
                                <p className="text-sm text-gray-600 mt-1 h-10 overflow-hidden">{formData.description || "A brief, compelling description of what your project does."}</p>
                                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                    <span className="text-xs font-semibold text-white bg-green-500 px-2 py-1 rounded-full">{formData.domain || "Domain"}</span>
                                    <span className="text-sm font-bold text-gray-700">{formData.seniorName || "Senior's Name"}</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Right Side: Form */}
                <div className="lg:w-1/2 w-full p-8 sm:p-12 flex items-center justify-center">
                    <div className="w-full max-w-md">
                        <AnimatePresence mode="wait">
                            {submitted ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="text-center p-8 bg-green-50 rounded-2xl border border-green-200"
                                >
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <h2 className="font-serif text-2xl font-bold text-gray-900">Submission Received!</h2>
                                    <p className="mt-2 text-gray-600">Thank you for sharing. Your project will be reviewed shortly.</p>
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
                                    {/* Project Name */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">Project Name</label>
                                        <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition" placeholder="e.g., Portfolio Website" />
                                    </div>
                                    
                                    {/* Senior Name */}
                                    <div>
                                        <label htmlFor="seniorName" className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                                        <input type="text" name="seniorName" id="seniorName" required value={formData.seniorName} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition" placeholder="e.g., John Doe" />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                        <textarea name="description" id="description" required rows="4" value={formData.description} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition resize-none" placeholder="A short summary of your project..."></textarea>
                                    </div>

                                    {/* Domain */}
                                    <div>
                                        <label htmlFor="domain" className="block text-sm font-bold text-gray-700 mb-2">Project Domain</label>
                                        <select name="domain" id="domain" required value={formData.domain} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition">
                                            <option value="" disabled>Select a domain</option>
                                            {domains.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>

                                    {/* GitHub Link */}
                                    <div>
                                        <label htmlFor="github" className="block text-sm font-bold text-gray-700 mb-2">GitHub Repository</label>
                                        <input type="url" name="github" id="github" required value={formData.github} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition" placeholder="https://github.com/..." />
                                    </div>
                                    
                                    {/* Deployed Link */}
                                    <div>
                                        <label htmlFor="deployedLink" className="block text-sm font-bold text-gray-700 mb-2">Deployed Project Link (Optional)</label>
                                        <input type="url" name="deployedLink" id="deployedLink" value={formData.deployedLink} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition" placeholder="https://yourproject.com" />
                                    </div>

                                    {/* Error Message */}
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

                                    {/* Submit Button */}
                                    <div>
                                        <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-3 px-4 py-4 font-bold text-white bg-gray-800 rounded-lg hover:bg-gray-900 disabled:bg-gray-400 transition-all transform hover:scale-105">
                                            {isSubmitting ? (
                                                <Loader className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <UploadCloud className="w-5 h-5" />
                                            )}
                                            {isSubmitting ? "Submitting..." : "Submit Project"}
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
