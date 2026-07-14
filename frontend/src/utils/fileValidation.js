// File validation utilities
export const FILE_TYPES = {
  PDF: 'application/pdf',
  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  JPG: 'image/jpeg',
  JPEG: 'image/jpeg',
  PNG: 'image/png',
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES_COUNT = 5;

export const validateFile = (file) => {
  const errors = [];

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File "${file.name}" exceeds maximum size of 10MB`);
  }

  // Check file type
  const allowedTypes = Object.values(FILE_TYPES);
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File "${file.name}" has unsupported format. Allowed: PDF, DOC, DOCX, JPG, PNG`);
  }

  return errors;
};

export const validateFiles = (files) => {
  const errors = [];

  // Check files count
  if (files.length > MAX_FILES_COUNT) {
    errors.push(`Maximum ${MAX_FILES_COUNT} files allowed`);
  }

  // Validate each file
  files.forEach(file => {
    const fileErrors = validateFile(file);
    errors.push(...fileErrors);
  });

  return errors;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};