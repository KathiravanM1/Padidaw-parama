import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Briefcase, Lightbulb, FileText, Upload } from 'lucide-react';
import axios from 'axios';

const TYPES = [
  { value: 'job_offer',     label: 'Job Offer',      icon: Briefcase, desc: 'Share a job opening or referral' },
  { value: 'placement_tip', label: 'Placement Tip',  icon: Lightbulb, desc: 'Share interview tips & advice' },
  { value: 'document',      label: 'Document',        icon: FileText,  desc: 'Upload placement docs, resumes, etc.' },
];

export default function CreateAlumniPost() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [type, setType] = useState('job_offer');
  const [form, setForm] = useState({ title: '', content: '', company: '', role: '', package: '', location: '', applyLink: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('type', type);
      Object.entries(form).forEach(([k, v]) => v && formData.append(k, v));
      if (file) formData.append('file', file);

      await axios.post(`${import.meta.env.VITE_API_URL}/alumni`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      navigate('/alumni');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post.');
    }
    setLoading(false);
  };

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 font-serif mb-6">Create New Post</h1>

      {/* Type Selector */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {TYPES.map(({ value, label, icon: Icon, desc }) => (
          <button
            key={value}
            type="button"
            onClick={() => setType(value)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              type === value ? 'border-amber-500 bg-amber-50' : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <Icon className={`w-5 h-5 mb-2 ${type === value ? 'text-amber-600' : 'text-gray-400'}`} />
            <p className={`text-sm font-semibold ${type === value ? 'text-amber-700' : 'text-gray-700'}`}>{label}</p>
            <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">{desc}</p>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input name="title" value={form.title} onChange={handleChange} required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
            placeholder="e.g. Software Engineer at TCS" />
        </div>

        {type === 'job_offer' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input name="company" value={form.company} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                  placeholder="e.g. TCS" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input name="role" value={form.role} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                  placeholder="e.g. Software Engineer" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package</label>
                <input name="package" value={form.package} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                  placeholder="e.g. 6 LPA" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input name="location" value={form.location} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                  placeholder="e.g. Chennai" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apply Link</label>
              <input name="applyLink" value={form.applyLink} onChange={handleChange} type="url"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                placeholder="https://..." />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {type === 'placement_tip' ? 'Your Tip / Advice *' : 'Description'}
          </label>
          <textarea name="content" value={form.content} onChange={handleChange}
            rows={4}
            required={type === 'placement_tip'}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm resize-none"
            placeholder={type === 'placement_tip' ? 'Share your placement experience and tips...' : 'Additional details...'} />
        </div>

        {type === 'document' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Document</label>
            <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-400 transition-colors">
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500">{file ? file.name : 'Click to upload PDF, DOC, etc.'}</span>
              <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])}
                accept=".pdf,.doc,.docx,.ppt,.pptx" />
            </label>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-medium py-2.5 rounded-lg transition-colors text-sm">
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
          <button type="button" onClick={() => navigate('/alumni')}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg transition-colors text-sm">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
