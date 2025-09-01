# File Delete API Endpoints

This document describes the new delete endpoints that remove files from both MongoDB and S3.

## Admin Delete Routes

### 1. Delete Study Material
```
DELETE /api/admin/delete/materials/:semId/:subjectId/:fileId
```

**Example:**
```bash
curl -X DELETE http://localhost:5002/api/admin/delete/materials/1/507f1f77bcf86cd799439011/507f1f77bcf86cd799439012
```

### 2. Delete Question Paper
```
DELETE /api/admin/delete/questionPapers/:semId/:subjectId/:fileId
```

**Example:**
```bash
curl -X DELETE http://localhost:5002/api/admin/delete/questionPapers/1/507f1f77bcf86cd799439011/507f1f77bcf86cd799439012
```

### 3. Delete Senior Roadmap (with Resume)
```
DELETE /api/admin/delete/roadmaps/:id
```

**Example:**
```bash
curl -X DELETE http://localhost:5002/api/admin/delete/roadmaps/507f1f77bcf86cd799439011
```

## Individual Route Endpoints

### Delete Material (via upload routes)
```
DELETE /api/upload/:semId/:subjectId/materials/:fileId
```

### Delete Question Paper (via upload routes)
```
DELETE /api/upload/:semId/:subjectId/questionPapers/:fileId
```

### Delete Senior Roadmap (via roadmap routes)
```
DELETE /api/roadmaps/:id
```

## Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "File deleted successfully from both S3 and database",
  "deletedFile": "filename.pdf"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Delete failed",
  "error": "Error details"
}
```

## Implementation Details

1. **S3 Deletion**: Files are first deleted from AWS S3 using the `deleteFileFromS3` utility
2. **MongoDB Deletion**: After successful S3 deletion, the metadata is removed from MongoDB
3. **Error Handling**: If S3 deletion fails, the MongoDB document remains intact
4. **URL Parsing**: The system automatically extracts S3 keys from stored URLs

## Required Environment Variables

Make sure these are set in your `.env` file:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_S3_BUCKET`