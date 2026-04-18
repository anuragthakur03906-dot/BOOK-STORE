import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

export const uploadBookCover = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const fileInfo = {
      filename: req.file.filename,
      fileId: req.file.id,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date(),
      url: `/api/uploads/image/${req.file.id}`
    };

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: fileInfo
    });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getBookCover = async (req, res) => {
  try {
    const fileId = req.params.fileId;

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file ID'
      });
    }

    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'bookCovers' });

    const file = await db
      .collection('bookCovers.files')
      .findOne({ _id: new mongoose.Types.ObjectId(fileId) });

    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    
    res.set('Content-Type', file.metadata?.mimeType || 'image/jpeg');
    res.set('Content-Length', file.length);
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');

    const stream = bucket.openDownloadStream(file._id);
    stream.pipe(res);

    stream.on('error', () => {
      if (!res.headersSent) {
        res.status(500).json({ success: false });
      }
    });

  } catch (error) {
    console.error('Fetch Image Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const deleteBookCover = async (req, res) => {
  try {
    const fileId = req.params.fileId;

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file ID'
      });
    }

    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'bookCovers' });

    await bucket.delete(new mongoose.Types.ObjectId(fileId));

    res.json({
      success: true,
      message: 'Deleted successfully'
    });

  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};