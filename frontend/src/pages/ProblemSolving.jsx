import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Book, Building, Code, Database, Star, Loader, ChevronDown, X, Clock, Tag } from 'lucide-react';
import { problemService } from '../services/problemService';

// --- BACKEND API INTEGRATION ---

const useCategorizedProblems = () => {
    const [categorizedProblems, setCategorizedProblems] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                setLoading(true);
                const response = await problemService.getAllProblems();
                const problems = response.data;
                
                // Group problems by category and subcategory
                const grouped = problems.reduce((acc, problem) => {
                    const { category, subCategory } = problem;
                    
                    if (!acc[category]) {
                        acc[category] = {};
                    }
                    
                    if (!acc[category][subCategory]) {
                        acc[category][subCategory] = {
                            list: []
                        };
                    }
                    
                    acc[category][subCategory].list.push({
                        id: problem._id,
                        title: problem.title,
                        description: problem.description,
                        difficulty: problem.difficulty,
                        tags: problem.tags,
                        createdAt: problem.createdAt
                    });
                    
                    return acc;
                }, {});
                
                setCategorizedProblems(grouped);
            } catch (error) {
                console.error('Error fetching problems:', error);
                setError('Failed to load problems');
            } finally {
                setLoading(false);
            }
        };

        fetchProblems();
    }, []);

    return { categorizedProblems, loading, error };
};

// --- STYLING & CONFIGURATION ---
const difficultyColors = { Easy: 'bg-green-100 text-green-800', Medium: 'bg-yellow-100 text-yellow-800', Hard: 'bg-red-100 text-red-800' };
const tabs = [
    { id: 'topics', label: 'Topics', icon: Book },
    { id: 'company', label: 'Company-Wise', icon: Building },
    { id: 'language', label: 'Language-Wise', icon: Code },
    { id: 'domain', label: 'Domain-Based', icon: Database },
];

// --- UI COMPONENTS ---

const ProblemListItem = ({ problem, onProblemClick }) => (
    <button onClick={() => onProblemClick(problem)} className="w-full text-left p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-gray-800">{problem.title}</h3>
            <div className={`text-sm font-medium px-2 py-0.5 rounded-full ${difficultyColors[problem.difficulty]}`}>
                {problem.difficulty}
            </div>
        </div>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{problem.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-4">
                {problem.tags && problem.tags.length > 0 && (
                    <div className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>{problem.tags.slice(0, 2).join(', ')}</span>
                        {problem.tags.length > 2 && <span>+{problem.tags.length - 2}</span>}
                    </div>
                )}
            </div>
            {problem.createdAt && (
                <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(problem.createdAt).toLocaleDateString()}</span>
                </div>
            )}
        </div>
    </button>
);

const ProblemDisplay = ({ categoryData, onProblemClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredList = useMemo(() => {
        if (!categoryData || !categoryData.list) return [];
        return categoryData.list.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [categoryData, searchTerm]);

    if (!categoryData) return <div className="p-4 text-center">Select a category to see problems.</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search in this list..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                {filteredList.length > 0 ? (
                    filteredList.map(problem => <ProblemListItem key={problem.id} problem={problem} onProblemClick={onProblemClick} />)
                ) : (
                    <p className="p-4 text-center text-gray-500">No matching problems found.</p>
                )}
            </div>
        </motion.div>
    );
};

const ProblemModal = ({ problem, onClose }) => {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="font-serif text-2xl font-bold text-gray-900">{problem.title}</h2>
                            <div className={`mt-2 text-sm font-medium px-2 py-0.5 rounded-full inline-block ${difficultyColors[problem.difficulty]}`}>{problem.difficulty}</div>
                        </div>
                        <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">{problem.description}</p>
                    {problem.tags && problem.tags.length > 0 && (
                        <div className="border-t border-gray-200 pt-4">
                            <h4 className="font-medium text-gray-900 mb-2">Tags:</h4>
                            <div className="flex flex-wrap gap-2">
                                {problem.tags.map((tag, index) => (
                                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- MAIN PAGE COMPONENT ---
export default function ProblemSolvingPlatform() {
    const { categorizedProblems, loading, error } = useCategorizedProblems();
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [activeSubCategory, setActiveSubCategory] = useState(null);
    const [viewingProblem, setViewingProblem] = useState(null);

    const subCategories = useMemo(() => {
        if (!categorizedProblems) return [];
        return Object.keys(categorizedProblems[activeTab] || {});
    }, [categorizedProblems, activeTab]);

    useEffect(() => {
        if (subCategories.length > 0) {
            setActiveSubCategory(subCategories[0]);
        } else {
            setActiveSubCategory(null);
        }
    }, [activeTab, subCategories]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading problems...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const currentProblemData = categorizedProblems[activeTab]?.[activeSubCategory];

    return (
        <div className="min-h-screen bg-gradient-to-b from-#DDF6D2 to-white font-sans text-gray-800">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@500&family=Space+Grotesk:wght@400;500;700&display=swap');
                body { font-family: 'Space Grotesk', sans-serif; }
                .font-serif { font-family: 'Instrument Serif', serif; }
                .font-space { font-family: 'Space Grotesk', sans-serif; }
                .font-mono { font-family: 'JetBrains Mono', monospace; }
            `}</style>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900">Problem Solving Hub</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Explore challenges curated by seniors, categorized for your learning journey.</p>
                </div>
                <div className="border-b border-gray-200 mb-8">
                    <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto" aria-label="Tabs">
                        {tabs.map((tab) => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`${activeTab === tab.id ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm sm:text-base whitespace-nowrap transition-colors`}><tab.icon className="mr-2 h-5 w-5" />{tab.label}</button>)}
                    </nav>
                </div>
                {Object.keys(categorizedProblems).length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg mb-4">No problems available yet.</p>
                        <p className="text-gray-400">Problems shared by seniors will appear here.</p>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row gap-8">
                        <aside className="w-full md:w-1/4 lg:w-1/5">
                            {subCategories.length > 0 && (
                                <>
                                    <div className="md:hidden relative">
                                        <select value={activeSubCategory || ''} onChange={(e) => setActiveSubCategory(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg appearance-none font-bold">
                                            {subCategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>
                                    <nav className="hidden md:block space-y-1">
                                        {subCategories.map(sub => (
                                            <button key={sub} onClick={() => setActiveSubCategory(sub)} className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeSubCategory === sub ? 'bg-blue-100 text-green-800' : 'hover:bg-gray-100 text-gray-600'}`}>
                                                {sub}
                                            </button>
                                        ))}
                                    </nav>
                                </>
                            )}
                        </aside>
                        <div className="flex-1">
                            <AnimatePresence mode="wait">
                                <motion.div key={activeSubCategory} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.2 }}>
                                    <ProblemDisplay categoryData={currentProblemData} onProblemClick={(problem) => setViewingProblem(problem)} />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </main>
            <AnimatePresence>
                {viewingProblem && (
                    <ProblemModal problem={viewingProblem} onClose={() => setViewingProblem(null)} />
                )}
            </AnimatePresence>
        </div>
    );
}
