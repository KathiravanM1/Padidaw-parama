# Student CGPA API Endpoints

## Database Collection: `student_cgpa`

### Schema Structure
```javascript
{
  userId: ObjectId (ref: 'User', indexed),
  registrationNo: String (unique, required),
  name: String (required),
  semesters: [{
    semesterNumber: Number (1-8),
    courses: [{
      courseCode: String,
      courseName: String,
      credits: Number (0-10),
      grade: String (O, A+, A, B+, B, C, U),
      gradePoints: Number (0-10)
    }],
    gpa: Number (0-10)
  }],
  overallCGPA: Number (0-10),
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### 1. Create Student CGPA Data
**POST** `/api/students/cgpa`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "user_object_id",
  "registrationNo": "REG123456",
  "name": "Student Name",
  "semesters": [
    {
      "semesterNumber": 1,
      "courses": [
        {
          "courseCode": "CS101",
          "courseName": "Data Structures",
          "credits": 4,
          "grade": "A",
          "gradePoints": 8
        }
      ]
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "CGPA data created successfully",
  "data": {
    "_id": "document_id",
    "userId": "user_object_id",
    "registrationNo": "REG123456",
    "name": "Student Name",
    "semesters": [...],
    "overallCGPA": 8.5,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 2. Get Student CGPA Data
**GET** `/api/students/cgpa/:userId`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "document_id",
    "userId": "user_object_id",
    "registrationNo": "REG123456",
    "name": "Student Name",
    "semesters": [...],
    "overallCGPA": 8.5,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "No CGPA data found for this user"
}
```

### 3. Update Student CGPA Data
**PUT** `/api/students/cgpa/:userId`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:** (Same as POST)

**Response:**
```json
{
  "success": true,
  "message": "CGPA data updated successfully",
  "data": {
    "_id": "document_id",
    "userId": "user_object_id",
    "registrationNo": "REG123456",
    "name": "Student Name",
    "semesters": [...],
    "overallCGPA": 8.5,
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 4. Delete Student CGPA Data
**DELETE** `/api/students/cgpa/:userId`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "CGPA data deleted successfully"
}
```

## Backend Implementation Example (Node.js/Express/MongoDB)

```javascript
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Schema
const studentCGPASchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  registrationNo: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  semesters: [{
    semesterNumber: { type: Number, required: true, min: 1, max: 8 },
    courses: [{
      courseCode: { type: String, required: true, trim: true },
      courseName: { type: String, required: true, trim: true },
      credits: { type: Number, required: true, min: 0, max: 10 },
      grade: { type: String, required: true, enum: ['O', 'A+', 'A', 'B+', 'B', 'C', 'U'] },
      gradePoints: { type: Number, required: true, min: 0, max: 10 }
    }],
    gpa: { type: Number, min: 0, max: 10 }
  }],
  overallCGPA: { type: Number, min: 0, max: 10 }
}, { timestamps: true });

const StudentCGPA = mongoose.model('StudentCGPA', studentCGPASchema);

// Routes
router.post('/cgpa', async (req, res) => {
  try {
    const cgpaData = new StudentCGPA(req.body);
    await cgpaData.save();
    res.json({ success: true, message: 'CGPA data created successfully', data: cgpaData });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/cgpa/:userId', async (req, res) => {
  try {
    const cgpaData = await StudentCGPA.findOne({ userId: req.params.userId });
    if (!cgpaData) {
      return res.status(404).json({ success: false, message: 'No CGPA data found for this user' });
    }
    res.json({ success: true, data: cgpaData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/cgpa/:userId', async (req, res) => {
  try {
    const cgpaData = await StudentCGPA.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!cgpaData) {
      return res.status(404).json({ success: false, message: 'No CGPA data found for this user' });
    }
    res.json({ success: true, message: 'CGPA data updated successfully', data: cgpaData });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/cgpa/:userId', async (req, res) => {
  try {
    const cgpaData = await StudentCGPA.findOneAndDelete({ userId: req.params.userId });
    if (!cgpaData) {
      return res.status(404).json({ success: false, message: 'No CGPA data found for this user' });
    }
    res.json({ success: true, message: 'CGPA data deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
```

## Frontend Integration

The frontend automatically:
1. **Checks for existing data** when user logs in
2. **Creates new record** if no data exists
3. **Updates existing record** if data exists
4. **Falls back to local storage** if API is unavailable
5. **Shows user-specific data** based on authentication

## Security Features

1. **JWT Authentication** required for all endpoints
2. **User-specific data access** via userId validation
3. **Input validation** on all fields
4. **Unique registration numbers** to prevent duplicates
5. **Proper error handling** for unauthorized access