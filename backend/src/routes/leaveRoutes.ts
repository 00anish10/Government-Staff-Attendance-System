import { Router } from 'express';
import {
  getLeaveRequests, createLeaveRequest, approveLeave, rejectLeave
} from '../controllers/leaveController';
import { validate, required } from '../middleware/validate';

const router = Router();

router.get('/', getLeaveRequests);
router.post('/', validate({
  staff_id: required,
  leave_type: required,
  start_date: required,
  end_date: required,
  reason: required,
}), createLeaveRequest);
router.put('/:id/approve', validate({
  approved_by: required,
}), approveLeave);
router.put('/:id/reject', validate({
  approved_by: required,
}), rejectLeave);

export default router;
