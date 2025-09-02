const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subfolder = 'general';
    
    if (file.fieldname === 'thumbnail') subfolder = 'thumbnails';
    if (file.fieldname === 'video') subfolder = 'videos';
    if (file.fieldname === 'avatar') subfolder = 'avatars';
    
    const fullPath = path.join(uploadDir, subfolder);
    
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    thumbnail: /jpeg|jpg|png|webp/,
    video: /mp4|webm|ogg/,
    avatar: /jpeg|jpg|png|webp/,
    document: /pdf|doc|docx/
  };

  const fileType = file.fieldname;
  const allowedPattern = allowedTypes[fileType] || allowedTypes.document;

  if (allowedPattern.test(path.extname(file.originalname).toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${fileType}`), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  }
});

// Upload middleware functions
const uploadSingle = (fieldName) => upload.single(fieldName);
const uploadMultiple = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount);
const uploadFields = (fields) => upload.fields(fields);

// Error handling middleware
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File too large',
        maxSize: process.env.MAX_FILE_SIZE || '10MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        message: 'Too many files'
      });
    }
  }

  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      message: error.message
    });
  }

  next(error);
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadFields,
  handleUploadError
};