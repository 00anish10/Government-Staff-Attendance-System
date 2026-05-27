"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const designationController_1 = require("../controllers/designationController");
const router = (0, express_1.Router)();
router.get('/', designationController_1.getAllDesignations);
router.get('/:id', designationController_1.getDesignationById);
router.post('/', designationController_1.createDesignation);
router.put('/:id', designationController_1.updateDesignation);
router.delete('/:id', designationController_1.deleteDesignation);
exports.default = router;
//# sourceMappingURL=designationRoutes.js.map