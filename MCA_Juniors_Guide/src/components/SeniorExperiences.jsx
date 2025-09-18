import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Building,
  Filter,
  Github,
  Linkedin,
  Search,
  User,
  ChevronLeft,
  ChevronRight,
  Loader
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = 'https://api.vidivu.tech/api';


const domainOptions = [
  { value: "all", label: "All Domains" },
  { value: "frontend", label: "Frontend Development" },
  { value: "backend", label: "Backend Development" },
  { value: "fullstack", label: "Full Stack Development" },
  { value: "mobile", label: "Mobile Development" },
  { value: "devops", label: "DevOps Engineering" },
  { value: "data-science", label: "Data Science" },
  { value: "machine-learning", label: "Machine Learning" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "cloud", label: "Cloud Computing" },
  { value: "blockchain", label: "Blockchain" },
  { value: "game-dev", label: "Game Development" },
  { value: "ui-ux", label: "UI/UX Design" },
  { value: "product-management", label: "Product Management" },
  { value: "qa-testing", label: "QA Testing" },
  { value: "other", label: "Other" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function SeniorExperiences() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    domain: "all",
    search: ""
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false
  });

  // Fetch roadmaps from backend
  const fetchRoadmaps = async (page = 1, domain = "all", search = "") => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "9"
      });
      
      if (domain !== "all") params.append("domain", domain);
      
      const response = await axios.get(`${API_BASE_URL}/roadmaps/approved?${params}`);
      
      if (response.data.success) {
        let filteredData = response.data.data;
        
        // Client-side search filtering
        if (search.trim()) {
          const searchLower = search.toLowerCase();
          filteredData = filteredData.filter(roadmap =>
            roadmap.name.toLowerCase().includes(searchLower) ||
            roadmap.company.toLowerCase().includes(searchLower) ||
            roadmap.technologies.toLowerCase().includes(searchLower) ||
            roadmap.preparation.toLowerCase().includes(searchLower)
          );
        }
        
        setRoadmaps(filteredData);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch experiences");
      console.error("Error fetching roadmaps:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps(pagination.currentPage, filters.domain, filters.search);
  }, [pagination.currentPage, filters.domain]);

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (pagination.currentPage === 1) {
        fetchRoadmaps(1, filters.domain, filters.search);
      } else {
        setPagination(prev => ({ ...prev, currentPage: 1 }));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters.search]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ECFAE5] to-[#DDF6D2] font-['Space_Grotesk'] text-gray-800 p-4 sm:p-6 lg:p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&family=Space+Grotesk:wght@400;500;700&display=swap');
        body { font-family: 'Space Grotesk', sans-serif; }
        .font-serif { font-family: 'Instrument Serif', serif; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.6, delay: 0.1 }} 
            className="font-serif text-4xl sm:text-5xl text-gray-800 mb-4"
          >
            Senior Experiences
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2, duration: 0.6 }} 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Learn from the journey of successful seniors and get insights into their career paths.
          </motion.p>
        </header>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, company, or technologies..."
                value={filters.search}
                onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>
            
            {/* Domain Filter */}
            <div className="md:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filters.domain}
                  onChange={(e) => handleFilterChange({ ...filters, domain: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition appearance-none"
                >
                  {domainOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader className="w-8 h-8 text-green-600" />
            </motion.div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-8"
          >
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => fetchRoadmaps(pagination.currentPage, filters.domain, filters.search)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Roadmaps Grid */}
        {!loading && !error && (
          <>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              <AnimatePresence>
                {roadmaps.map((roadmap, index) => (
                  <RoadmapCard key={roadmap._id} roadmap={roadmap} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {roadmaps.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No experiences found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </motion.div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Pagination 
                pagination={pagination} 
                onPageChange={handlePageChange} 
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Roadmap Card Component
const RoadmapCard = ({ roadmap, index }) => {
  const getDomainLabel = (domain) => {
    const option = domainOptions.find(opt => opt.value === domain);
    return option ? option.label : domain;
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1 }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{roadmap.name}</h3>
            <div className="flex items-center text-sm text-gray-600">
              <Building className="w-4 h-4 mr-1" />
              {roadmap.company}
            </div>
          </div>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
          {getDomainLabel(roadmap.domain)}
        </span>
      </div>

      {/* Technologies */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Technologies</h4>
        <p className="text-sm text-gray-600 line-clamp-2">{roadmap.technologies}</p>
      </div>

      {/* Preparation Preview */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Preparation Strategy</h4>
        <p className="text-sm text-gray-600 line-clamp-3">{roadmap.preparation}</p>
      </div>

      {/* Advice Preview */}
      {roadmap.advice && roadmap.advice !== "No additional advice provided" && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Advice</h4>
          <p className="text-sm text-gray-600 line-clamp-2">{roadmap.advice}</p>
        </div>
      )}

      {/* Social Links */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex space-x-3">
          <a
            href={roadmap.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-700 transition"
          >
            <Linkedin className="w-4 h-4 mr-1" />
            <span className="text-sm">LinkedIn</span>
          </a>
          <a
            href={roadmap.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-700 hover:text-gray-900 transition"
          >
            <Github className="w-4 h-4 mr-1" />
            <span className="text-sm">GitHub</span>
          </a>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(roadmap.createdAt).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
};

// Pagination Component
const Pagination = ({ pagination, onPageChange }) => {
  const { currentPage, totalPages, hasPrev, hasNext } = pagination;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="flex justify-center items-center space-x-2"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Previous
      </button>
      
      <span className="px-4 py-2 text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </motion.div>
  );
};