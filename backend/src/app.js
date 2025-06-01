// app.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import userRouter from './routes/user.routes.js';
import commentRouter from './routes/comment.routes.js';
import likeRouter from './routes/like.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import videoRouter from './routes/video.routes.js';
import playlistRouter from './routes/playlist.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use((req, res, next) => {
  const { method, url } = req;
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${method} - ${url}`);
  next();
});

app.use(cors({
  origin: true,
  credentials: true,
}));

app.options('*', cors({
  origin: true,
  credentials: true,
}));

app.use(express.json({ limit: '3gb' }));
app.use(express.urlencoded({ extended: true, limit: '3gb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Routes
app.use('/api/version_1/users', userRouter);
app.use('/api/version_1/comment', commentRouter);
app.use('/api/version_1/likes', likeRouter);
app.use('/api/version_1/subscriptions', subscriptionRouter);
app.use('/api/version_1/video', videoRouter);
app.use('/api/version_1/playlist', playlistRouter);
app.use('/api/version_1/dashboard', dashboardRouter);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

export default app;