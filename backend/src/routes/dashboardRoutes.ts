import { Router } from 'express';
import { getDashboardStats, getAttendanceTrends, getDepartmentStats } from '../controllers/dashboardController';

const router = Router();

router.get('/stats', getDashboardStats);
router.get('/trends', getAttendanceTrends);
router.get('/departments', getDepartmentStats);

export default router;
