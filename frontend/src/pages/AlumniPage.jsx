import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Lightbulb, FileText, ExternalLink, Search, Linkedin, Github } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const TYPE_CONFIG = {
  job_offer:      { label: 'Job Offer',      icon: Briefcase, color: 'bg-blue-100 text-blue-700',   border: 'border-blue-200' },
  placement_tip:  { label: 'Placement Tip',  icon: Lightbulb, color: 'bg-green-100 text-green-700', border: 'border-green-200' },
  document:       { label: 'Document',        icon: FileText,  color: 'bg-amber-100 text-amber-700', border: 'border-amber-200' },
};

export default function AlumniPage() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/alumni`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(res.data.posts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [token]);

  const filtered = posts.filter(p => {
    const matchType = filter === 'all' || p.type === filter;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.company?.toLowerCase().includes(search.toLowerCase()) ||
      p.content?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-serif">Alumni Corner</h1>
        <p className="text-gray-500 mt-1">Job offers, placement tips and resources shared by our alumni</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[['all', 'All'], ['job_offer', 'Jobs'], ['placement_tip', 'Tips'], ['document', 'Docs']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === val ? 'bg-amber-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:border-amber-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-16 text-center shadow-sm border border-gray-100">
          <Briefcase className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No posts found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((post, i) => {
            const cfg = TYPE_CONFIG[post.type] || {};
            const Icon = cfg.icon;
            return (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`bg-white rounded-xl p-5 shadow-sm border ${cfg.border || 'border-gray-100'} flex flex-col gap-3`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${cfg.color}`}>
                      {Icon && <Icon className="w-4 h-4" />}
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">{post.title}</h3>
                  {post.company && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {post.company && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{post.company}</span>}
                      {post.role && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{post.role}</span>}
                      {post.package && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{post.package}</span>}
                      {post.location && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{post.location}</span>}
                    </div>
                  )}
                  {post.content && <p className="text-sm text-gray-600 mt-2 line-clamp-3">{post.content}</p>}
                </div>

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs text-gray-500 truncate">
                      By {post.author?.firstName} {post.author?.lastName}
                    </span>
                    {post.author?.linkedinUrl && (
                      <a href={post.author.linkedinUrl} target="_blank" rel="noreferrer"
                        title="Connect on LinkedIn"
                        className="flex-shrink-0 p-1 rounded text-blue-600 hover:bg-blue-50 transition-colors">
                        <Linkedin className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {post.author?.githubUrl && (
                      <a href={post.author.githubUrl} target="_blank" rel="noreferrer"
                        title="View GitHub"
                        className="flex-shrink-0 p-1 rounded text-gray-600 hover:bg-gray-100 transition-colors">
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {post.fileUrl && (
                      <a href={post.fileUrl} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium">
                        <FileText className="w-3 h-3" /> View Doc
                      </a>
                    )}
                    {post.applyLink && (
                      <a href={post.applyLink} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg font-medium transition-colors">
                        <ExternalLink className="w-3 h-3" /> Apply
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
