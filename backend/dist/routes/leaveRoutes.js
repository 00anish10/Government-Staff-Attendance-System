"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leaveController_1 = require("../controllers/leaveController");
const router = (0, express_1.Router)();
router.get('/', leaveController_1.getLeaveRequests);
router.post('/', leaveController_1.createLeaveRequest);
router.put('/:id/approve', leaveController_1.approveLeave);
router.put('/:id/reject', leaveController_1.rejectLeave);
exports.default = router;
//# sourceMappingURL=leaveRoutes.js.map