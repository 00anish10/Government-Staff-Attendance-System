import { Router } from 'express';
import {
  getAllStaff, getStaffById, createStaff, updateStaff, deleteStaff
} from '../controllers/staffController';
import { validate, required, isEmail, isPhone, isDate } from '../middleware/validate';

const router = Router();

router.get('/', getAllStaff);
router.get('/:id', getStaffById);
router.post('/', validate({
  employee_id: required,
  full_name: required,
  full_name_np: required,
  email: (v) => required(v) || isEmail(v),
  phone: (v) => required(v) || isPhone(v),
  date_of_birth: (v) => required(v) || isDate(v),
  date_of_joining: (v) => required(v) || isDate(v),
  gender: required,
  designation_id: required,
  department_id: required,
}), createStaff);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);

export default router;
