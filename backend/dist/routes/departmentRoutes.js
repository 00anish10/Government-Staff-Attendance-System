"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const departmentController_1 = require("../controllers/departmentController");
const validate_1 = require("../middleware/validate");
const router = (0, express_1.Router)();
router.get('/', departmentController_1.getAllDepartments);
router.get('/:id', departmentController_1.getDepartmentById);
router.post('/', (0, validate_1.validate)({
    name: validate_1.required,
    name_np: validate_1.required,
    code: validate_1.required,
}), departmentController_1.createDepartment);
router.put('/:id', departmentController_1.updateDepartment);
router.delete('/:id', departmentController_1.deleteDepartment);
exports.default = router;
//# sourceMappingURL=departmentRoutes.js.map