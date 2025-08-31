import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { 
  Users, 
  BookOpen, 
  Brain, 
  FolderOpen, 
  FileText, 
  Edit3, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  Search,
  Filter,
  Download,
  Upload,
  Bell,
  Settings,
  ChevronDown,
  Calendar,
  Star,
  AlertTriangle,
  BarChart3,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import UpdateUserModal from '../components/UpdateUserModal';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pendingSeniors, setPendingSeniors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');


  // Fetch data on component mount and tab changes
  useEffect(() => {
    if (activeTab === 'approvals') {
      fetchPendingSeniors();
    }
    if (activeTab === 'users' || activeTab === 'dashboard') {
      fetchAllUsers();
    }
    if (activeTab === 'interviews') {
      fetchInterviewExperiences();
    }
    if (activeTab === 'problems') {
      fetchProblems();
    }
    if (activeTab === 'projects') {
      fetchProjects();
    }
    if (activeTab === 'academics') {
      fetchAcademicResources();
    }
  }, [activeTab]);

  // Initial data fetch
  useEffect(() => {
    fetchAllUsers();
    fetchPendingSeniors();
    fetchInterviewExperiences();
    fetchProblems();
    fetchProjects();
    fetchAcademicResources();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const result = await adminService.getAllUsers();
      if (result.success) {
        setAllUsers(result.data);
        setUsers(result.data);
      } else {
        setMessage('Failed to fetch users');
      }
    } catch (error) {
      setMessage('Error fetching users');
    }
  };

  const fetchPendingSeniors = async () => {
    setLoading(true);
    try {
      const result = await adminService.getPendingSeniors();
      if (result.success) {
        setPendingSeniors(result.data);
      } else {
        setMessage('Failed to fetch pending seniors');
      }
    } catch (error) {
      setMessage('Error fetching pending seniors');
    } finally {
      setLoading(false);
    }
  };

  const fetchInterviewExperiences = async () => {
    try {
      const result = await adminService.getInterviewExperiences();
      if (result.success) {
        setInterviewExperiences(result.data);
      } else {
        setMessage('Failed to fetch interview experiences');
      }
    } catch (error) {
      setMessage('Error fetching interview experiences');
    }
  };

  const fetchProblems = async () => {
    try {
      const result = await adminService.getProblems();
      if (result.success) {
        setProblems(result.data);
      } else {
        setMessage('Failed to fetch problems');
      }
    } catch (error) {
      setMessage('Error fetching problems');
    }
  };

  const fetchProjects = async () => {
    try {
      const result = await adminService.getProjects();
      if (result.success) {
        setProjects(result.data);
      } else {
        setMessage('Failed to fetch projects');
      }
    } catch (error) {
      setMessage('Error fetching projects');
    }
  };



  const handleApproveSenior = async (userId) => {
    try {
      setLoading(true);
      const result = await adminService.approveSenior(userId);
      if (result.success) {
        setMessage('✅ Senior approved successfully! User can now login.');
        // Optimistically update UI
        setPendingSeniors(prev => prev.filter(senior => senior._id !== userId));
        // Refresh all users data to show updated counts
        await fetchAllUsers();
      } else {
        setMessage(`❌ ${result.message || 'Failed to approve senior'}`);
      }
    } catch (error) {
      setMessage('❌ Error approving senior');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const handleRejectSenior = async (userId) => {
    const confirmMessage = 'Are you sure you want to reject this senior application?\n\n⚠️ This will permanently delete their data and cannot be undone.';
    
    if (window.confirm(confirmMessage)) {
      try {
        setLoading(true);
        const result = await adminService.rejectSenior(userId);
        if (result.success) {
          setMessage('🗑️ Senior application rejected and data permanently deleted.');
          // Optimistically update UI
          setPendingSeniors(prev => prev.filter(senior => senior._id !== userId));
        } else {
          setMessage(`❌ ${result.message || 'Failed to reject senior'}`);
        }
      } catch (error) {
        setMessage('❌ Error rejecting senior');
      } finally {
        setLoading(false);
        setTimeout(() => setMessage(''), 4000);
      }
    }
  };
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [interviewExperiences, setInterviewExperiences] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState(null);
  const [problems, setProblems] = useState([]);
  const [showProblemDeleteModal, setShowProblemDeleteModal] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showProjectDeleteModal, setShowProjectDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [academicResources, setAcademicResources] = useState([]);
  const [showResourceDeleteModal, setShowResourceDeleteModal] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);

  const [problemSolutions, setProblemSolutions] = useState([
    { id: 1, title: 'Dynamic Programming Approaches', category: 'Algorithms', author: 'Rohit Kumar', status: 'pending', submittedDate: '2024-08-12', difficulty: 'Hard' },
    { id: 2, title: 'Binary Search Variations', category: 'Data Structures', author: 'Anita Sharma', status: 'approved', submittedDate: '2024-08-09', difficulty: 'Medium' },
    { id: 3, title: 'Graph Traversal Methods', category: 'Algorithms', author: 'Vikash Jain', status: 'pending', submittedDate: '2024-08-11', difficulty: 'Hard' }
  ]);

  const [projectGuidelines, setProjectGuidelines] = useState([
    { id: 1, title: 'Full Stack Web Development Guide', category: 'Web Development', author: 'Sanjay Patel', status: 'approved', submittedDate: '2024-08-07', views: 245 },
    { id: 2, title: 'Machine Learning Project Roadmap', category: 'AI/ML', author: 'Kavya Singh', status: 'pending', submittedDate: '2024-08-13', views: 0 },
    { id: 3, title: 'Mobile App Development Best Practices', category: 'Mobile Development', author: 'Arjun Mehta', status: 'pending', submittedDate: '2024-08-10', views: 0 }
  ]);

  // Removed duplicate academicResources state declaration to fix redeclaration error.

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        setLoading(true);
        const result = await adminService.deleteUser(userId);
        if (result.success) {
          setMessage('User deleted successfully');
          await fetchAllUsers();
        } else {
          setMessage(result.message || 'Failed to delete user');
        }
      } catch (error) {
        setMessage('Error deleting user');
      } finally {
        setLoading(false);
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const handleUpdateUser = (user) => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  const handleSaveUser = async (userData) => {
    try {
      setLoading(true);
      const result = await adminService.updateUser(selectedUser._id, userData);
      if (result.success) {
        setMessage('User updated successfully');
        setShowUpdateModal(false);
        setSelectedUser(null);
        await fetchAllUsers();
      } else {
        setMessage(result.message || 'Failed to update user');
      }
    } catch (error) {
      setMessage('Error updating user');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleApproveContent = (contentType, itemId) => {
    switch(contentType) {
      case 'interview':
        setInterviewExperiences(prev => prev.map(item => 
          item.id === itemId ? { ...item, status: 'approved' } : item
        ));
        break;
      case 'problem':
        setProblemSolutions(prev => prev.map(item => 
          item.id === itemId ? { ...item, status: 'approved' } : item
        ));
        break;
      case 'project':
        setProjectGuidelines(prev => prev.map(item => 
          item.id === itemId ? { ...item, status: 'approved' } : item
        ));
        break;
    }
  };

  const handleRejectContent = (contentType, itemId) => {
    switch(contentType) {
      case 'interview':
        setInterviewExperiences(prev => prev.map(item => 
          item.id === itemId ? { ...item, status: 'rejected' } : item
        ));
        break;
      case 'problem':
        setProblemSolutions(prev => prev.map(item => 
          item.id === itemId ? { ...item, status: 'rejected' } : item
        ));
        break;
      case 'project':
        setProjectGuidelines(prev => prev.map(item => 
          item.id === itemId ? { ...item, status: 'rejected' } : item
        ));
        break;
    }
  };

  const handleDeleteClick = (experience) => {
    setExperienceToDelete(experience);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!experienceToDelete) return;
    
    try {
      setLoading(true);
      const result = await adminService.deleteInterviewExperience(experienceToDelete._id);
      if (result.success) {
        setMessage('Interview experience deleted successfully');
        await fetchInterviewExperiences();
      } else {
        setMessage(result.message || 'Failed to delete interview experience');
      }
    } catch (error) {
      setMessage('Error deleting interview experience');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setExperienceToDelete(null);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setExperienceToDelete(null);
  };

  const handleProblemDeleteClick = (problem) => {
    setProblemToDelete(problem);
    setShowProblemDeleteModal(true);
  };

  const handleProblemDeleteConfirm = async () => {
    if (!problemToDelete) return;
    
    try {
      setLoading(true);
      const result = await adminService.deleteProblem(problemToDelete._id);
      if (result.success) {
        setMessage('Problem deleted successfully');
        await fetchProblems();
      } else {
        setMessage(result.message || 'Failed to delete problem');
      }
    } catch (error) {
      setMessage('Error deleting problem');
    } finally {
      setLoading(false);
      setShowProblemDeleteModal(false);
      setProblemToDelete(null);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleProblemDeleteCancel = () => {
    setShowProblemDeleteModal(false);
    setProblemToDelete(null);
  };

  const handleProjectDeleteClick = (project) => {
    setProjectToDelete(project);
    setShowProjectDeleteModal(true);
  };

  const handleProjectDeleteConfirm = async () => {
    if (!projectToDelete) return;
    
    try {
      setLoading(true);
      const result = await adminService.deleteProject(projectToDelete._id);
      if (result.success) {
        setMessage('Project deleted successfully');
        await fetchProjects();
      } else {
        setMessage(result.message || 'Failed to delete project');
      }
    } catch (error) {
      setMessage('Error deleting project');
    } finally {
      setLoading(false);
      setShowProjectDeleteModal(false);
      setProjectToDelete(null);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleProjectDeleteCancel = () => {
    setShowProjectDeleteModal(false);
    setProjectToDelete(null);
  };

  const fetchAcademicResources = async () => {
    try {
      const result = await adminService.getAcademicResources();
      if (result.success) {
        setAcademicResources(result.data);
      } else {
        setMessage('Failed to fetch academic resources');
      }
    } catch (error) {
      setMessage('Error fetching academic resources');
    }
  };

  const handleResourceDeleteClick = (resource) => {
    setResourceToDelete(resource);
    setShowResourceDeleteModal(true);
  };

  const handleResourceDeleteConfirm = async () => {
    if (!resourceToDelete) return;
    
    try {
      setLoading(true);
      const result = await adminService.deleteAcademicResource(
        resourceToDelete._id,
        resourceToDelete.resourceType,
        resourceToDelete.semesterId,
        resourceToDelete.subjectId
      );
      if (result.success) {
        setMessage('Academic resource deleted successfully');
        await fetchAcademicResources();
      } else {
        setMessage(result.message || 'Failed to delete academic resource');
      }
    } catch (error) {
      setMessage('Error deleting academic resource');
    } finally {
      setLoading(false);
      setShowResourceDeleteModal(false);
      setResourceToDelete(null);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleResourceDeleteCancel = () => {
    setShowResourceDeleteModal(false);
    setResourceToDelete(null);
  };

  const Sidebar = () => (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800" style={{fontFamily: 'Space Grotesk'}}>
          MCA Admin
        </h1>
        <p className="text-sm text-gray-600 mt-1">Resource Portal</p>
      </div>
      
      <nav className="mt-6">
        <div className="px-3">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'approvals', label: 'Senior Approvals', icon: Users },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'interviews', label: 'Interview Experiences', icon: BookOpen },
            { id: 'problems', label: 'Problem Solving', icon: Brain },
            { id: 'projects', label: 'Project Guidelines', icon: FolderOpen },
            { id: 'academics', label: 'Academic Resources', icon: FileText }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg mb-1 transition-all ${
                  activeTab === item.id 
                    ? 'bg-gradient-to-r from-[#ECFAE5] to-[#DDF6D2] text-green-800 border-l-4 border-green-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={{fontFamily: 'Space Grotesk'}}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600" style={{fontFamily: 'Space Grotesk'}}>{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2" style={{fontFamily: 'Instrument Serif'}}>{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900" style={{fontFamily: 'Instrument Serif'}}>Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={users.length} 
          icon={Users} 
          color="bg-blue-500"
          trend={12}
        />
        <StatCard 
          title="Pending Approvals" 
          value={pendingSeniors.length} 
          icon={AlertTriangle} 
          color="bg-orange-500"
        />
        <StatCard 
          title="Interview Experiences" 
          value={interviewExperiences.length} 
          icon={BookOpen} 
          color="bg-green-500"
          trend={8}
        />
        <StatCard 
          title="Problems" 
          value={problems.length} 
          icon={Brain} 
          color="bg-purple-500"
        />
        <StatCard 
          title="Projects" 
          value={projects.length} 
          icon={FolderOpen} 
          color="bg-orange-500"
        />
        <StatCard 
          title="Academic Resources" 
          value={academicResources.length} 
          icon={FileText} 
          color="bg-indigo-500"
        />
        <StatCard 
          title="Active Seniors" 
          value={allUsers.filter(u => u.role === 'senior' && u.isApproved === true).length} 
          icon={Star} 
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{fontFamily: 'Space Grotesk'}}>Recent Submissions</h3>
          <div className="space-y-3">
            {[...interviewExperiences, ...problemSolutions, ...projectGuidelines]
              .filter(item => item.status === 'pending')
              .slice(0, 5)
              .map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600">by {item.author}</p>
                </div>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div> */}

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{fontFamily: 'Space Grotesk'}}>User Activity</h3>
          <div className="space-y-3">
            {users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'senior' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const UserManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900" style={{fontFamily: 'Instrument Serif'}}>User Management</h1>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('successfully') 
            ? 'bg-green-50 border border-green-200 text-green-600' 
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Join Date</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'senior' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isApproved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isApproved ? 'Active' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleUpdateUser(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Update User"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <UpdateUserModal
        user={selectedUser}
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setSelectedUser(null);
        }}
        onSave={handleSaveUser}
      />
    </div>
  );

  const ContentTable = ({ data, type, onApprove, onReject }) => (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Title</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Author</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Date</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{item.title}</div>
                  {item.category && <div className="text-sm text-gray-600">{item.category}</div>}
                  {item.company && <div className="text-sm text-gray-600">{item.company}</div>}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.author}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    item.status === 'approved' ? 'bg-green-100 text-green-800' :
                    item.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.submittedDate}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                    {item.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => onApprove(type, item.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onReject(type, item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const InterviewExperiences = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900" style={{fontFamily: 'Instrument Serif'}}>Interview Experiences</h1>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('successfully') 
            ? 'bg-green-50 border border-green-200 text-green-600' 
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600" style={{fontFamily: 'Instrument Serif'}}>
            {interviewExperiences.length}
          </div>
          <div className="text-sm text-gray-600">Total Experiences</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600" style={{fontFamily: 'Instrument Serif'}}>
            {interviewExperiences.filter(exp => exp.company && exp.company !== 'Not specified').length}
          </div>
          <div className="text-sm text-gray-600">With Company Info</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-purple-600" style={{fontFamily: 'Instrument Serif'}}>
            {new Set(interviewExperiences.map(exp => exp.domain)).size}
          </div>
          <div className="text-sm text-gray-600">Unique Domains</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        {interviewExperiences.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No interview experiences found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Senior Details</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Company</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Domain</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Technologies</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Date</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {interviewExperiences.map((experience) => (
                  <tr key={experience._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{experience.name}</div>
                        <div className="text-xs text-gray-500">
                          <a href={experience.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mr-2">
                            LinkedIn
                          </a>
                          <a href={experience.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:underline">
                            GitHub
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        experience.company === 'Not specified' 
                          ? 'bg-gray-100 text-gray-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {experience.company}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        {experience.domain}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate" title={experience.technologies}>
                        {experience.technologies}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(experience.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleDeleteClick(experience)}
                          disabled={loading}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete Experience"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const ProblemSolving = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900" style={{fontFamily: 'Instrument Serif'}}>Problem Solving Resources</h1>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('successfully') 
            ? 'bg-green-50 border border-green-200 text-green-600' 
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600" style={{fontFamily: 'Instrument Serif'}}>
            {problems.length}
          </div>
          <div className="text-sm text-gray-600">Total Problems</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600" style={{fontFamily: 'Instrument Serif'}}>
            {problems.filter(p => p.difficulty === 'Easy').length}
          </div>
          <div className="text-sm text-gray-600">Easy Problems</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-red-600" style={{fontFamily: 'Instrument Serif'}}>
            {problems.filter(p => p.difficulty === 'Hard').length}
          </div>
          <div className="text-sm text-gray-600">Hard Problems</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        {problems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No problems found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Difficulty</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Sub Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Date</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {problems.map((problem) => (
                  <tr key={problem._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{problem.title}</div>
                      <div className="text-xs text-gray-500 max-w-xs truncate" title={problem.description}>
                        {problem.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {problem.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{problem.subCategory}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(problem.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleProblemDeleteClick(problem)}
                          disabled={loading}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete Problem"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const ProjectGuidelines = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900" style={{fontFamily: 'Instrument Serif'}}>Project Guidelines</h1>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('successfully') 
            ? 'bg-green-50 border border-green-200 text-green-600' 
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600" style={{fontFamily: 'Instrument Serif'}}>
            {projects.length}
          </div>
          <div className="text-sm text-gray-600">Total Projects</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600" style={{fontFamily: 'Instrument Serif'}}>
            {projects.filter(p => p.deployedLink).length}
          </div>
          <div className="text-sm text-gray-600">With Deployed Link</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-purple-600" style={{fontFamily: 'Instrument Serif'}}>
            {new Set(projects.map(p => p.domain)).size}
          </div>
          <div className="text-sm text-gray-600">Unique Domains</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        {projects.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No projects found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Project Details</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Senior</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Domain</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Links</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Date</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{project.name}</div>
                        <div className="text-xs text-gray-500 max-w-xs truncate" title={project.description}>
                          {project.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{project.seniorName}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        {project.domain}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">GitHub</span>
                        </a>
                        {project.deployedLink && (
                          <a href={project.deployedLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                            <span className="text-xs bg-blue-100 px-2 py-1 rounded">Live</span>
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleProjectDeleteClick(project)}
                          disabled={loading}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const SeniorApprovals = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900" style={{fontFamily: 'Instrument Serif'}}>Senior Approvals</h1>
        <button 
          onClick={fetchPendingSeniors}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : null}
          Refresh
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('successfully') || message.includes('approved') 
            ? 'bg-green-50 border border-green-200 text-green-600' 
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-orange-600" style={{fontFamily: 'Instrument Serif'}}>
            {pendingSeniors.length}
          </div>
          <div className="text-sm text-gray-600">Pending Approvals</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600" style={{fontFamily: 'Instrument Serif'}}>
            {allUsers.filter(u => u.role === 'senior' && u.isApproved === true).length}
          </div>
          <div className="text-sm text-gray-600">Approved Seniors</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600" style={{fontFamily: 'Instrument Serif'}}>
            {allUsers.filter(u => u.role === 'student').length}
          </div>
          <div className="text-sm text-gray-600">Total Students</div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200">
          {pendingSeniors.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No pending senior approvals
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>User Details</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Registration Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pendingSeniors.map((senior) => (
                    <tr key={senior._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {senior.firstName} {senior.lastName}
                          </div>
                          <div className="text-sm text-gray-600">{senior.email}</div>
                          {senior.phoneNumber && (
                            <div className="text-xs text-gray-500">{senior.phoneNumber}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(senior.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                          ⏳ Pending Approval
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => handleApproveSenior(senior._id)}
                            disabled={loading}
                            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-all duration-200"
                            title="✅ Approve Senior - User will be able to login immediately"
                          >
                            {loading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                            <span>Approve</span>
                          </button>
                          <button 
                            onClick={() => handleRejectSenior(senior._id)}
                            disabled={loading}
                            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-all duration-200"
                            title="🗑️ Reject Senior - User data will be permanently deleted"
                          >
                            {loading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const AcademicResources = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900" style={{fontFamily: 'Instrument Serif'}}>Academic Resources</h1>
        <Link to={"resources"} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" aria-label="Upload Resource">
          <Upload className="w-4 h-4 mr-2" />
          Upload Resource
        </Link>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('successfully') 
            ? 'bg-green-50 border border-green-200 text-green-600' 
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600" style={{fontFamily: 'Instrument Serif'}}>
            {academicResources.length}
          </div>
          <div className="text-sm text-gray-600">Total Resources</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600" style={{fontFamily: 'Instrument Serif'}}>
            {academicResources.filter(r => r.type === 'Material').length}
          </div>
          <div className="text-sm text-gray-600">Study Materials</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-purple-600" style={{fontFamily: 'Instrument Serif'}}>
            {academicResources.filter(r => r.type === 'Question Paper').length}
          </div>
          <div className="text-sm text-gray-600">Question Papers</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        {academicResources.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No academic resources found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Resource</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Semester</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Subject</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Uploaded By</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Date</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {academicResources.map((resource) => (
                  <tr key={resource._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{resource.name}</div>
                      {resource.marks && (
                        <div className="text-xs text-gray-500">Marks: {resource.marks}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        resource.type === 'Question Paper' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {resource.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{resource.semester}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{resource.subject}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{resource.uploadedBy || 'Unknown'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(resource.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Download">
                          <Download className="w-4 h-4" />
                        </a>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleResourceDeleteClick(resource)}
                          disabled={loading}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete Resource"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const DeleteConfirmModal = () => (
    showDeleteModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>
              Delete Interview Experience
            </h3>
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete <strong>{experienceToDelete?.name}'s</strong> interview experience? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleDeleteCancel}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    )
  );

  const ProblemDeleteModal = () => (
    showProblemDeleteModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>
              Delete Problem
            </h3>
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the problem <strong>"{problemToDelete?.title}"</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleProblemDeleteCancel}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleProblemDeleteConfirm}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    )
  );

  const ProjectDeleteModal = () => (
    showProjectDeleteModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>
              Delete Project
            </h3>
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the project <strong>"{projectToDelete?.name}"</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleProjectDeleteCancel}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleProjectDeleteConfirm}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    )
  );

  const ResourceDeleteModal = () => (
    showResourceDeleteModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900" style={{fontFamily: 'Space Grotesk'}}>
              Delete Academic Resource
            </h3>
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the resource <strong>"{resourceToDelete?.name}"</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleResourceDeleteCancel}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleResourceDeleteConfirm}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    )
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'approvals':
        return <SeniorApprovals />;
      case 'users':
        return <UserManagement />;
      case 'interviews':
        return <InterviewExperiences />;
      case 'problems':
        return <ProblemSolving />;
      case 'projects':
        return <ProjectGuidelines />;
      case 'academics':
        return <AcademicResources />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen" style={{
      backgroundColor: '#ECFAE5',
      fontFamily: 'Space Grotesk'
    }}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
      <DeleteConfirmModal />
      <ProblemDeleteModal />
      <ProjectDeleteModal />
      <ResourceDeleteModal />
    </div>
  )};

export default AdminPanel;