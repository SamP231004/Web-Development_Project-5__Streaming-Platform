import multer from "multer";
import express from "express";

// Set up Express app
const app = express();

// Set upload timeout middleware
const uploadTimeout = (req, res, next) => {
  req.setTimeout(10 * 60 * 1000); // 10 minutes
  next();
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp'); // Temporary storage location
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Ensures unique filenames
  }
});

// File filter configuration
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'video/mp4' || file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept videos and images
  } else {
    cb(new Error('Invalid file type. Only videos and images are allowed.'), false);
  }
};

// Multer upload configuration
export const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 * 1024 }, // 3 GB size limit
  fileFilter,
});

// Upload route with timeout and upload handling
app.post('/upload', uploadTimeout, upload.single('file'), (req, res) => {
  // Handle file upload
  if (!req.file) {
    return res.status(400).send({ error: 'No file uploaded or invalid file type.' });
  }
  res.send({ message: 'File uploaded successfully!', file: req.file });
});

// Start server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
