import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Delete file from S3 bucket
 * @param {string} fileUrl - The S3 file URL
 * @returns {Promise<boolean>} - Success status
 */
export const deleteFileFromS3 = async (fileUrl) => {
  try {
    // Extract the key from the S3 URL
    const key = extractS3Key(fileUrl);
    
    if (!key) {
      throw new Error("Invalid S3 URL format");
    }

    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    };

    await s3.send(new DeleteObjectCommand(deleteParams));
    console.log(`✅ Successfully deleted file from S3: ${key}`);
    return true;
  } catch (error) {
    console.error(`❌ Error deleting file from S3:`, error);
    throw error;
  }
};

/**
 * Extract S3 key from URL
 * @param {string} url - S3 file URL
 * @returns {string|null} - Extracted key or null
 */
const extractS3Key = (url) => {
  try {
    console.log('Extracting S3 key from URL:', url);
    
    // Handle different S3 URL formats
    if (url.includes('.s3.') && url.includes('.amazonaws.com')) {
      // Format: https://bucket.s3.region.amazonaws.com/key
      const urlParts = url.split('/');
      const key = urlParts.slice(3).join('/');
      console.log('Extracted key (format 1):', key);
      return key;
    } else if (url.includes('s3.amazonaws.com')) {
      // Format: https://s3.amazonaws.com/bucket/key
      const urlParts = url.split('/');
      const key = urlParts.slice(4).join('/');
      console.log('Extracted key (format 2):', key);
      return key;
    } else if (url.includes('.amazonaws.com')) {
      // Generic amazonaws.com format
      const urlParts = url.split('/');
      const key = urlParts.slice(3).join('/');
      console.log('Extracted key (format 3):', key);
      return key;
    }
    
    console.log('No matching S3 URL format found');
    return null;
  } catch (error) {
    console.error('Error extracting S3 key:', error);
    return null;
  }
};