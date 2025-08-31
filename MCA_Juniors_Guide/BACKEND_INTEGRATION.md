# Backend Integration Guide

## Overview
This document outlines the integration between the MCA Juniors Guide frontend and your S3/MongoDB backend.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install axios
```

### 2. Environment Configuration
Update your `.env` file with your backend URL:
```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_MAX_FILE_SIZE=10485760
REACT_APP_MAX_FILES_COUNT=5
```

### 3. Backend API Endpoints Expected

Your backend should implement these endpoints:

#### POST /api/upload
- **Purpose**: Upload files to S3 and store metadata in MongoDB
- **Content-Type**: multipart/form-data
- **Body**:
  ```
  files: File[] (multiple files)
  semester: string
  subject: string
  subjectCode: string
  type: string ('question-paper' | 'notes')
  assessmentType?: string (for question papers)
  assessmentCode?: string (for question papers)
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Files uploaded successfully",
    "files": [
      {
        "id": "file_id",
        "filename": "original_filename.pdf",
        "s3Key": "s3_object_key",
        "url": "s3_public_url",
        "size": 1024000,
        "uploadedAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
  ```

#### GET /api/files
- **Purpose**: Retrieve files with optional filters
- **Query Parameters**:
  - semester?: string
  - subject?: string
  - type?: string
  - assessmentType?: string
- **Response**:
  ```json
  {
    "success": true,
    "files": [...],
    "total": 10,
    "page": 1,
    "limit": 20
  }
  ```

#### DELETE /api/files/:id
- **Purpose**: Delete file from S3 and remove metadata from MongoDB
- **Response**:
  ```json
  {
    "success": true,
    "message": "File deleted successfully"
  }
  ```

#### GET /api/health
- **Purpose**: Health check endpoint
- **Response**:
  ```json
  {
    "status": "ok",
    "timestamp": "2024-01-01T00:00:00Z"
  }
  ```

## Features Implemented

### 1. File Upload with Progress Tracking
- Real-time upload progress display
- Multiple file selection support
- Drag and drop functionality

### 2. File Validation
- File type validation (PDF, DOC, DOCX, JPG, PNG)
- File size validation (max 10MB per file)
- Maximum file count validation (5 files)

### 3. Error Handling
- Network error handling
- Validation error display
- Backend error message display
- Connection status monitoring

### 4. User Experience
- Loading states during upload
- Success/error notifications
- Progress bars for uploads
- Form reset after successful upload

### 5. Security Features
- JWT token authentication (if implemented)
- Request/response interceptors
- Automatic token refresh handling

## File Structure
```
src/
├── services/
│   └── api.js              # Axios configuration and API calls
├── utils/
│   └── fileValidation.js   # File validation utilities
├── hooks/
│   └── useUpload.js        # Custom upload hook
└── pages/
    └── AdminResources.jsx  # Updated upload component
```

## Usage Example

The AdminResources component now automatically:
1. Validates files before upload
2. Shows real-time progress
3. Handles errors gracefully
4. Displays connection status
5. Resets form after successful upload

## Error Handling

The integration includes comprehensive error handling for:
- Network connectivity issues
- File validation errors
- Backend server errors
- Authentication failures
- Upload timeouts

## Best Practices Implemented

1. **Separation of Concerns**: API logic separated from UI components
2. **Error Boundaries**: Comprehensive error handling at multiple levels
3. **Loading States**: Clear feedback during async operations
4. **Validation**: Client-side validation before server requests
5. **Progress Tracking**: Real-time upload progress feedback
6. **Security**: Token-based authentication with automatic refresh
7. **Performance**: Optimized file handling and validation

## Next Steps

1. Implement your backend endpoints according to the specifications above
2. Test the integration with your S3 and MongoDB setup
3. Configure CORS settings on your backend for the frontend domain
4. Set up proper authentication if not already implemented
5. Consider implementing file compression for large uploads
6. Add file preview functionality if needed

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Ensure your backend allows requests from your frontend domain
2. **File Size Limits**: Check both frontend and backend file size limits
3. **Authentication**: Verify JWT token handling on both ends
4. **Network Timeouts**: Adjust timeout settings for large file uploads