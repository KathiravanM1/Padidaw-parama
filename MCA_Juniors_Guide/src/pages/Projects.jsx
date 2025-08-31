import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Loader, Github, ExternalLink, User, Calendar, FolderOpen } from 'lucide-react';
import { projectService } from '../services/projectService';

// --- Backend Integration ---


// --- Components ---

// A single, self-contained card for each project.
const ProjectCard = ({ name, description, domain, seniorName, github, deployedLink, createdAt }) => {
    return (
        <div className="project-card bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-lg hover:border-emerald-300 border border-transparent p-6 flex flex-col">
            {/* Domain Tag */}
            <div className="mb-4">
                <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-semibold font-jetbrains-mono mr-2 px-3 py-1 rounded-full">
                    {domain}
                </span>
            </div>

            {/* Project Title */}
            <h3 className="font-space-grotesk text-2xl font-bold text-gray-900 mb-3">{name}</h3>
            
            {/* Description */}
            <p className="font-instrument-serif text-gray-600 mb-6 flex-grow">{description}</p>
            
            {/* Creator Info */}
            <div className="font-space-grotesk mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Created by</span>
                    <span className="font-medium text-gray-800">{seniorName}</span>
                </div>
                {createdAt && (
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{new Date(createdAt).toLocaleDateString()}</span>
                    </div>
                )}
            </div>

            {/* Links Section */}
            <div className="border-t pt-4 flex flex-wrap justify-between items-center gap-4">
                {/* GitHub Link */}
                <a href={github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gray-800 text-white font-jetbrains-mono text-sm py-2 px-4 rounded-lg hover:bg-gray-900 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg">
                    <Github className="w-4 h-4" />
                    GitHub
                </a>
                
                {/* Deployment Link (Conditional) */}
                {deployedLink ? (
                    <a href={deployedLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-emerald-600 font-jetbrains-mono text-sm py-2 px-4 rounded-lg hover:bg-emerald-50 transition-colors duration-200">
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                    </a>
                ) : (
                    <div className="inline-flex items-center gap-2 text-gray-500 font-jetbrains-mono text-sm py-2 px-4">
                        <ExternalLink className="w-4 h-4" />
                        N/A
                    </div>
                )}
            </div>
        </div>
    );
};

// Main App Component
const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        domain: '',
        search: ''
    });

    const domains = [
        'Web Development', 'Mobile Development', 'Data Science', 'Machine Learning',
        'AI', 'Cybersecurity', 'Cloud Computing', 'DevOps', 'Blockchain',
        'Game Development', 'UI/UX Design', 'IoT'
    ];

    useEffect(() => {
        fetchProjects();
    }, [filters.domain]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await projectService.getAllProjects({ domain: filters.domain });
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setError('Failed to load projects');
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

    // Filter projects by search term
    const filteredProjects = projects.filter(project => 
        project.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.seniorName.toLowerCase().includes(filters.search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading projects...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Styles are included directly in the component */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono&family=Space+Grotesk:wght@400;500;700&display=swap');

                .font-space-grotesk { font-family: 'Space Grotesk', sans-serif; }
                .font-jetbrains-mono { font-family: 'JetBrains Mono', monospace; }
                .font-instrument-serif { font-family: 'Instrument Serif', serif; }

                /* Adding a subtle hover effect to the cards */
                .project-card:hover {
                    transform: translateY(-5px);
                }
            `}</style>

            <main className="container mx-auto p-4 sm:p-6 md:p-8 max-w-10xl bg-gradient-to-b from-#DDF6D2 to-white">
                <div className="text-center mb-12">
                    <h1 className="font-space-grotesk text-4xl md:text-5xl font-bold text-gray-900">Project Showcase</h1>
                    <p className="font-instrument-serif text-lg text-gray-600 mt-2">Discover amazing projects created by seniors across different domains.</p>
                </div>
                
                {/* Filters Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 max-w-4xl mx-auto">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search projects..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                        </div>
                        
                        {/* Domain Filter */}
                        <div className="sm:w-48">
                            <select
                                value={filters.domain}
                                onChange={(e) => handleFilterChange('domain', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">All Domains</option>
                                {domains.map(domain => (
                                    <option key={domain} value={domain}>{domain}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Projects List */}
                {filteredProjects.length === 0 ? (
                    <div className="text-center py-12">
                        <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg mb-2">
                            {projects.length === 0 ? 'No projects available yet.' : 'No projects match your search.'}
                        </p>
                        <p className="text-gray-400">
                            {projects.length === 0 ? 'Projects shared by seniors will appear here.' : 'Try adjusting your filters.'}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
                        {filteredProjects.map((project) => (
                            <motion.div
                                key={project._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ProjectCard {...project} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
};

export default Projects;
