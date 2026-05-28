import { Router } from 'express';
import {
  getAllDesignations, getDesignationById, createDesignation, updateDesignation, deleteDesignation
} from '../controllers/designationController';
import { validate, required, isEmail } from '../middleware/validate';

const router = Router();

router.get('/', getAllDesignations);
router.get('/:id', getDesignationById);
router.post('/', validate({
  title: required,
  title_np: required,
  grade: required,
  pay_scale: required,
  department_id: required,
}), createDesignation);
router.put('/:id', updateDesignation);
router.delete('/:id', deleteDesignation);

export default router;
