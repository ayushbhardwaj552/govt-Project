import multer from 'multer';
import path from 'path';

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    // Create a unique filename to prevent overwrites
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to allow images, videos, AND PDFs
const fileFilter = (req, file, cb) => {
  // We add 'application/pdf' to the list of accepted types
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only images, videos, and PDFs are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 25 // 25 MB file size limit
  },
  fileFilter: fileFilter
});

export default upload;