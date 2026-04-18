/**
 * @file multerConfig.js
 * @description Configures Multer middleware with GridFS storage for MongoDB.
 * Handles file uploads and stores them in GridFS buckets (bookCovers).
 * Files are stored with timestamp-prefixed names to ensure uniqueness.
 */

import multer from "multer";
import { GridFsStorage } from "@lenne.tech/multer-gridfs-storage";

/**
 * GridFS Storage Configuration
 * - Uses MongoDB GridFS to store large files (images, documents)
 * - Automatically manages chunks and file metadata
 * - Provides reliable file retrieval via ObjectId
 */
const storage = new GridFsStorage({
  url: process.env.MONGODB_URL, // MongoDB connection string
  file: (req, file) => {
    return {
      bucketName: "bookCovers",                    // GridFS bucket for book cover images
      filename: Date.now() + "-" + file.originalname // Unique filename with timestamp
    };
  }
});

/**
 * Multer upload middleware
 * Usage: app.post('/upload', upload.single('fieldName'), controller)
 */
const upload = multer({ storage });

export default upload;