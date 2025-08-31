import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Breadcrumb() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    const breadcrumbNameMap = {
        'login': 'Login',
        'signup': 'Sign Up',
        'student': 'Student Dashboard',
        'senior': 'Senior Dashboard',
        'admin': 'Admin Panel',
        'resources': 'Resources',
        'projects': 'Projects',
        'problemsolving': 'Problem Solving',
        'markingsystem': 'Marking System',
        'guide': 'Guide',
        'leavetracker': 'Leave Tracker',
        'roadmap': 'Roadmap',
        'project': 'Projects'
    };

    if (pathnames.length === 0) return null;

    return (
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Link 
                to="/" 
                className="flex items-center hover:text-gray-900 transition-colors"
            >
                <Home className="w-4 h-4" />
            </Link>
            
            {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                const displayName = breadcrumbNameMap[name] || name.charAt(0).toUpperCase() + name.slice(1);

                return (
                    <div key={name} className="flex items-center space-x-2">
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        {isLast ? (
                            <span className="text-gray-900 font-medium">{displayName}</span>
                        ) : (
                            <Link 
                                to={routeTo} 
                                className="hover:text-gray-900 transition-colors"
                            >
                                {displayName}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}