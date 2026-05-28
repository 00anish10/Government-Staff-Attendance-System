import { Router } from 'express';
import {
  getAttendance, getAttendanceByStaff, checkIn, checkOut, markAttendance, getTodayAttendance
} from '../controllers/attendanceController';
import { validate, required } from '../middleware/validate';

const router = Router();

router.get('/', getAttendance);
router.get('/today', getTodayAttendance);
router.get('/staff/:id', getAttendanceByStaff);
router.post('/check-in', validate({ staff_id: required }), checkIn);
router.post('/check-out', validate({ staff_id: required }), checkOut);
router.post('/mark', validate({
  staff_id: required,
  date: required,
  status: required,
}), markAttendance);

export default router;
