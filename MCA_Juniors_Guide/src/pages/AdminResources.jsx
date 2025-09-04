import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle, AlertCircle, X } from 'lucide-react';
import axios from 'axios';
import { getSemesters } from '../services/api';

const AdminResources = () => {
  const [formData, setFormData] = useState({
    semester: '',
    subjectCode: '',
    type: '',
    files: []
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', code: '', id: '' });

  // Fetch semesters on component mount
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const semesterData = await getSemesters();
        setSemesters(semesterData);
      } catch (error) {
        setStatus({ type: 'error', message: 'Failed to load semesters' });
      } finally {
        setLoading(false);
      }
    };
    fetchSemesters();
  }, []);

  // Update subjects when semester changes
  useEffect(() => {
    if (formData.semester) {
      const selectedSemester = semesters.find(sem => sem.semId.toString() === formData.semester);
      if (selectedSemester) {
        setSubjects(selectedSemester.subjects || []);
      }
    } else {
      setSubjects([]);
    }
    setFormData(prev => ({ ...prev, subjectCode: '' }));
    setShowAddSubject(false);
    setNewSubject({ name: '', code: '', id: '' });
  }, [formData.semester, semesters]);

  // Handles updates to semester, subject code, and resource type fields.
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear any previous error messages when the user starts typing again.
    if (status.type === 'error') setStatus({ type: '', message: '' });
  };

  // Handles file selection and validation.
  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    // Define a list of valid MIME types for accepted files.
    const validMimeTypes = [
      'application/pdf',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.ms-powerpoint', // .ppt
      'application/vnd.openxmlformats-officedocument.presentationml.presentation' // .pptx
    ];
    
    // Filter selected files to keep only valid ones (size and type).
    const validFiles = selectedFiles.filter(file => 
      file.size <= 10 * 1024 * 1024 && // Max 10MB file size
      validMimeTypes.includes(file.type)
    );
    
    // Alert the user if any files were rejected.
    if (validFiles.length !== selectedFiles.length) {
      setStatus({ type: 'error', message: 'Some files were rejected. Only PDF, DOC, DOCX, PPT, PPTX files under 10MB are allowed.' });
    }
    
    // Update the state with the valid files.
    setFormData(prev => ({ ...prev, files: [...prev.files, ...validFiles] }));
  };

  // Removes a file from the selected files list.
  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  // Validates if all required fields are filled before upload.
  const validateForm = () => {
    if (!formData.semester || !formData.subjectCode || !formData.type || formData.files.length === 0) {
      setStatus({ type: 'error', message: 'Please fill all fields and select at least one file.' });
      return false;
    }
    if (showAddSubject) {
      setStatus({ type: 'error', message: 'Please complete adding the new subject first.' });
      return false;
    }
    return true;
  };

  // Handle adding new subject
  const handleAddSubject = async () => {
    if (!newSubject.name || !newSubject.code || !newSubject.id) {
      setStatus({ type: 'error', message: 'Please fill all subject fields' });
      return;
    }

    try {
      const subjectData = {
        id: parseInt(newSubject.id),
        name: newSubject.name,
        code: newSubject.code,
        materials: [],
        questionPapers: []
      };


      // Refresh semesters to get updated data
      const updatedSemesters = await getSemesters();
      setSemesters(updatedSemesters);
      
      // Update subjects for current semester
      const selectedSemester = updatedSemesters.find(sem => sem.semId.toString() === formData.semester);
      if (selectedSemester) {
        setSubjects(selectedSemester.subjects || []);
      }

      setFormData(prev => ({ ...prev, subjectCode: newSubject.id }));
      setShowAddSubject(false);
      setNewSubject({ name: '', code: '', id: '' });
      setStatus({ type: 'success', message: 'Subject added successfully' });
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Failed to add subject' });
    }
  };

  // Get subject code from selected subject
  const getSelectedSubjectCode = () => {
    const selectedSubject = subjects.find(subject => subject.id.toString() === formData.subjectCode);
    return selectedSubject ? selectedSubject.id : formData.subjectCode;
  };

  // Main function to handle the file upload process.
/**
 * Handles the file upload process.
 * This function validates the form, sets loading states, constructs the appropriate API endpoint,
 * and uploads each selected file individually. It also handles success and error states.
 */
/**
 * Handles the file upload process.
 * This function validates the form, sets loading states, constructs the appropriate API endpoint,
 * and uploads each selected file individually. It also handles success and error states.
 */
const handleUpload = async () => {
  // 1. Validate the form before proceeding.
  if (!validateForm()) return;

  console.log(`Preparing to upload files for Semester ${formData.semester}, Subject ${formData.subjectCode}, Type: ${formData.type}`);

  // 2. Set UI state to indicate uploading is in progress.
  setIsUploading(true);
  setStatus({ type: 'uploading', message: 'Uploading files...' });

  try {
    // 3. Determine the correct API path based on the selected file type.
    // This matches the backend routes like '/:semId/:subjectId/materials'.
    const uploadType = formData.type === 'questionPaper' ? 'questionPapers' : 'materials';
    const uploadedFiles = [];

    // 4. Upload files one by one. Your backend is configured with `upload.single("file")`,
    // so it expects one file per request. This loop handles that perfectly.
    for (const file of formData.files) {
      const formDataToSend = new FormData();
      // The backend middleware `upload.single("file")` expects the field name to be 'file'.
      formDataToSend.append('file', file);

      console.log(`Uploading file: ${file.name} for Semester ${formData.semester}, Subject ${formData.subjectCode}, Type: ${uploadType}`);

      const apiUrl = `${import.meta.env.VITE_API_URL}/upload/${formData.semester}/${getSelectedSubjectCode()}/${uploadType}`;

      const response = await axios.post(apiUrl, formDataToSend);

      // Store details of the uploaded file from the server's response.
      uploadedFiles.push(response.data.file);
    }

    // 7. Set a success message in the UI.
    setStatus({
      type: 'success',
      message: `Successfully uploaded ${uploadedFiles.length} file(s) for Semester ${formData.semester}, Subject ${formData.subjectCode}`
    });

    // 8. Reset the form to its initial state for the next upload.
    setFormData({ semester: '', subjectCode: '', type: '', files: [] });

    // 9. Clear the success message after 5 seconds.
    setTimeout(() => setStatus({ type: '', message: '' }), 5000);

  } catch (error) {
    // 10. Handle any errors during the upload process.
    console.error("Upload failed:", error);
    setStatus({
      type: 'error',
      message: error.response?.data?.message || 'Upload failed. Please try again.'
    });
  } finally {
    // 11. Ensure the loading state is always reset, regardless of success or failure.
    setIsUploading(false);
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-b from-#DDF6D2 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Upload Academic Resources</h1>
          
          {/* Semester Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
            <select
              value={formData.semester}
              onChange={(e) => handleInputChange('semester', e.target.value)}
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select Semester</option>
              {semesters.map((semester) => (
                <option key={semester.semId} value={semester.semId}>
                  {semester.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <div className="space-y-3">
              <select
                value={formData.subjectCode}
                onChange={(e) => {
                  if (e.target.value === 'add-new') {
                    setShowAddSubject(true);
                    setFormData(prev => ({ ...prev, subjectCode: '' }));
                  } else {
                    handleInputChange('subjectCode', e.target.value);
                    setShowAddSubject(false);
                  }
                }}
                disabled={!formData.semester}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name} ({subject.code})
                  </option>
                ))}
                {formData.semester && (
                  <option value="add-new">+ Add New Subject</option>
                )}
              </select>

              {/* Add New Subject Form */}
              {showAddSubject && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Subject</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Subject Name"
                      value={newSubject.name}
                      onChange={(e) => setNewSubject(prev => ({ ...prev, name: e.target.value }))}
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Subject Code"
                      value={newSubject.code}
                      onChange={(e) => setNewSubject(prev => ({ ...prev, code: e.target.value }))}
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Subject ID"
                      value={newSubject.id}
                      onChange={(e) => setNewSubject(prev => ({ ...prev, id: e.target.value }))}
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleAddSubject}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    >
                      Add Subject
                    </button>
                    <button
                      onClick={() => {
                        setShowAddSubject(false);
                        setNewSubject({ name: '', code: '', id: '' });
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select type</option>
              <option value="materials">Materials</option>
              <option value="questionPaper">Question Paper</option>
            </select>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Files</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">Click to select files or drag and drop</p>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors"
              >
                Browse Files
              </label>
            </div>
          </div>

          {/* Selected Files */}
          {formData.files.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Selected Files:</h4>
              <div className="space-y-2">
                {formData.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Message */}
          {status.message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              status.type === 'success' ? 'bg-green-50 text-green-800' :
              status.type === 'error' ? 'bg-red-50 text-red-800' :
              'bg-blue-50 text-blue-800'
            }`}>
              {status.type === 'success' && <CheckCircle size={20} />}
              {status.type === 'error' && <AlertCircle size={20} />}
              {status.type === 'uploading' && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              )}
              <span>{status.message}</span>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={isUploading || !formData.semester || !formData.subjectCode || !formData.type || formData.files.length === 0}
            className="w-full py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isUploading ? 'Uploading...' : `Upload ${formData.files.length} File(s)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminResources;