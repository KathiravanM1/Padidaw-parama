import { useState, useEffect } from 'react';
import { FileCode, UserCheck, Eye, Rocket, ArrowRight, CheckCircle } from 'lucide-react';
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
      title: 'Senior Experience Hub',
      description: 'Share your journey, insights, and career experiences to guide junior students.',
      longDescription: 'Post your professional experiences, career transitions, and valuable insights from your journey in the tech industry. Help juniors understand real-world scenarios and career paths through your authentic experiences.',
      isEditable: false,
      features: [
        'Share your career journey and professional growth stories',
        'Post insights about different tech roles and company cultures',
        'Provide guidance on skill development and learning paths',
        'Share experiences about remote work and team collaboration',
        'Offer mentorship through your real-world experiences'
      ],
      action: () => console.log("View Senior Experiences")
    },
    {
      id: 'project',
      icon: FileCode,
      title: 'Senior Project Showcase',
      description: 'Share your professional projects and guide students with real-world examples.',
      longDescription: 'Showcase your professional projects, open-source contributions, and side projects. Provide detailed insights about project development, challenges faced, and solutions implemented to inspire and guide junior developers.',
      isEditable: true,
      features: [
        'Post your professional and personal projects with detailed explanations',
        'Share project architecture, tech stack decisions, and implementation details',
        'Provide insights about project challenges and problem-solving approaches',
        'Offer guidance on project planning and development best practices',
        'Showcase open-source contributions and collaborative projects'
      ],
      action: () => console.log("Manage Senior Projects")
    },
    {
      id: 'problemsolving',
      icon: UserCheck,
      title: 'Problem Solving Challenges',
      description: 'Share interview problems and challenges you faced during your job search journey.',
      longDescription: 'Post detailed accounts of interview experiences, technical challenges, and problems you encountered during your job search. Help juniors prepare better by sharing real interview questions and scenarios.',
      isEditable: true,
      features: [
        'Share detailed interview experiences from various companies',
        'Post technical problems and coding challenges you faced',
        'Provide insights about interview processes and company cultures',
        'Share tips for handling difficult interview situations',
        'Offer guidance on salary negotiations and job offer evaluations'
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
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 font-space animate-fade-in-up">
              Share your experiences, showcase your projects, and help guide the next generation of developers through your journey.
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