import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Resources = () => {
  const [semesters, setSemesters] = useState([]);
  const [activeSemester, setActiveSemester] = useState(1);
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL;


  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      const response = await axios.get(API_BASE_URL+'/semesters');
      setSemesters(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  const toggleSubject = (subjectKey) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subjectKey]: !prev[subjectKey]
    }));
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'pptx': return '📊';
      case 'docx': return '📝';
      default: return '📄';
    }
  };


  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <button 
            onClick={fetchSemesters}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentSemester = semesters.find(sem => sem.semId === activeSemester);

  return (
    <div className="min-h-screen bg-gradient-to-b from-#DDF6D2 to-white ">
            <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@500&family=Space+Grotesk:wght@400;500;700&display=swap');
          body { font-family: 'Space Grotesk', sans-serif; }
          .font-serif { font-family: 'Instrument Serif', serif; }
          .font-space { font-family: 'Space Grotesk', sans-serif; }
          .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-xl border border-gray-200 font-serif">
          <div className="flex items-center gap-4 mb-4 flex-wrap justify-center lg:justify-start">
            <div className="p-3 bg-green-100 rounded-2xl">
              <span className="text-4xl">🎓</span>
            </div>
            <div>
              <h1 className=" text-4xl font-medium text-green-800 text-center lg:text-start">Academic Resources</h1>
              <p className="text-gray-600 mt-2 text-lg">Study materials and question papers</p>
            </div>
          </div>
        </div>

        {/* Semester Navigation */}
        <div className="flex flex-wrap gap-4 mb-8 font-mono">
          {semesters.map((semester) => (
            <button
              key={semester.semId}
              onClick={() => setActiveSemester(semester.semId)}
              className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg ${
                activeSemester === semester.semId
                  ? 'bg-green-800 text-white shadow-green-200'
                  : 'bg-white text-gray-700 hover:bg-green-50 hover:shadow-xl'
              }`}
            >
              {semester.name}
            </button>
          ))}
        </div>

        {/* Subjects Grid */}
        {currentSemester && (
          <div className="grid gap-6">
            {currentSemester.subjects.map((subject) => (
              <div key={subject.id} className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                {/* Subject Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 font-space"
                  onClick={() => toggleSubject(`${activeSemester}-${subject.id}`)}
                >
                  <div className="flex items-center justify-between flex-wrap gap-5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-xl">
                        <span className="text-2xl">📚</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{subject.name}</h3>
                        <p className="text-green-600 font-medium">{subject.code}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-500">
                        <span className="bg-gray-100 px-3 py-1 rounded-full">
                          {subject.materials.length} Materials
                        </span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full ml-2">
                          {subject.questionPapers.length} Papers
                        </span>
                      </div>
                      <span className="text-xl">
                        {expandedSubjects[`${activeSemester}-${subject.id}`] ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedSubjects[`${activeSemester}-${subject.id}`] && (
                  <div className="p-6">
                    <div className="grid lg:grid-cols-2 gap-8">
                      {/* Study Materials */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xl">📄</span>
                          <h4 className="text-lg font-semibold text-gray-800">Study Materials</h4>
                        </div>
                        <div className="space-y-3">
                          {subject.materials.length > 0 ? (
                            subject.materials.map((material, index) => (
                              <div key={index} className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <span className="text-2xl">{getFileIcon(material.type)}</span>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-gray-800 truncate">{material.name}</p>
                                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                        <span>{formatDate(material.date)}</span>
                                        {material.uploadedBy && <span>by {material.uploadedBy}</span>}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 ml-4">
                                
                                    <a
                                      href={material.url}
                                      download
                                      className="p-2 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-colors"
                                    >
                                      <span className="text-sm">⬇</span>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-center py-4">No materials available</p>
                          )}
                        </div>
                      </div>

                      {/* Question Papers */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xl">📋</span>
                          <h4 className="text-lg font-semibold text-gray-800">Question Papers</h4>
                        </div>
                        <div className="space-y-3">
                          {subject.questionPapers.length > 0 ? (
                            subject.questionPapers.map((paper, index) => (
                              <div key={index} className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <span className="text-2xl">📋</span>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-gray-800 truncate">{paper.name}</p>
                                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                        <span>{formatDate(paper.date)}</span>
                                        {paper.marks && <span>{paper.marks} marks</span>}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 ml-4">
                        
                                    <a
                                      href={paper.url}
                                      download
                                      className="p-2 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-colors"
                                    >
                                      <span className="text-sm">⬇</span>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-center py-4">No question papers available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!currentSemester && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">No data available for this semester</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;