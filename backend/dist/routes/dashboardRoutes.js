"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
const router = (0, express_1.Router)();
router.get('/stats', dashboardController_1.getDashboardStats);
router.get('/trends', dashboardController_1.getAttendanceTrends);
router.get('/departments', dashboardController_1.getDepartmentStats);
exports.default = router;
//# sourceMappingURL=dashboardRoutes.js.map