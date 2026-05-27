"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const departmentController_1 = require("../controllers/departmentController");
const router = (0, express_1.Router)();
router.get('/', departmentController_1.getAllDepartments);
router.get('/:id', departmentController_1.getDepartmentById);
router.post('/', departmentController_1.createDepartment);
router.put('/:id', departmentController_1.updateDepartment);
router.delete('/:id', departmentController_1.deleteDepartment);
exports.default = router;
//# sourceMappingURL=departmentRoutes.js.map