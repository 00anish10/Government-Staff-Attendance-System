"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leaveController_1 = require("../controllers/leaveController");
const validate_1 = require("../middleware/validate");
const router = (0, express_1.Router)();
router.get('/', leaveController_1.getLeaveRequests);
router.post('/', (0, validate_1.validate)({
    staff_id: validate_1.required,
    leave_type: validate_1.required,
    start_date: validate_1.required,
    end_date: validate_1.required,
    reason: validate_1.required,
}), leaveController_1.createLeaveRequest);
router.put('/:id/approve', (0, validate_1.validate)({
    approved_by: validate_1.required,
}), leaveController_1.approveLeave);
router.put('/:id/reject', (0, validate_1.validate)({
    approved_by: validate_1.required,
}), leaveController_1.rejectLeave);
exports.default = router;
//# sourceMappingURL=leaveRoutes.js.map