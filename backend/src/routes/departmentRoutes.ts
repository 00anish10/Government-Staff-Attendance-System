import { Router } from 'express';
import {
  getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment
} from '../controllers/departmentController';
import { validate, required } from '../middleware/validate';

const router = Router();

router.get('/', getAllDepartments);
router.get('/:id', getDepartmentById);
router.post('/', validate({
  name: required,
  name_np: required,
  code: required,
}), createDepartment);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);

export default router;
