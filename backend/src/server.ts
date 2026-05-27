import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { basicAuth } from './middleware/auth';
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Sarkaari Hajiri Pranali API is running', timestamp: new Date().toISOString() });
});

app.use('/api/departments', basicAuth, departmentRoutes);
app.use('/api/designations', basicAuth, designationRoutes);
app.use('/api/staff', basicAuth, staffRoutes);
app.use('/api/attendance', basicAuth, attendanceRoutes);
app.use('/api/leaves', basicAuth, leaveRoutes);
app.use('/api/dashboard', basicAuth, dashboardRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🟢 Sarkaari Hajiri Pranali API server running on http://localhost:${PORT}`);
  console.log(`📍 CORS origin: ${CORS_ORIGIN}`);
});

export default app;
