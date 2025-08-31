import React, { useState, useEffect } from 'react';
import { GraduationCap, LogOut, BookOpen, FileCode, UserCheck, Eye, Edit3, Lock, Rocket, FileText, Lightbulb, Zap, Target, ArrowRight, CheckCircle, Users, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock function for logout

// Module Section Component with alternating layout
const ModuleSection = ({ module, index, isReversed = false }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 200);
    return () => clearTimeout(timer);
  }, [index]);

  const OverviewPanel = () => (
    <div className={`flex-1 ${isVisible ? 'animate-slide-in-left' : 'opacity-0'} py-8`}>
      <div className="h-full flex flex-col justify-center">
        <p className="text-gray-600 font-space leading-relaxed mb-8 text-lg">
          {module.longDescription}
        </p>
                
        <div className="space-y-4">
          <ul className="space-y-4">
            {module.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle size={18} className="text-lime-600 mt-1 flex-shrink-0" />
                <span className="text-gray-600 font-space">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const ActionPanel = () => (
    <div className={`flex-1 ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
      <div className="bg-gradient-to-br from-lime-50 to-lime-100 rounded-3xl p-8 shadow-lg border border-lime-100 h-full flex flex-col justify-center" style={{background: 'linear-gradient(135deg, #ECFAE5 0%, #DDF6D2 100%)'}}>
        <div className="text-center">
          <div className="inline-flex p-4 rounded-2xl bg-white shadow-md mb-6">
            <module.icon size={40} className='text-gray-500' />
          </div>
                    
          <h3 className="text-2xl font-bold text-gray-800 font-serif mb-4">
            {module.title}
          </h3>
                    
          <p className="text-gray-600 font-space mb-6 leading-relaxed">
            {module.description}
          </p>
                    
          {module.highlight?.trim() && (
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold font-mono bg-gray-100 text-gray-600 border border-gray-200">
                {module.highlight}
              </div>
            </div>
          )}

                    
          <Link to={`/senior/${module.id}`} onClick={module.action}
            className={`group w-full py-4 px-6 rounded-2xl font-semibold font-space transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 bg-gray-200 text-gray-600 hover:bg-gray-300`}
          >
            <>
              <Eye size={20} />
              View 
            </>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
                    
          {module.stats && (
            <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              {module.stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-lg font-bold text-lime-600 font-serif">{stat.value}</div>
                  <div className="text-xs text-gray-500 font-space">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section className="mb-16 sm:mb-24">
      <div className={`flex flex-col lg:flex-row gap-8 items-stretch ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
        <OverviewPanel />
        <ActionPanel />
      </div>
    </section>
  );
};

// Main Senior Dashboard Component
export default function SeniorDashboard() {
  // Enhanced modules data with detailed information
  const modules = [
    {
      id: 'roadmap',
      icon: Rocket,
      title: 'Technology Roadmaps',
      description: 'Comprehensive career paths and learning trajectories for modern tech specializations.',
      longDescription: 'Explore detailed roadmaps covering Full-Stack Development, AI/ML Engineering, Cybersecurity, and emerging technologies. Each roadmap includes skill prerequisites, learning resources, and career progression paths.',
      isEditable: false,
      features: [
        'Full-Stack Development pathway with React, Node.js, and cloud technologies',
        'AI/ML roadmap covering Python, TensorFlow, and data science fundamentals',
        'Cybersecurity track with ethical hacking and security frameworks',
        'DevOps and Cloud Computing specialization paths',
        'Mobile development roadmaps for iOS and Android'
      ],
      action: () => console.log("View Roadmaps")
    },
    {
      id: 'project',
      icon: FileCode,
      title: 'Impactful Project Hub',
      description: 'Project ideation, development guidance, and showcase management platform.',
      longDescription: 'Curate innovative project ideas, provide development guidance, and manage the project showcase gallery. Review student submissions and maintain quality standards for the project portfolio.',
      isEditable: true,
      features: [
        'Curate and categorize project ideas by technology stack',
        'Review and approve student project submissions',
        'Manage project showcase gallery and featured projects',
        'Provide development guidelines and best practices',
        'Track project completion rates and student engagement'
      ],
      action: () => console.log("Manage Project Hub")
    },
    {
      id: 'problemsolving',
      icon: UserCheck,
      title: 'Post Problems From Experiences',
      description: 'Company-specific interview Problems, preparation materials, and placement guidance.',
      longDescription: 'Comprehensive collection of real interview experiences from top companies, including technical questions, HR rounds, and salary negotiations. Regularly updated with fresh insights.',
      isEditable: true,
      features: [
        'Update company-specific interview experiences',
        'Manage technical question databases',
        'Curate salary negotiation tips and strategies',
        'Organize placement preparation materials',
        'Track placement success stories and outcomes'
      ],
      action: () => console.log("Manage Interview Experiences")
    },
  ];

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Instrument+Serif:ital,wght@0,400;1,400&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');

        .font-space { font-family: 'Space Grotesk', sans-serif; }
        .font-serif { font-family: 'Instrument Serif', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .bg-lime-gradient {
          background: linear-gradient(135deg, #65a30d 0%, #4d7c0f 100%);
        }

        .bg-light-gradient {
          background: linear-gradient(135deg, #ffffff 0%, #f9fafb 50%, #f3f4f6 100%);
        }

        .shadow-lime {
          box-shadow: 0 20px 25px -5px rgba(101, 163, 13, 0.1), 0 10px 10px -5px rgba(101, 163, 13, 0.04);
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-b from-#DDF6D2 to-white">
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 font-serif animate-fade-in-up">
              Senior Dashboard
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto font-space leading-relaxed animate-fade-in-up">
              This portal offers comprehensive view-only access to academic content, projects, and interview experiences.
            </p>
          </div>
        </section>
        <main className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
          {modules.map((module, index) => (
            <ModuleSection
              key={module.id}
              module={module}
              index={index}
              isReversed={index % 2 !== 0}
            />
          ))}

        </main>
      </div>
    </>
  );
}