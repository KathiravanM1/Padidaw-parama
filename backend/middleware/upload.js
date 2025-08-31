import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "../config/s3.js";
import dotenv from "dotenv";

dotenv.config();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    acl: "public-read", // so file is accessible via URL
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now()}_${file.originalname}`); // file path in S3
    },
  }),
});

export default upload;
