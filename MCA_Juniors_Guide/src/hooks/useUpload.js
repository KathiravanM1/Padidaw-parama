import { useState, useCallback } from 'react';
import { uploadService } from '../services/api';
import { validateFiles } from '../utils/fileValidation';

export const useUpload = () => {
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFiles = useCallback(async (files, metadata) => {
    // Validate files
    const validationErrors = validateFiles(files);
    if (validationErrors.length > 0) {
      setUploadStatus({ 
        type: 'error', 
        message: validationErrors.join(', ') 
      });
      return { success: false, errors: validationErrors };
    }

    setIsUploading(true);
    setUploadStatus({ type: 'uploading', message: 'Uploading files...', progress: 0 });
    
    try {
      const result = await uploadService.uploadFiles(
        files, 
        metadata, 
        (progress) => {
          setUploadStatus({ 
            type: 'uploading', 
            message: `Uploading files... ${progress}%`,
            progress 
          });
        }
      );

      const successMessage = metadata.type === 'question-paper' 
        ? `Successfully uploaded ${files.length} file(s) for ${metadata.subject} - ${metadata.semester} - ${metadata.assessmentType}`
        : `Successfully uploaded ${files.length} file(s) for ${metadata.subject} - ${metadata.semester}`;
      
      setUploadStatus({ 
        type: 'success', 
        message: successMessage,
        uploadedFiles: result.files
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setUploadStatus(null);
      }, 5000);
      
      return { success: true, data: result };
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({ 
        type: 'error', 
        message: error.message || 'Upload failed. Please try again.' 
      });
      return { success: false, error: error.message };
    } finally {
      setIsUploading(false);
    }
  }, []);

  const clearStatus = useCallback(() => {
    setUploadStatus(null);
  }, []);

  return {
    uploadFiles,
    uploadStatus,
    isUploading,
    clearStatus
  };
};