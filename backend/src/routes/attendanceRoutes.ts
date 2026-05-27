import { Router } from 'express';
import {
  getAttendance, getAttendanceByStaff, checkIn, checkOut, markAttendance, getTodayAttendance
} from '../controllers/attendanceController';

const router = Router();

router.get('/', getAttendance);
router.get('/today', getTodayAttendance);
router.get('/staff/:id', getAttendanceByStaff);
router.post('/check-in', checkIn);
router.post('/check-out', checkOut);
router.post('/mark', markAttendance);

export default router;
