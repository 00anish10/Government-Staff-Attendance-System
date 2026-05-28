"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const designationController_1 = require("../controllers/designationController");
const validate_1 = require("../middleware/validate");
const router = (0, express_1.Router)();
router.get('/', designationController_1.getAllDesignations);
router.get('/:id', designationController_1.getDesignationById);
router.post('/', (0, validate_1.validate)({
    title: validate_1.required,
    title_np: validate_1.required,
    grade: validate_1.required,
    pay_scale: validate_1.required,
    department_id: validate_1.required,
}), designationController_1.createDesignation);
router.put('/:id', designationController_1.updateDesignation);
router.delete('/:id', designationController_1.deleteDesignation);
exports.default = router;
//# sourceMappingURL=designationRoutes.js.map