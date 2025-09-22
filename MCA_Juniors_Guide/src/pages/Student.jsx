import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Link as LinkIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- CUSTOM HOOK FOR DAILY TOPIC ---
const useTodaysTopic = () => {
    const [topic, setTopic] = useState({ title: 'Loading Topic...', description: 'Please wait a moment.', links: [] });
    const [loading, setLoading] = useState(true);

    const fetchDailyTopic = async () => {
        try{
            const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
            const storyIds = await response.json();
            
            const randomStoryId = storyIds[Math.floor(Math.random() * Math.min(10, storyIds.length))];
            const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${randomStoryId}.json`);
            const story = await storyResponse.json();
            
            return {
                title: story.title,
                description: story.text || 'Discover the latest in technology and innovation. Click the link below to read more about this trending topic.',
                links: [
                    { name: 'Read Full Article', url: story.url || `https://news.ycombinator.com/item?id=${story.id}` },
                    { name: 'HackerNews Discussion', url: `https://news.ycombinator.com/item?id=${story.id}` }
                ]
            };
        }catch(err){
            console.log(err);
        }
    };

    useEffect(() => {
        const loadTopic = async () => {
            const storedData = localStorage.getItem('todaysTopicData');
            const now = new Date().getTime();
            
            if (storedData) {
                const { topic: storedTopic, timestamp } = JSON.parse(storedData);
                if (now - timestamp < 24 * 60 * 60 * 1000) {
                    setTopic(storedTopic);
                    setLoading(false);
                    return;
                }
            }
            
            try {
                const newTopic = await fetchDailyTopic();
                setTopic(newTopic);
                localStorage.setItem('todaysTopicData', JSON.stringify({ topic: newTopic, timestamp: now }));
            } catch (error) {
                setTopic({ title: 'Unable to fetch topic', description: 'Please check your internet connection and try again.', links: [] });
            }
            setLoading(false);
        };

        loadTopic();
    }, []);

    return { topic, loading };
};


// --- DATA & CONFIGURATION ---
const useDashboardFeatures = () => useMemo(() => [
    { 
      id: 'resources', 
      title: 'Academic Resources', 
      description: 'A vast library of notes and e-books.',
      imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800&auto=format&fit=crop',
      buttonText: 'Unlock Knowledge',
    },
    { 
      id: 'problemsolving', 
      title: 'Problem Solving', 
      description: 'Master key algorithmic patterns.',
      imageUrl: 'https://images.unsplash.com/photo-1589149098258-3e9102cd63d3?q=80&w=800&auto=format&fit=crop',
      buttonText: 'Sharpen Skills',
    },
    { 
      id: 'projects', 
      title: 'Project Guidelines', 
      description: 'End-to-end guidance for impactful projects.',
      imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop',
      buttonText: 'Build Your Vision',
    },
    { 
      id: 'markingsystem', 
      title: 'Marking System', 
      description: 'Understand evaluation and scoring.',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
      buttonText: 'Decode Grades',
    },
    { 
      id: 'roadmap', 
      title: 'Seniors Experience', 
      description: 'Learn from real stories and alumni tips.',
      imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop',
      buttonText: 'Gain Insights',
    },
    // { 
    //   id: 'guide', 
    //   title: 'Guidance', 
    //   description: 'Connect with mentors and guides.',
    //   imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop',
    //   buttonText: 'Get Support',
    // },
    { 
      id: 'leavetracker', 
      title: 'Leave Tracker', 
      description: 'Manage your attendance and leave.',
      imageUrl: 'https://ik.imagekit.io/HoneyJoe/aerial-view-doctor-writing-patient-daily-report-checklist.jpg?updatedAt=1758299821982',
      buttonText: 'Track Your Time Left',
    },
], []);

// --- ANIMATION VARIANTS ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.07, delayChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

// --- REUSABLE COMPONENTS ---
const FeatureCard = ({ feature }) => {
  const navigate = useNavigate();
    const handleRedirect = () => {
        if(feature.id === 'leavetracker'){
            navigate(`/student/${feature.id}`);
            return;
        }       
        // console.log(`Redirecting to ${feature.id}...`);
        navigate(`/student/${feature.id}`);
    };

    return (
        <motion.div
            variants={itemVariants}
            className="relative group rounded-2xl overflow-hidden h-full shadow-lg"
            style={{ minHeight: '250px' }}
        >
            <img
                src={feature.imageUrl}
                alt={feature.title}
                className="absolute bg-[#000000b7] inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/ef4444/ffffff?text=Error'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t   to-transparent" />
            <div className="relative h-full flex flex-col justify-end p-3 sm:p-4 lg:p-6 text-white">
                <h3 className="font-space font-bold text-lg sm:text-xl lg:text-2xl">
                    {feature.title} 
                </h3>
                <p className="font-inter text-xs sm:text-sm mt-1 opacity-90">
                    {feature.description}
                </p>
                <motion.button
                    onClick={handleRedirect}
                    className="mt-3 sm:mt-4 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold py-2 px-3 sm:px-4 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {feature.buttonText}
                    <ArrowRight className="w-4 h-4" />
                </motion.button>
            </div>
        </motion.div>
    );
};

const TopicOfTheDay = ({ topic, loading }) => {
    return (
        <motion.section 
            className="mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
        >
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-#DDF6D2-800 to-#DDF6D2-900 text-black shadow-2xl">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 sm:gap-6 lg:gap-8">
                    {/* Left Side: Title and Description */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <Star className={`w-6 h-6 text-green-400 ${loading ? 'animate-pulse' : ''}`}/>
                            <p className="font-mono text-sm font-semibold tracking-wider uppercase text-green-400">
                                Topic of the Day
                            </p>
                        </div>
                        <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl xl:text-4xl">
                            {loading ? 'Fetching today\'s topic...' : topic.title}
                        </h3>
                        <p className="font-inter text-sm sm:text-base mt-3 opacity-80 leading-relaxed">
                            {loading ? 'Getting the latest trending topic for you.' : topic.description}
                        </p>
                    </div>

                    {/* Right Side: Learn More Links - Stacks below on mobile */}
                    {!loading && topic.links && topic.links.length > 0 && (
                        <div className="flex-shrink-0 lg:border-l lg:border-gray-700 lg:pl-8 mt-4 sm:mt-6 lg:mt-0 pt-4 sm:pt-6 lg:pt-0 border-t border-gray-700 lg:border-t-0">
                            <h4 className="font-space font-semibold text-base sm:text-lg mb-3">Learn More:</h4>
                            <ul className="space-y-2">
                                {topic.links.map((link, index) => (
                                    <li key={index}>
                                        <a 
                                            href={link.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-xs sm:text-sm text-black-300 hover:text-gray transition-colors group"
                                        >
                                            <LinkIcon className="w-4 h-4 text-gray-400 group-hover:text-green-400 transition-colors" />
                                            <span>{link.name}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </motion.section>
    );
};


// --- MAIN DASHBOARD COMPONENT ---
const RedesignedDashboard = () => {
    const dashboardFeatures = useDashboardFeatures();
    const { topic: todaysTopic, loading: topicLoading } = useTodaysTopic();

    return (
        <div className="min-h-screen bg-#DDF6D2">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
                body { 
                    font-family: 'Inter', sans-serif; 
                    background-color: #ffffff;
                }
                .font-space { font-family: 'Space Grotesk', sans-serif; }
                .font-inter { font-family: 'Inter', sans-serif; }
            `}</style>

            <div className="bg-gradient-to-b from-#DDF6D2 to-white">
                <section className="py-12 md:py-16 text-center">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <motion.h2 
                            className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            Your Academic Command Center
                        </motion.h2>
                        <motion.p 
                            className="font-inter text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto mt-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                        >
                            Every tool, every resource, every opportunity—right at your fingertips.
                        </motion.p>
                    </div>
                </section>

                <main className="pb-16 sm:pb-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <TopicOfTheDay topic={todaysTopic} loading={topicLoading} />
                        
                        <motion.div 
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {dashboardFeatures.map((feature) => (
                                <FeatureCard key={feature.id} feature={feature} />
                            ))}
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default RedesignedDashboard;
