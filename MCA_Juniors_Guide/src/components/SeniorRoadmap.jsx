import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  FileText,
  Loader,
  Save,
  Upload,
  User,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";

// --- Configuration (Defined outside the component to prevent re-creation) ---
const domainOptions = [
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const errorVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// --- Main Component ---
export default function ExperienceForm() {
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        linkedin: "",
        github: "",
        domain: "",
        technologies: "",
        preparation: "",
        advice: "",
        resume: null, // Will store the File object
    });

    const [companies, setCompanies] = useState([]);
    const [showAddCompany, setShowAddCompany] = useState(false);
    const [newCompanyName, setNewCompanyName] = useState("");

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Fetch companies on component mount
    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await fetch('https://padidaw-parama-backend.onrender.com/api/companies');
            const result = await response.json();
            if (result.success) {
                setCompanies(result.data);
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    const handleAddCompany = async () => {
        if (!newCompanyName.trim()) return;
        
        try {
            const response = await fetch('https://padidaw-parama-backend.onrender.com/api/companies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCompanyName.trim() })
            });
            const result = await response.json();
            
            if (result.success) {
                setCompanies(prev => [...prev, result.data].sort((a, b) => a.name.localeCompare(b.name)));
                setFormData(prev => ({ ...prev, company: result.data.name }));
                setNewCompanyName("");
                setShowAddCompany(false);
            }
        } catch (error) {
            console.error('Error adding company:', error);
        }
    };

    // --- Optimized Validation ---
    // isFormValid is now derived from formData on each render, not stored in state.
    const isFormValid = useMemo(() => {
        return (
            formData.name.trim() &&
            formData.linkedin.trim() &&
            /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(formData.linkedin) &&
            formData.github.trim() &&
            /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/.test(formData.github) &&
            formData.domain &&
            formData.technologies.trim() &&
            formData.preparation.trim() &&
            formData.resume
        );
    }, [formData]);
    
    const validateField = (name, value) => {
        let error = "";
        if (typeof value === 'string' && !value.trim()) {
            error = "This field is required";
        } else if (name === 'linkedin' && !/^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(value)) {
            error = "Please enter a valid LinkedIn URL";
        } else if (name === 'github' && !/^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/.test(value)) {
            error = "Please enter a valid GitHub URL";
        }
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        let error = "";
        if (!file) {
            error = "Resume is required";
        } else if (file.size > 500 * 1024) {
            error = "File size must be less than 500KB";
            e.target.value = null; // Clear the input
        } else {
            setFormData({ ...formData, resume: file });
        }
        setErrors(prev => ({ ...prev, resume: error }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        
        setIsSubmitting(true);
        
        try {
            // Create FormData for file upload
            const submitData = new FormData();
            submitData.append('name', formData.name.trim());
            submitData.append('company', formData.company || "Not specified");
            submitData.append('linkedin', formData.linkedin.trim());
            submitData.append('github', formData.github.trim());
            submitData.append('domain', formData.domain);
            submitData.append('technologies', formData.technologies.trim());
            submitData.append('preparation', formData.preparation.trim());
            submitData.append('advice', formData.advice.trim() || "No additional advice provided");
            submitData.append('resume', formData.resume);

            // Submit to backend
            const response = await fetch('https://padidaw-parama-backend.onrender.com/api/roadmaps/submit', {
                method: 'POST',
                body: submitData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to submit roadmap');
            }

            console.log('Roadmap submitted successfully:', result);
            setShowSuccess(true);
            
            setTimeout(() => {
                setShowSuccess(false);
                setFormData({ name: "", company: "", linkedin: "", github: "", domain: "", technologies: "", preparation: "", advice: "", resume: null });
                setErrors({});
                // Reset file input
                const fileInput = document.querySelector('input[type="file"]');
                if (fileInput) fileInput.value = '';
            }, 3000);
        } catch (error) {
            console.error('Error submitting roadmap:', error);
            setErrors({ submit: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#ECFAE5] to-[#DDF6D2] font-['Space_Grotesk'] text-gray-800 p-4 sm:p-6 lg:p-8">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&family=Space+Grotesk:wght@400;500;700&display=swap');
                body { font-family: 'Space Grotesk', sans-serif; }
                .font-serif { font-family: 'Instrument Serif', serif; }
            `}</style>
            
            <AnimatePresence>
                {showSuccess && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md mx-auto">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h3 className="font-serif text-2xl mb-2 text-gray-900">Thank You!</h3>
                            <p className="text-gray-600 mb-4">Your roadmap has been published successfully!</p>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden"><motion.div className="h-full bg-green-500" animate={{ width: ["0%", "100%"] }} transition={{ duration: 3, ease: "linear" }} /></div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-12">
                    <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="font-serif text-4xl sm:text-5xl text-gray-800 mb-4">Share Your Experience</motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-lg text-gray-600 max-w-2xl mx-auto">Help guide juniors by sharing your career journey and professional insights.</motion.p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Submission Error */}
                    {errors.submit && (
                        <motion.div variants={errorVariants} initial="hidden" animate="visible" className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                            <span className="text-red-700">{errors.submit}</span>
                        </motion.div>
                    )}
                    {/* --- Basic Information --- */}
                    <motion.div variants={cardVariants} initial="hidden" animate="visible" className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50">
                        <h2 className="font-serif text-2xl text-gray-900 mb-6 flex items-center"><User className="w-6 h-6 mr-3 text-green-600"/>Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField name="name" label="Your Name*" value={formData.name} onChange={handleChange} error={errors.name} placeholder="e.g., Jane Doe" />
                            <CompanyDropdown 
                                value={formData.company} 
                                onChange={(value) => setFormData(prev => ({ ...prev, company: value }))}
                                companies={companies}
                                showAddCompany={showAddCompany}
                                setShowAddCompany={setShowAddCompany}
                                newCompanyName={newCompanyName}
                                setNewCompanyName={setNewCompanyName}
                                onAddCompany={handleAddCompany}
                            />
                            <InputField name="linkedin" label="LinkedIn Profile*" value={formData.linkedin} onChange={handleChange} error={errors.linkedin} placeholder="https://linkedin.com/in/..." />
                            <InputField name="github" label="GitHub Profile*" value={formData.github} onChange={handleChange} error={errors.github} placeholder="https://github.com/..." />
                        </div>
                    </motion.div>

                    {/* --- Professional Details --- */}
                    <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{delay: 0.1}} className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50">
                        <h2 className="font-serif text-2xl text-gray-900 mb-6 flex items-center"><BookOpen className="w-6 h-6 mr-3 text-green-600"/>Professional Details</h2>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="domain" className="block text-sm font-bold text-gray-700 mb-2">Your Domain*</label>
                                <select name="domain" id="domain" required value={formData.domain} onChange={handleChange} onBlur={(e) => validateField(e.target.name, e.target.value)} className={`w-full px-4 py-3 bg-gray-50 border ${errors.domain ? 'border-red-400' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-green-500`}>
                                    <option value="" disabled>Select a domain</option>
                                    {domainOptions.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                                </select>
                                <ErrorMessage error={errors.domain} />
                            </div>
                            <TextAreaField name="technologies" label="Technologies & Skills*" value={formData.technologies} onChange={handleChange} error={errors.technologies} placeholder="e.g., React, Node.js, Python..." />
                            <TextAreaField name="preparation" label="Preparation Strategy*" value={formData.preparation} onChange={handleChange} error={errors.preparation} placeholder="Describe your preparation journey..." />
                            <TextAreaField name="advice" label="Advice for Juniors (Optional)" value={formData.advice} onChange={handleChange} placeholder="Any tips or wisdom to share..." />
                        </div>
                    </motion.div>
                    
                    {/* --- Resume Upload --- */}
                    <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{delay: 0.2}} className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50">
                         <h2 className="font-serif text-2xl text-gray-900 mb-6 flex items-center"><FileText className="w-6 h-6 mr-3 text-green-600"/>Resume Upload*</h2>
                         <div className={`p-6 rounded-lg border-2 border-dashed ${errors.resume ? 'border-red-400' : formData.resume ? 'border-green-400' : 'border-gray-300'} transition-colors`}>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${formData.resume ? 'bg-green-100' : 'bg-gray-100'}`}>
                                    {formData.resume ? <CheckCircle className="w-8 h-8 text-green-600" /> : <Upload className="w-8 h-8 text-gray-500" />}
                                </div>
                                <div className="flex-grow text-center sm:text-left">
                                    <span className="block font-semibold text-gray-700">{formData.resume?.name || "Upload your resume"}</span>
                                    <span className="text-sm text-gray-500">PDF, DOC, DOCX (Max 500KB)</span>
                                </div>
                                <label className="cursor-pointer px-6 py-3 rounded-lg font-semibold transition-colors bg-green-500 text-white hover:bg-green-600">
                                    {formData.resume ? 'Change File' : 'Choose File'}
                                    <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                                </label>
                            </div>
                         </div>
                         <ErrorMessage error={errors.resume} />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <button type="submit" disabled={!isFormValid || isSubmitting} className="w-full flex items-center justify-center gap-3 px-4 py-4 font-bold text-white bg-gray-800 rounded-lg hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform enabled:hover:scale-105">
                            {isSubmitting ? <><motion.div animate={{rotate:360}} transition={{duration:1, repeat:Infinity, ease:"linear"}}><Loader className="w-5 h-5"/></motion.div><span>Submitting...</span></> : <><Save className="w-5 h-5" /><span>Submit Your Experience</span></>}
                        </button>
                    </motion.div>
                </form>
            </div>
        </div>
    );
};

// --- Reusable Form Field Components ---
const InputField = ({ name, label, value, onChange, error, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
        <input id={name} name={name} value={value} onChange={onChange} {...props} className={`w-full px-4 py-3 bg-gray-50 border ${error ? 'border-red-400' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition`} />
        <ErrorMessage error={error} />
    </div>
);

const TextAreaField = ({ name, label, value, onChange, error, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
        <textarea id={name} name={name} value={value} onChange={onChange} {...props} rows="4" className={`w-full px-4 py-3 bg-gray-50 border ${error ? 'border-red-400' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none`} />
        <ErrorMessage error={error} />
    </div>
);

const ErrorMessage = ({ error }) => (
    <AnimatePresence>
        {error && (
            <motion.div variants={errorVariants} initial="hidden" animate="visible" exit="hidden" className="flex items-center mt-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
            </motion.div>
        )}
    </AnimatePresence>
);

const CompanyDropdown = ({ value, onChange, companies, showAddCompany, setShowAddCompany, newCompanyName, setNewCompanyName, onAddCompany }) => (
    <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Company (Optional)</label>
        <div className="space-y-2">
            <select 
                value={value} 
                onChange={(e) => {
                    if (e.target.value === 'ADD_NEW') {
                        setShowAddCompany(true);
                    } else {
                        onChange(e.target.value);
                    }
                }}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            >
                <option value="">Select a company</option>
                {companies.map(company => (
                    <option key={company._id} value={company.name}>{company.name}</option>
                ))}
                <option value="ADD_NEW">+ Add New Company</option>
            </select>
            
            {showAddCompany && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    className="flex gap-2"
                >
                    <input
                        type="text"
                        value={newCompanyName}
                        onChange={(e) => setNewCompanyName(e.target.value)}
                        placeholder="Enter company name"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                        onKeyPress={(e) => e.key === 'Enter' && onAddCompany()}
                    />
                    <button
                        type="button"
                        onClick={onAddCompany}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                        Add
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setShowAddCompany(false);
                            setNewCompanyName("");
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>
                </motion.div>
            )}
        </div>
    </div>
);
