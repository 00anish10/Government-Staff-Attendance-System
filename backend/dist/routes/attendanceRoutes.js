"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const attendanceController_1 = require("../controllers/attendanceController");
const validate_1 = require("../middleware/validate");
const router = (0, express_1.Router)();
router.get('/', attendanceController_1.getAttendance);
router.get('/today', attendanceController_1.getTodayAttendance);
router.get('/staff/:id', attendanceController_1.getAttendanceByStaff);
router.post('/check-in', (0, validate_1.validate)({ staff_id: validate_1.required }), attendanceController_1.checkIn);
router.post('/check-out', (0, validate_1.validate)({ staff_id: validate_1.required }), attendanceController_1.checkOut);
router.post('/mark', (0, validate_1.validate)({
    staff_id: validate_1.required,
    date: validate_1.required,
    status: validate_1.required,
}), attendanceController_1.markAttendance);
exports.default = router;
//# sourceMappingURL=attendanceRoutes.js.map