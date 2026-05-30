import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';
import { authenticate } from './middleware/auth';
import authRoutes from './routes/authRoutes';
import departmentRoutes from './routes/departmentRoutes';
import designationRoutes from './routes/designationRoutes';
import staffRoutes from './routes/staffRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import leaveRoutes from './routes/leaveRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many login attempts, please try again later' },
});
app.use('/api/auth/login', authLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Sarkaari Hajiri Pranali API is running', timestamp: new Date().toISOString() });
});

app.get('/api/debug/echo-headers', (req, res) => {
  res.json({
    authorization: req.headers.authorization || '(none)',
    allHeaders: req.headers,
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/departments', authenticate, departmentRoutes);
app.use('/api/designations', authenticate, designationRoutes);
app.use('/api/staff', authenticate, staffRoutes);
app.use('/api/attendance', authenticate, attendanceRoutes);
app.use('/api/leaves', authenticate, leaveRoutes);
app.use('/api/dashboard', authenticate, dashboardRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Sarkaari Hajiri Pranali API server running on http://localhost:${PORT}`);
  console.log(`CORS origin: ${CORS_ORIGIN}`);
});

export default app;
