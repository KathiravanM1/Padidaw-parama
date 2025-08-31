import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Calendar,
  ChevronRight,
  Code,
  Download,
  ExternalLink,
  FileText,
  Filter,
  Github,
  Lightbulb,
  Linkedin,
  Search,
  User,
  Palette,
  Server,
  Layers,
  Smartphone,
  GitMerge,
  BarChart,
  BrainCircuit,
  Shield,
  Cloud,
  Link,
  Gamepad2,
  PenTool,
  ClipboardCheck,
  FlaskConical,
  Briefcase,
} from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

const API_BASE_URL = 'https://padidaw-parama-backend.onrender.com/api';

const domainOptions = [
    { value: "all", label: "All Domains", icon: Filter },
    { value: "frontend", label: "Frontend Development", color: "from-green-500 to-emerald-500", icon: Palette },
    { value: "backend", label: "Backend Development", color: "from-green-600 to-emerald-600", icon: Server },
    { value: "fullstack", label: "Full Stack Development", color: "from-green-700 to-emerald-700", icon: Layers },
    { value: "mobile", label: "Mobile Development", color: "from-green-500 to-teal-500", icon: Smartphone },
    { value: "devops", label: "DevOps Engineering", color: "from-green-600 to-teal-600", icon: GitMerge },
    { value: "data-science", label: "Data Science", color: "from-green-700 to-teal-700", icon: BarChart },
    { value: "machine-learning", label: "Machine Learning", color: "from-green-500 to-cyan-500", icon: BrainCircuit },
    { value: "cybersecurity", label: "Cybersecurity", color: "from-green-600 to-cyan-600", icon: Shield },
    { value: "cloud", label: "Cloud Computing", color: "from-green-500 to-blue-500", icon: Cloud },
    { value: "blockchain", label: "Blockchain", color: "from-green-600 to-blue-600", icon: Link },
    { value: "game-dev", label: "Game Development", color: "from-green-700 to-blue-700", icon: Gamepad2 },
    { value: "ui-ux", label: "UI/UX Design", color: "from-green-500 to-purple-500", icon: PenTool },
    { value: "product-management", label: "Product Management", color: "from-green-600 to-purple-600", icon: ClipboardCheck },
    { value: "qa-testing", label: "QA Testing", color: "from-green-500 to-amber-500", icon: FlaskConical },
    { value: "other", label: "Other", color: "from-green-600 to-gray-500", icon: Briefcase },
];

// --- Helper Functions ---
const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Recently";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};


// --- Child Components ---

const EnhancedExperienceDetails = ({ experience, onBack }) => {
  if (!experience) return null;

  const domainInfo = domainOptions.find((d) => d.value === experience.domain) || domainOptions[domainOptions.length - 1];
  const Icon = domainInfo.icon;

  const handleResumeDownload = async (id, fileName) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/roadmaps/download/${id}`);
      if (response.data.success) {
        const link = document.createElement('a');
        link.href = response.data.data.resumeUrl;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <motion.div
      key="details"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-[#DDF6D2] to-white font-['Space_Grotesk'] text-gray-800 p-5"
    >
      <motion.div className="max-w-4xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants}>
          <button onClick={onBack} className="inline-flex items-center text-gray-600 hover:text-green-600 mb-8 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 border border-white/50">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="font-medium">Back to experiences</span>
          </button>
        </motion.div>
        <motion.div className="bg-white backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden mb-8 border border-white/50" variants={itemVariants}>
          <div className={`bg-gradient-to-r ${domainInfo.color} p-8 relative`}>
            <div className="relative z-10 text-center text-white">
              <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl font-bold mx-auto mb-6 border-4 border-white/30">
                <span className="text-white drop-shadow-lg">{experience.name.charAt(0).toUpperCase()}</span>
              </div>
              <h1 className="font-['Instrument_Serif'] text-4xl mb-3 font-normal drop-shadow-lg">{experience.name}</h1>
              <p className="text-xl mb-4 opacity-90">{experience.company !== "Not specified" ? <>Placed On: {experience.company}</> : "Independent Journey"}</p>
              {experience.timestamp && <div className="mb-6"><div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-lg font-medium"><Calendar className="w-5 h-5 mr-2" />Posted on {experience.timestamp}</div></div>}
              <div className="flex flex-wrap justify-center items-center gap-4"><span className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/30"><Icon className="w-5 h-5 mr-2" />{domainInfo.label}</span></div>
              {(experience.linkedin || experience.github) && <div className="flex justify-center gap-4 mt-6">{experience.linkedin && <a href={experience.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full text-white font-medium transition-colors duration-300 border border-white/30"><Linkedin className="w-4 h-4 mr-2" />LinkedIn</a>}{experience.github && <a href={experience.github} target="_blank" rel="noopener noreferrer" className="flex items-center bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full text-white font-medium transition-colors duration-300 border border-white/30"><Github className="w-4 h-4 mr-2" />GitHub</a>}</div>}
            </div>
          </div>
        </motion.div>
        <motion.div className="bg-white/85 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50 mb-8" variants={itemVariants}><h2 className="font-['Instrument_Serif'] text-2xl text-gray-900 mb-6 flex items-center"><span className={`bg-gradient-to-r ${domainInfo.color} w-10 h-10 rounded-full mr-4 flex items-center justify-center shadow-lg`}><Code className="w-5 h-5 text-white" /></span>Technologies & Skills</h2><div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-l-4 border-green-400 shadow-inner"><div className="whitespace-pre-line text-gray-700 leading-relaxed font-medium font-['Space_Grotesk']">{experience.technologies || "No technologies specified"}</div></div></motion.div>
        <motion.div className="bg-white/85 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50 mb-8" variants={itemVariants}><h2 className="font-['Instrument_Serif'] text-2xl text-gray-900 mb-6 flex items-center"><span className="bg-gradient-to-r from-green-500 to-teal-500 w-10 h-10 rounded-full mr-4 flex items-center justify-center shadow-lg"><BookOpen className="w-5 h-5 text-white" /></span>Preparation Strategy</h2><div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-6 rounded-xl border-l-4 border-teal-400 shadow-inner"><div className="whitespace-pre-line text-gray-700 leading-relaxed font-medium font-['Space_Grotesk']">{experience.preparation || "No preparation strategy specified"}</div></div></motion.div>
        {experience.advice && experience.advice !== "No additional advice provided" && <motion.div className="mt-8 bg-white/85 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50" variants={itemVariants}><h2 className="font-['Instrument_Serif'] text-2xl text-gray-900 mb-6 flex items-center"><span className="bg-gradient-to-r from-green-500 to-amber-500 w-10 h-10 rounded-full mr-4 flex items-center justify-center shadow-lg"><Lightbulb className="w-5 h-5 text-white" /></span>Advice for Juniors</h2><div className="bg-gradient-to-br from-amber-50 to-green-50 p-6 rounded-xl border-l-4 border-amber-400 shadow-inner"><div className="whitespace-pre-line text-gray-700 leading-relaxed italic font-medium font-['Space_Grotesk']">{experience.advice}</div></div></motion.div>}
        <motion.div className="mt-8 bg-white/85 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50" variants={itemVariants}><h2 className="font-['Instrument_Serif'] text-xl text-gray-900 mb-4 flex items-center"><FileText className="w-6 h-6 mr-3 text-green-600" />Resume</h2><div className={`flex items-center bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border border-green-200 transition-colors duration-300 ${experience.resumeFileName ? "cursor-pointer hover:border-green-300" : "cursor-default"}`} onClick={() => experience.resumeUrl && handleResumeDownload(experience._id, experience.resumeFileName)}><FileText className="w-8 h-8 text-green-600 mr-4" /><span className="text-green-700 font-semibold flex-grow font-['Space_Grotesk']">{experience.resumeFileName || "Resume not provided"}</span>{experience.resumeFileName && <Download className="w-4 h-4 text-green-600 ml-2" />}</div></motion.div>
      </motion.div>
    </motion.div>
  );
};

const ExperienceCard = React.memo(({ experience, onSelect }) => {
    const domainInfo = domainOptions.find((d) => d.value === experience.domain) || domainOptions[0];
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white/90 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer border border-white/20"
            onClick={() => onSelect(experience)}
        >
            <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-base sm:text-lg font-bold text-white mr-3 sm:mr-4 flex-shrink-0">
                            {experience.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-['Instrument_Serif'] text-lg sm:text-xl text-gray-900 mb-1 truncate">{experience.name}</h3>
                            <div className="flex items-center text-gray-600 text-xs sm:text-sm mb-1 font-['Space_Grotesk']"><Building2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" /><span className="truncate">{experience.company}</span></div>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                <div className="mb-4">
                    <span className="inline-block bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium font-['Space_Grotesk'] truncate max-w-full">{domainInfo.label}</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 font-['Space_Grotesk'] gap-2">
                    <div className="flex items-center min-w-0"><Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" /><span className="truncate">Posted on {formatTimestamp(experience.createdAt)}</span></div>
                    <div className="flex items-center flex-shrink-0"><User className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /><span className="hidden sm:inline">View Details</span></div>
                </div>
            </div>
        </motion.div>
    );
});


const ExperienceListing = ({ onSelectExperience }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompany, setFilterCompany] = useState("all");
  const [displayedExperiences, setDisplayedExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (filterCompany !== "all") {
        params.append("company", filterCompany);
      }
      
      const url = `${API_BASE_URL}/roadmaps/all`;
      
      const response = await axios.get(url);
      
      if (response.data.success) {
        let data = response.data.data;
        
        if (searchTerm.trim()) {
          const searchLower = searchTerm.toLowerCase();
          data = data.filter(exp =>
            exp.name.toLowerCase().includes(searchLower) ||
            exp.company.toLowerCase().includes(searchLower) ||
            exp.technologies.toLowerCase().includes(searchLower)
          );
        }
        
        if (filterCompany !== "all") {
          data = data.filter(exp => exp.company === filterCompany);
        }
        
        setDisplayedExperiences(data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch experiences");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchExperiences();
  };
  
  useEffect(() => {
    fetchExperiences();
  }, [filterCompany]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchExperiences();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <motion.div
        key="listing"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-[#ECFAE5] font-['Space_Grotesk'] text-gray-800 p-5"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-8 sm:mb-12">
          <h1 className="font-['Instrument_Serif'] text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-4">Experience Gallery</h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto font-['Space_Grotesk'] px-4">Discover career journeys and insights from professionals across the tech industry</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 flex gap-2">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="text" placeholder="Search by name or company..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 sm:py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 font-['Space_Grotesk'] text-sm sm:text-base" />
                </div>
                <button onClick={handleSearch} className="bg-green-500 text-white px-4 py-2 sm:py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold text-sm sm:text-base">Search</button>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)} className="w-full lg:w-auto pl-10 pr-8 py-2 sm:py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white min-w-48 font-['Space_Grotesk'] text-sm sm:text-base">
                <option value="all">All Companies</option>
                {[...new Set(displayedExperiences.map(exp => exp.company))].sort().map((company) => (<option key={company} value={company}>{company}</option>))}
              </select>
            </div>
          </div>
        </motion.div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-8">
            <p className="text-red-700">{error}</p>
            <button onClick={fetchExperiences} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              Try Again
            </button>
          </motion.div>
        )}

        {!loading && !error && (
          <>
            <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <AnimatePresence>
                {displayedExperiences.map((experience) => (
                  <ExperienceCard key={experience._id} experience={experience} onSelect={onSelectExperience} />
                ))}
              </AnimatePresence>
            </motion.div>

            {displayedExperiences.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl text-gray-600 mb-2 font-['Instrument_Serif']">No experiences found</h3>
                <p className="text-gray-500 font-['Space_Grotesk']">Try adjusting your search or filter criteria</p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

// --- Main Component ---
const Roadmap = () => {
  const [selectedExperience, setSelectedExperience] = useState(null);

  return (
    <AnimatePresence mode="wait">
      {selectedExperience ? (
        <EnhancedExperienceDetails
          experience={selectedExperience}
          onBack={() => setSelectedExperience(null)}
        />
      ) : (
        <ExperienceListing onSelectExperience={setSelectedExperience} />
      )}
    </AnimatePresence>
  );
};

export default Roadmap;
