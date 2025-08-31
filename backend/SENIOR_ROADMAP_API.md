# Senior Roadmap API Documentation

## Base URL
`http://localhost:5002/api/roadmaps`

## Endpoints

### 1. Submit Roadmap (Public)
**POST** `/submit`

Submit a new senior roadmap experience with resume upload.

**Content-Type:** `multipart/form-data`

**Body:**
```
name: string (required)
company: string (optional)
linkedin: string (required) - Valid LinkedIn URL
github: string (required) - Valid GitHub URL  
domain: string (required) - One of: frontend, backend, fullstack, mobile, devops, data-science, machine-learning, cybersecurity, cloud, blockchain, game-dev, ui-ux, product-management, qa-testing, other
technologies: string (required)
preparation: string (required)
advice: string (optional)
resume: file (required) - PDF/DOC file, max 500KB
```

**Response:**
```json
{
  "success": true,
  "message": "Roadmap submitted successfully",
  "data": {
    "id": "roadmap_id",
    "name": "John Doe",
    "company": "Google",
    "domain": "frontend",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Get Approved Roadmaps (Public)
**GET** `/approved`

Get all approved roadmaps with pagination and filtering.

**Query Parameters:**
- `domain` (optional): Filter by domain (default: all)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "roadmap_id",
      "name": "John Doe",
      "company": "Google",
      "linkedin": "https://linkedin.com/in/johndoe",
      "github": "https://github.com/johndoe",
      "domain": "frontend",
      "technologies": "React, Node.js, MongoDB",
      "preparation": "Studied for 6 months...",
      "advice": "Focus on fundamentals...",
      "resumeFileName": "resume.pdf",
      "isApproved": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 3. Get Single Roadmap (Public)
**GET** `/approved/:id`

Get detailed view of a specific approved roadmap.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "roadmap_id",
    "name": "John Doe",
    "company": "Google",
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe",
    "domain": "frontend",
    "technologies": "React, Node.js, MongoDB",
    "preparation": "Studied for 6 months...",
    "advice": "Focus on fundamentals...",
    "resumeFileName": "resume.pdf",
    "isApproved": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Admin Endpoints (Require Authentication)

### 4. Get All Roadmaps (Admin)
**GET** `/admin/all`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): 'pending', 'approved', or all (default: all)
- `domain` (optional): Filter by domain
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

### 5. Update Roadmap Status (Admin)
**PUT** `/admin/:id/status`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "isApproved": true
}
```

### 6. Delete Roadmap (Admin)
**DELETE** `/admin/:id`

**Headers:** `Authorization: Bearer <token>`

## Error Responses

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error