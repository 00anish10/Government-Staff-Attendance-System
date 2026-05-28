"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const staffController_1 = require("../controllers/staffController");
const validate_1 = require("../middleware/validate");
const router = (0, express_1.Router)();
router.get('/', staffController_1.getAllStaff);
router.get('/:id', staffController_1.getStaffById);
router.post('/', (0, validate_1.validate)({
    employee_id: validate_1.required,
    full_name: validate_1.required,
    full_name_np: validate_1.required,
    email: (v) => (0, validate_1.required)(v) || (0, validate_1.isEmail)(v),
    phone: (v) => (0, validate_1.required)(v) || (0, validate_1.isPhone)(v),
    date_of_birth: (v) => (0, validate_1.required)(v) || (0, validate_1.isDate)(v),
    date_of_joining: (v) => (0, validate_1.required)(v) || (0, validate_1.isDate)(v),
    gender: validate_1.required,
    designation_id: validate_1.required,
    department_id: validate_1.required,
}), staffController_1.createStaff);
router.put('/:id', staffController_1.updateStaff);
router.delete('/:id', staffController_1.deleteStaff);
exports.default = router;
//# sourceMappingURL=staffRoutes.js.map