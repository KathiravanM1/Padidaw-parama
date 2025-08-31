# AWS S3 Setup for Resume Upload

## Prerequisites
1. AWS Account
2. AWS CLI installed (optional but recommended)

## Setup Steps

### 1. Create S3 Bucket
1. Go to AWS S3 Console
2. Click "Create bucket"
3. Choose a unique bucket name (e.g., `mca-guide-resumes`)
4. Select your preferred region (e.g., `us-east-1`)
5. Keep default settings for now
6. Click "Create bucket"

### 2. Configure Bucket Permissions
1. Go to your bucket → Permissions tab
2. Edit "Block public access" settings:
   - Uncheck "Block all public access"
   - Keep other settings as needed
3. Add bucket policy for public read access to uploaded files:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        }
    ]
}
```

### 3. Create IAM User
1. Go to AWS IAM Console
2. Click "Users" → "Add user"
3. Choose username (e.g., `mca-guide-s3-user`)
4. Select "Programmatic access"
5. Attach policy: `AmazonS3FullAccess` (or create custom policy)
6. Save the Access Key ID and Secret Access Key

### 4. Update Environment Variables
Add these to your `.env` file:

```env
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

### 5. Test Upload
Start your backend server and test the resume upload functionality through the frontend form.

## Security Notes
- Never commit your `.env` file to version control
- Use IAM roles in production instead of access keys
- Consider using signed URLs for more secure downloads
- Regularly rotate access keys