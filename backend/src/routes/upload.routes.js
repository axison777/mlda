const express = require('express');
const router = express.Router();
const path = require('path');

const { uploadSingle, handleUploadError } = require('../middleware/upload');
const { authenticateToken, requireTeacher } = require('../middleware/auth');

// Upload course thumbnail
router.post('/thumbnail', 
  authenticateToken, 
  requireTeacher, 
  uploadSingle('thumbnail'),
  handleUploadError,
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/thumbnails/${req.file.filename}`;
    
    res.json({
      message: 'Thumbnail uploaded successfully',
      url: fileUrl,
      filename: req.file.filename
    });
  }
);

// Upload video
router.post('/video',
  authenticateToken,
  requireTeacher,
  uploadSingle('video'),
  handleUploadError,
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/videos/${req.file.filename}`;
    
    res.json({
      message: 'Video uploaded successfully',
      url: fileUrl,
      filename: req.file.filename
    });
  }
);

// Upload avatar
router.post('/avatar',
  authenticateToken,
  uploadSingle('avatar'),
  handleUploadError,
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/avatars/${req.file.filename}`;
    
    res.json({
      message: 'Avatar uploaded successfully',
      url: fileUrl,
      filename: req.file.filename
    });
  }
);

module.exports = router;