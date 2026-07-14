import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Menu, X, ArrowUp, LogOut, Home, Briefcase, FileText, Lightbulb, User } from 'lucide-react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const alumniNavLinks = [
  { href: '', text: 'Dashboard', icon: Home },
  { href: 'post', text: 'New Post', icon: Briefcase },
];

const AlumniHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuth();

  const handleLogout = () => { logout(); navigate('/', { replace: true }); };

  const isActive = (path) => {
    const current = location.pathname.replace('/alumni/', '').replace('/alumni', '');
    return current === path;
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg shadow-sm border-b border-amber-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/alumni" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <GraduationCap className="w-8 h-8 text-amber-600" />
              <span className="font-serif text-2xl font-bold text-gray-900">Vidivu</span>
              <span className="hidden sm:inline text-sm text-amber-600 font-semibold">Alumni</span>
            </Link>

            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              <nav className="flex items-center gap-4">
                {alumniNavLinks.map(({ href, text, icon: Icon }) => (
                  <Link
                    key={text}
                    to={`/alumni/${href}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive(href)
                        ? 'bg-amber-50 text-amber-700 font-medium'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{text}</span>
                  </Link>
                ))}
              </nav>
              <div className="h-6 w-px bg-gray-300" />
              <Link
                to="/alumni/profile"
                className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-sm font-bold hover:opacity-90 transition-opacity"
                title="My Profile"
              >
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg font-medium transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>

            <div className="md:hidden">
              <motion.button onClick={() => setIsOpen(!isOpen)} whileTap={{ scale: 0.9 }} className="p-2 rounded-lg hover:bg-gray-100">
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>

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
                {alumniNavLinks.map(({ href, text, icon: Icon }) => (
                  <Link
                    key={text}
                    to={`/alumni/${href}`}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(href) ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />{text}
                  </Link>
                ))}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <Link
                    to="/alumni/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xs font-bold">
                      {user?.firstName?.[0]}
                    </div>
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-lg font-medium"
                  >
                    <LogOut className="w-5 h-5" />Logout
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

export default function AlumniLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollToTop = useCallback(() => window.scrollTo({ top: 0, behavior: 'smooth' }), []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    let id;
    const onScroll = () => { clearTimeout(id); id = setTimeout(() => setShowScrollTop(window.scrollY > 300), 100); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(id); };
  }, []);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
    </div>
  );

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@500&family=Space+Grotesk:wght@400;500;700&display=swap');
        body { font-family: 'Space Grotesk', sans-serif; }
        .font-serif { font-family: 'Instrument Serif', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <AlumniHeader />
      <main className="flex-grow pt-20">
        <div className="max-w-10xl mx-auto min-h-[calc(100vh-160px)]" style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' }}>
          <Outlet />
        </div>
      </main>

      <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-8 px-4 text-center">
          <p className="font-mono text-sm text-gray-500">&copy; {new Date().getFullYear()} Vidivu. All rights reserved.</p>
        </div>
      </motion.footer>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3 bg-amber-600 text-white rounded-full shadow-lg hover:bg-amber-700 transition-colors"
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
