import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Menu, X, Twitter, Github, Linkedin, ArrowUp, LogOut, Home, Upload, FolderOpen, Users, HelpCircle, UserCheck } from 'lucide-react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// --- DATA ---
const seniorNavLinks = [
    { href: "", text: "Dashboard", icon: Home },
    { href: "resources", text: "Resources", icon: Upload },
    { href: "project", text: "Projects", icon: FolderOpen },
    { href: "problemsolving", text: "Problem Solving", icon: HelpCircle },
    { href: "roadmap", text: "Experience", icon: Users },
];

const SeniorHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAuth();
    
    const handleLogout = () => {
        logout();
        navigate('/', { replace: true });
    };

    const isActive = (path) => {
        const currentPath = location.pathname.replace('/senior/', '') || '';
        return currentPath === path;
    };

    return (
        <>
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-lg shadow-sm"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Left Side: Logo and App Name */}
                        <Link to="/senior" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <GraduationCap className="w-8 h-8 text-gray-800" />
                            <span className="font-serif text-2xl font-bold text-gray-900">Vidivu</span>
                            <span className="hidden sm:inline text-sm text-gray-600 font-medium">Senior</span>
                        </Link>

                        {/* Right Side: Desktop Navigation and Logout */}
                        <div className="hidden md:flex items-center gap-4 lg:gap-6">
                            <nav className="flex items-center gap-6">
                                {seniorNavLinks.map(link => {
                                    const Icon = link.icon;
                                    return (
                                        <Link
                                            key={link.text}
                                            to={`/senior/${link.href}`}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                                                isActive(link.href)
                                                    ? 'bg-gray-100 text-gray-900 font-medium'
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="hidden lg:inline">{link.text}</span>
                                        </Link>
                                    );
                                })}
                                <Link
                                    to="/student"
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-blue-200 font-medium"
                                    title="🎓 Access Student Dashboard - View as Student"
                                >
                                    <UserCheck className="w-4 h-4" />
                                    <span className="hidden lg:inline">Student View</span>
                                </Link>
                            </nav>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg font-medium transition-all duration-200"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden lg:inline">Logout</span>
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <motion.button 
                                onClick={() => setIsOpen(!isOpen)} 
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden bg-white border-t border-gray-200 shadow-lg"
                        >
                            <div className="px-4 py-4 space-y-2">
                                {seniorNavLinks.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <Link
                                            key={link.text}
                                            to={`/senior/${link.href}`}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                                isActive(link.href)
                                                    ? 'bg-gray-100 text-gray-900 font-medium'
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {link.text}
                                        </Link>
                                    );
                                })}
                                <Link
                                    to="/student"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-blue-200 font-medium"
                                >
                                    <UserCheck className="w-5 h-5" />
                                    🎓 Student View
                                </Link>
                                <div className="border-t border-gray-200 pt-2 mt-2">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg font-medium transition-all duration-200"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>
        </>
    );
};
const SeniorFooter = () => {
    return (
        <motion.footer 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gray-50 border-t border-gray-200"
        >
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
                <div className="flex justify-center gap-6 mb-4">
                    <motion.a 
                        href="#" 
                        whileHover={{ scale: 1.1 }}
                        className="text-gray-500 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100"
                    >
                        <Twitter className="w-5 h-5" />
                    </motion.a>
                    <motion.a 
                        href="#" 
                        whileHover={{ scale: 1.1 }}
                        className="text-gray-500 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100"
                    >
                        <Github className="w-5 h-5" />
                    </motion.a>
                    <motion.a 
                        href="#" 
                        whileHover={{ scale: 1.1 }}
                        className="text-gray-500 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100"
                    >
                        <Linkedin className="w-5 h-5" />
                    </motion.a>
                </div>
                <p className="font-mono text-sm text-gray-500">&copy; {new Date().getFullYear()} Vidivu. All rights reserved.</p>
            </div>
        </motion.footer>
    );
};


export default function SeniorLayout() {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();
    const [showScrollTop, setShowScrollTop] = useState(false);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, isLoading, navigate]);

    useEffect(() => {
        const handlePopState = () => {
            if (!isAuthenticated) {
                navigate('/', { replace: true });
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        let timeoutId;
        const handleScroll = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setShowScrollTop(window.scrollY > 300);
            }, 10);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timeoutId);
        };
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
             <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@500&family=Space+Grotesk:wght@400;500;700&display=swap');
                body { font-family: 'Space Grotesk', sans-serif; }
                .font-serif { font-family: 'Instrument Serif', serif; }
                .font-space { font-family: 'Space Grotesk', sans-serif; }
                .font-mono { font-family: 'JetBrains Mono', monospace; }
            `}</style>
            
            <SeniorHeader />
            <main className="flex-grow pt-20">
                <div className="max-w-10xl mx-auto min-h-[calc(100vh-160px)]" style={{background: 'linear-gradient(135deg, #ECFAE5 0%, #DDF6D2 100%)'}}>
                    <Outlet/>
                </div>
            </main>

            <SeniorFooter />
            
            {/* Scroll to Top Button */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        onClick={scrollToTop}
                        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 p-3 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ArrowUp className="w-5 h-5" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
