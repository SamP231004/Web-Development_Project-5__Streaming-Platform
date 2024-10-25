const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

const corsOptions = {
  origin: 'http://localhost:8000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cors(
  {
    origin: "https://streamingplatformbackend.onrender.com",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }
))

app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); 
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 * 1024 }
});

app.post('/api/auth/login', (req, res) => {
  res.status(200).json({ message: 'Login successful!' });
});

app.post('/api/version_1/video', upload.fields([{ name: 'videoFile' }, { name: 'thumbnail' }]), (req, res) => {
  try {
    const { title, description } = req.body;
    const videoFile = req.files['videoFile'][0];
    const thumbnail = req.files['thumbnail'][0];

    console.log(`Uploaded Video: ${videoFile.filename}`);
    console.log(`Uploaded Thumbnail: ${thumbnail.filename}`);

    res.status(200).json({ message: 'Video uploaded successfully!', videoURL: `uploads/${videoFile.filename}` });
  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).json({ message: 'Failed to upload video.' });
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.timeout = 600000;