import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Lightbulb, FileText, Trash2, Plus, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TYPE_CONFIG = {
  job_offer:      { label: 'Job Offer',       icon: Briefcase,  color: 'bg-blue-100 text-blue-700' },
  placement_tip:  { label: 'Placement Tip',   icon: Lightbulb,  color: 'bg-green-100 text-green-700' },
  document:       { label: 'Document',         icon: FileText,   color: 'bg-amber-100 text-amber-700' },
};

export default function AlumniDashboard() {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/alumni`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data.posts.filter(p => p.author?._id === user?._id || p.author === user?._id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/alumni/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter(p => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Welcome, {user?.firstName}!</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your posts and contributions</p>
        </div>
        <Link
          to="/alumni/post"
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {Object.entries(TYPE_CONFIG).map(([type, { label, icon: Icon, color }]) => (
          <div key={type} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className={`inline-flex p-2 rounded-lg ${color} mb-2`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{posts.filter(p => p.type === type).length}</p>
            <p className="text-xs text-gray-500">{label}s</p>
          </div>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Your Posts</h2>
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600" /></div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <Briefcase className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No posts yet. Share your experience!</p>
          </div>
        ) : (
          posts.map((post, i) => {
            const { icon: Icon, label, color } = TYPE_CONFIG[post.type] || {};
            return (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${color}`}>
                    {Icon && <Icon className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 truncate">{post.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>{label}</span>
                    </div>
                    {post.company && <p className="text-sm text-gray-500 mt-0.5">{post.company} {post.role && `· ${post.role}`} {post.package && `· ${post.package}`}</p>}
                    {post.content && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.content}</p>}
                    {post.fileUrl && (
                      <a href={post.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-amber-600 hover:underline mt-1">
                        <ExternalLink className="w-3 h-3" />{post.fileName || 'View Document'}
                      </a>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{new Date(post.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(post._id)} className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
