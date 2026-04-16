import mongoose from 'mongoose';

/**
 * Handle book cover image upload via GridFS
 * Expects multipart/form-data with 'coverImage' file field
 */
export const uploadBookCover = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Return file information including the GridFS file ID
    const fileInfo = {
      filename: req.file.filename,
      fileId: req.file.id, // GridFS file ID
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date(),
      url: `/api/uploads/image/${req.file.id}` // URL to retrieve the image
    };

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: fileInfo
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to upload file'
    });
  }
};

/**
 * Retrieve book cover image from GridFS
 * URL format: /api/uploads/image/:fileId
 */
export const getBookCover = async (req, res) => {
  try {
    const fileId = req.params.fileId;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file ID'
      });
    }

    // Get MongoDB connection and GridFSBucket
    const db = mongoose.connection.db;
    const { GridFSBucket } = require('mongodb');
    const gridFSBucket = new GridFSBucket(db, { bucketName: 'bookCovers' });

    // Check if file exists
    const files = await db
      .collection('bookCovers.files')
      .findOne({ _id: new mongoose.Types.ObjectId(fileId) });

    if (!files) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    // Set response headers
    res.set('Content-Type', files.metadata?.mimeType || 'application/octet-stream');
    res.set('Content-Length', files.length);

    // Create download stream and pipe to response
    const downloadStream = gridFSBucket.openDownloadStream(
      new mongoose.Types.ObjectId(fileId)
    );

    downloadStream.pipe(res);

    downloadStream.on('error', (error) => {
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: 'Failed to download file'
        });
      }
    });
  } catch (error) {
    console.error('Error retrieving file:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to retrieve file'
      });
    }
  }
};

/**
 * Delete book cover image from GridFS
 */
export const deleteBookCover = async (req, res) => {
  try {
    const fileId = req.params.fileId;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file ID'
      });
    }

    const db = mongoose.connection.db;
    const { GridFSBucket } = require('mongodb');
    const gridFSBucket = new GridFSBucket(db, { bucketName: 'bookCovers' });

    // Delete file from GridFS
    await gridFSBucket.delete(new mongoose.Types.ObjectId(fileId));

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete file'
    });
  }
};
