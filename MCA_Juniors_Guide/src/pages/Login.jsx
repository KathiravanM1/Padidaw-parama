import { motion } from "framer-motion";
import { useMemo, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


// Animated 3D-style Logo Component
const AnimatedLogo = () => {
  const logoTransition = useMemo(() => ({
    type: "spring",
    stiffness: 100,
    damping: 15,
    duration: 0.8
  }), []);

  const textTransition = useMemo(() => ({ delay: 0.5 }), []);

  return (
    <motion.div 
      className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-6 sm:mb-8"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={logoTransition}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-#DDF6D2 to-#ECFAE5 rounded-xl sm:rounded-2xl shadow-2xl transform rotate-3">
        <div className="absolute inset-1 bg-gradient-to-br from-#ECFAE5 to-#DDF6D2 rounded-lg sm:rounded-xl"></div>
      </div>
      <div className="relative w-full h-full bg-gradient-to-br from-#DDF6D2 to-#ECFAE5 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl">
        <motion.span 
          className="text-lg sm:text-2xl md:text-3xl font-black text-gray-800 tracking-tight font-serif"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={textTransition}
        >
          MCA
        </motion.span>
      </div>
    </motion.div>
  );
};

// Floating Particles Background
const FloatingParticles = () => {
  const particles = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1.5,
      delay: Math.random() * 5,
      duration: 6 + Math.random() * 4,
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-#DDF6D2 rounded-full opacity-30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Main Login Page
export default function Login() {
  const { isAuthenticated, isLoading, login, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const brandingTransition = useMemo(() => ({ duration: 0.8 }), []);
  const titleTransition = useMemo(() => ({ delay: 0.4, duration: 0.6 }), []);
  const descTransition = useMemo(() => ({ delay: 0.6, duration: 0.6 }), []);

  // Role-based redirection
  const getRedirectPath = (userRole) => {
    switch (userRole) {
      case 'admin':
        return '/admin';
      case 'senior':
        return '/senior';
      default:
        return '/student';
    }
  };

  // Redirect based on user role if authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const redirectPath = getRedirectPath(user.role);
      navigate(redirectPath);
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      const redirectPath = getRedirectPath(result.user.role);
      navigate(redirectPath);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-#DDF6D2 to-white relative overflow-hidden font-space">
      {/* Animated Background Elements */}
      <FloatingParticles />
      
      {/* Gradient Orbs - Responsive sizes */}
      <div className="absolute top-0 -left-4 w-48 h-48 sm:w-72 sm:h-72 bg-#ECFAE5 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute top-0 -right-4 w-48 h-48 sm:w-72 sm:h-72 bg-#DDF6D2 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-10 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-#ECFAE5 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:min-h-screen">
          {/* Left Side - Branding */}
          <motion.div 
            className="flex flex-col items-center justify-center p-8 xl:p-12 bg-gradient-to-br from-#ECFAE5/50 to-#DDF6D2/50 backdrop-blur-sm"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={brandingTransition}
          >
            <div className="max-w-md text-center">
              <AnimatedLogo />
              <motion.h1 
                className="text-3xl xl:text-4xl font-bold text-gray-800 mb-4 font-serif"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={titleTransition}
              >
                Vidivu
              </motion.h1>
              <motion.p 
                className="text-base xl:text-lg text-gray-600 leading-relaxed font-space"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={descTransition}
              >
                Your gateway to seamless digital experiences. Connect, collaborate, and create with our comprehensive platform.
              </motion.p>
              
            <motion.div
                className="mt-8 xl:mt-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              >
                <div className="flex items-center justify-center gap-6 xl:gap-8 text-center text-gray-700">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 xl:w-12 xl:h-12 bg-[#ECFAE5] rounded-lg xl:rounded-xl flex items-center justify-center">
                      {/* Icon for Seniors/Mentors */}
                      <svg className="w-5 h-5 xl:w-6 xl:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xs xl:text-sm font-semibold font-space">By Seniors</h3>
                  </div>

                  <div className="text-gray-300 font-light text-2xl">/</div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 xl:w-12 xl:h-12 bg-[#ECFAE5] rounded-lg xl:rounded-xl flex items-center justify-center">
                      {/* Icon for Juniors/Students */}
                      <svg className="w-5 h-5 xl:w-6 xl:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3zm0 0v3m0 0v2m-3-5h6" />
                      </svg>
                    </div>
                    <h3 className="text-xs xl:text-sm font-semibold font-space">For Juniors</h3>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Right Side - Login Form */}
          <div className="flex items-center justify-center p-6 xl:p-12">
            <div className="w-full max-w-md">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                  <p className="text-gray-600 mt-2">Sign in to your account</p>
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>
                

                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
                
                <p className="text-center text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-green-600 hover:text-green-700 font-medium">
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
        
        {/* Mobile Layout */}
        <div className="lg:hidden min-h-screen flex flex-col items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-sm">
            <AnimatedLogo />
            <motion.h1 
              className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 text-center font-serif"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={titleTransition}
            >
              MCA Platform
            </motion.h1>
            <motion.p 
              className="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8 font-space"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={descTransition}
            >
              Welcome to your digital workspace
            </motion.p>
            <div className="transform scale-95 sm:scale-100">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Welcome Back</h2>
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-sm">
                    {error}
                  </div>
                )}
                
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Email"
                />
                
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Password"
                />
                

                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
                
                <p className="text-center text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-green-600 hover:text-green-700 font-medium">
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Instrument+Serif:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');
        
        .font-space { font-family: 'Space Grotesk', sans-serif; }
        .font-serif { font-family: 'Instrument Serif', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>
    </div>
  );
}