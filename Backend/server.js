import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const isProd = process.env.NODE_ENV === 'production';
if (!process.env.JWT_SECRET) console.warn('WARNING: JWT_SECRET is not set. Copy .env.example to .env first.');
if (!process.env.MONGO_URI) console.warn('WARNING: MONGO_URI is not set. Copy .env.example to .env first.');

await connectDB().catch((e) => {
  console.error('MongoDB connection failed:', e.message);
  console.error('Hint: copy .env.example to .env and set MONGO_URI, then run npm run seed');
});

const app = express();
app.set('trust proxy', 1);
app.use(helmet());
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('CORS blocked for origin ' + origin));
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
if (!isProd) app.use(morgan('dev'));
else app.use(morgan('combined'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false });
app.use('/api', limiter);
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true, legacyHeaders: false });
app.use('/api/auth', authLimiter);

app.get('/', (_, res) => res.json({ status: 'ok', service: 'CyberEscape API', docs: '/api/health' }));
app.get('/api/health', (_, res) => res.json({
  status: 'ok',
  service: 'CyberEscape API',
  env: isProd ? 'production' : 'development',
  db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  time: new Date().toISOString(),
}));
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use(notFound); app.use(errorHandler);

const port = Number(process.env.PORT) || 5000;
const server = app.listen(port, () => console.log(`CyberEscape API running on port ${port}`));
server.on('error', (e) => { console.error('Server error:', e.message); process.exit(1); });
const shutdown = () => { console.log('Shutting down...'); server.close(() => process.exit(0)); };
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
