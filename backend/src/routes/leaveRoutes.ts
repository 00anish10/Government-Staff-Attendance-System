import { Router } from 'express';
import {
  getLeaveRequests, createLeaveRequest, approveLeave, rejectLeave
} from '../controllers/leaveController';

const router = Router();

router.get('/', getLeaveRequests);
router.post('/', createLeaveRequest);
router.put('/:id/approve', approveLeave);
router.put('/:id/reject', rejectLeave);

export default router;
