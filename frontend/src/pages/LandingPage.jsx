import { memo, useMemo, lazy, Suspense, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Rocket, BookOpen, FileText, Lightbulb, Zap, Target, Sparkles, CheckCircle, ArrowRight, Star, Users, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Lazy load components for better performance
// const StatsSection = lazy(() => import('../components/StatsSection'));

// Animation variants with reduced motion support
const createVariants = (shouldReduce) => ({
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduce ? 0 : 0.1,
        delayChildren: shouldReduce ? 0 : 0.2,
      },
    },
  },
  item: {
    hidden: { y: shouldReduce ? 0 : 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: shouldReduce ? { duration: 0.3 } : { type: 'spring', stiffness: 120 },
    },
  },
  card: {
    hidden: { y: shouldReduce ? 0 : 30, opacity: 0, scale: shouldReduce ? 1 : 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: shouldReduce ? 0.3 : 0.5, ease: [0.25, 1, 0.5, 1] },
    },
  },
});

// Original features data with restored colors
const FEATURES = [
  {
    id: 'tech-roadmap',
    icon: Rocket,
    title: 'Tech Roadmap',
    description: 'Navigate your learning journey with curated paths designed by industry experts. From foundational concepts to advanced specializations, we provide a clear route to mastery.',
    highlight: '50+ Learning Paths',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    subFeatures: ['Step-by-step guides', 'Beginner to advanced topics', 'Specialized career tracks']
  },
  {
    id: 'academic-resources',
    icon: BookOpen,
    title: 'Academic Resources',
    description: 'Gain access to a vast library of premium study materials. Find comprehensive notes, e-books, and presentations for every subject in your curriculum.',
    highlight: '1000+ Resources',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    subFeatures: ['Subject-wise notes', 'Curated e-book library', 'Presentation slides']
  },
  {
    id: 'past-papers',
    icon: FileText,
    title: 'Past Papers',
    description: 'Prepare for exams with an extensive collection of previous year question papers. Understand patterns, manage your time, and ace your assessments.',
    highlight: '5 Years Coverage',
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
    subFeatures: ['All major subjects covered', 'Detailed solution keys', 'Time-based practice sets']
  },
  {
    id: 'problem-solving',
    icon: Lightbulb,
    title: 'Problem-Solving Patterns',
    description: 'Master the art of algorithmic thinking. Our curated collection of problem-solving patterns will equip you to tackle any coding challenge with confidence.',
    highlight: '200+ Patterns',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    subFeatures: ['Data structures patterns', 'Algorithmic techniques', 'Company-wise questions']
  },
  {
    id: 'project-guide',
    icon: Zap,
    title: 'Project Guide',
    description: 'Receive end-to-end guidance for building impactful projects. From ideation and design to deployment and presentation, we support you at every step.',
    highlight: 'Live Mentorship',
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-600',
    subFeatures: ['Project idea repository', 'Code review sessions', 'Deployment assistance']
  },
  {
    id: 'interview-experiences',
    icon: Target,
    title: 'Interview Experiences',
    description: 'Learn from the best. Read through hundreds of real interview stories and preparation tips shared by seniors and alumni from top companies.',
    highlight: '300+ Experiences',
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    subFeatures: ['Company-specific experiences', 'Technical & HR round insights', 'Salary negotiation tips']
  }
];

// Memoized components for performance
const FeatureCard = memo(({ feature, shouldReduce }) => {
  const Icon = feature.icon;
  
  return (
    <motion.div
      variants={createVariants(shouldReduce).card}
      whileHover={shouldReduce ? {} : { 
        translateY: -8,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}
      className="relative flex flex-col justify-between p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-lg h-full"
    >
      
      <div className="flex-grow">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.bgColor}`}>
          <Icon className={`w-6 h-6 ${feature.iconColor}`} />
        </div>
        <h3 className="mt-4 text-xl font-bold font-space text-gray-800">{feature.title}</h3>
        <p className="mt-2 text-gray-600 font-sans leading-relaxed">{feature.description}</p>
      </div>
      <div className="mt-6">
        <p className="font-mono text-sm text-gray-500 bg-gray-100/80 px-3 py-1 rounded-full inline-block">
          {feature.highlight}
        </p>
      </div>
    </motion.div>
  );
});

const FeatureSection = memo(({ feature, index, shouldReduce }) => {
  const isReversed = index % 2 !== 0;
  
  return (
    <motion.section
      initial={{ opacity: 0, y: shouldReduce ? 0 : 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 xl:gap-16 ${isReversed ? 'lg:flex-row-reverse' : ''}`}
    >
      <div className="w-full lg:w-1/2 xl:w-2/5 px-4 sm:px-0">
        <div className="relative">
          <div className={`absolute -left-4 top-1 h-8 w-1 ${feature.bgColor.replace('bg-', 'bg-')}`} style={{ backgroundColor: `var(--${feature.iconColor.replace('text-','color-')})` }}></div>
          <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{feature.title}</h3>
        </div>
        
        <p className="mt-4 text-base sm:text-lg text-gray-700 leading-relaxed">{feature.description}</p>
        
        <ul className="mt-6 space-y-3">
          {feature.subFeatures.map((sub, i) => (
            <li key={i} className="flex items-center gap-3">
              <CheckCircle className={`w-5 h-5 ${feature.iconColor}`} />
              <span className="text-gray-700">{sub}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="w-full lg:w-1/2 xl:w-3/5 px-4 sm:px-0">
        <FeatureCard feature={feature} shouldReduce={shouldReduce} />
      </div>
    </motion.section>
  );
});

const HeroSection = memo(({ shouldReduce }) => {
  const variants = createVariants(shouldReduce);
  
  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={variants.container}
      className="pt-10 pb-24 sm:pt-48 sm:pb-32 text-center"
    >

      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div variants={variants.item} className="mb-6">
          <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-700 border border-gray-200/50">
            <Star className="w-4 h-4 text-yellow-500" />
            Built by MCA Seniors
          </span>
        </motion.div>
        
        <motion.h1 
          variants={variants.item}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-serif leading-tight text-gray-900"
        >
          Innaila Irunthu Vidivu Kaalam
          <motion.span 
            className="block text-gray-500 italic text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mt-2"
          >
            daw Unaku
          </motion.span>
        </motion.h1>
        
        <motion.p variants={variants.item} className="mt-6 text-base sm:text-lg lg:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed font-space px-4">
          Built by <span className="font-bold text-gray-900">MCA seniors</span> for juniors – your comprehensive academic and career navigator, designed with love and expertise.
        </motion.p>
        
        <motion.div variants={variants.item} className="mt-8 sm:mt-10 flex items-center justify-center gap-4 px-4">
          <Link to="/login">
            <motion.button 
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-800 px-6 py-3 sm:px-8 sm:py-4 font-bold text-white shadow-lg text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="absolute bottom-0 left-0 mb-9 ml-9 h-48 w-48 -translate-x-full translate-y-full rotate-[-40deg] rounded-full bg-white/10 transition-all duration-500 ease-in-out group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
              <span className="relative flex items-center gap-2">
                <Sparkles className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                Start Your Journey
              </span>
            </motion.button>
          </Link>
          

        </motion.div>
        

      </div>
    </motion.header>
  );
});


FeatureCard.displayName = 'FeatureCard';
FeatureSection.displayName = 'FeatureSection';
HeroSection.displayName = 'HeroSection';

export default function LandingPage() {
  const shouldReduce = useReducedMotion();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect to student page if user is authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/student');
    }
  }, [isAuthenticated, isLoading, navigate]);

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
    <div className="min-h-screen font-sans text-gray-800 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@500&family=Space+Grotesk:wght@400;500;700&display=swap');
        body { font-family: 'Space Grotesk', sans-serif; scroll-behavior: smooth; }
        .font-serif { font-family: 'Instrument Serif', serif; }
        .font-space { font-family: 'Space Grotesk', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}
      </style>
      
      <div className="relative z-10">
      <HeroSection shouldReduce={shouldReduce} />
      {isAuthenticated && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      )}
      
      <main id="features" className="sm:py-24 md:py-32 bg-gradient-to-b from-#DDF6D2 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-gray-900 px-4">Everything You Need, All in One Place</h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">Explore our curated resources designed to help you succeed academically and professionally.</p>
          </div>
          <div className="flex flex-col gap-16 sm:gap-20 lg:gap-24 xl:gap-32">
            {FEATURES.map((feature, index) => (
              <FeatureSection
                key={feature.id}
                feature={feature}
                index={index}
                shouldReduce={shouldReduce}
              />
            ))}
          </div>
        </div>
      </main>
      
      </div>
    </div>
  );
}