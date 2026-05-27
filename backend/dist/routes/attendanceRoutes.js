"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const attendanceController_1 = require("../controllers/attendanceController");
const router = (0, express_1.Router)();
router.get('/', attendanceController_1.getAttendance);
router.get('/today', attendanceController_1.getTodayAttendance);
router.get('/staff/:id', attendanceController_1.getAttendanceByStaff);
router.post('/check-in', attendanceController_1.checkIn);
router.post('/check-out', attendanceController_1.checkOut);
router.post('/mark', attendanceController_1.markAttendance);
exports.default = router;
//# sourceMappingURL=attendanceRoutes.js.map