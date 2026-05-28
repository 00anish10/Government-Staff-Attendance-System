"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodayAttendance = exports.markAttendance = exports.checkOut = exports.checkIn = exports.getAttendanceByStaff = exports.getAttendance = void 0;
const database_1 = require("../config/database");
const nepaliTime_1 = require("../utils/nepaliTime");
const OFFICE_START_TIME = process.env.OFFICE_START_TIME || '09:00';
const LATE_AFTER_MINUTES = parseInt(process.env.LATE_AFTER_MINUTES || '75', 10);
const getAttendance = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const offset = (page - 1) * limit;
        const date = req.query.date;
        const staff_id = req.query.staff_id;
        const status = req.query.status;
        let whereClause = 'WHERE 1=1';
        const params = [];
        let paramIndex = 1;
        if (date) {
            whereClause += ` AND a.date = $${paramIndex}`;
            params.push(date);
            paramIndex++;
        }
        if (staff_id) {
            whereClause += ` AND a.staff_id = $${paramIndex}`;
            params.push(staff_id);
            paramIndex++;
        }
        if (status) {
            whereClause += ` AND a.status = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }
        const countResult = await (0, database_1.query)(`SELECT COUNT(*) FROM attendance a ${whereClause}`, params);
        const total = parseInt(countResult.rows[0].count);
        params.push(limit);
        params.push(offset);
        const result = await (0, database_1.query)(`SELECT a.*, s.full_name as staff_name, s.employee_id, s.full_name_np as staff_name_np,
              d.name as department_name, des.title as designation_title
       FROM attendance a
       JOIN staff s ON a.staff_id = s.id
       LEFT JOIN departments d ON s.department_id = d.id
       LEFT JOIN designations des ON s.designation_id = des.id
       ${whereClause}
       ORDER BY a.date DESC, s.full_name ASC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`, params);
        res.json({
            data: result.rows,
            pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getAttendance = getAttendance;
const getAttendanceByStaff = async (req, res, next) => {
    try {
        const { id } = req.params;
        const limit = parseInt(req.query.limit) || 30;
        const offset = parseInt(req.query.offset) || 0;
        const result = await (0, database_1.query)(`SELECT * FROM attendance WHERE staff_id = $1
       ORDER BY date DESC LIMIT $2 OFFSET $3`, [id, limit, offset]);
        res.json({ data: result.rows });
    }
    catch (err) {
        next(err);
    }
};
exports.getAttendanceByStaff = getAttendanceByStaff;
const checkIn = async (req, res, next) => {
    try {
        const { staff_id } = req.body;
        const today = (0, nepaliTime_1.getNepaliDateStr)();
        const now = (0, nepaliTime_1.getNepaliISOString)();
        const staffExists = await (0, database_1.query)(`SELECT id, is_active FROM staff WHERE id = $1`, [staff_id]);
        if (staffExists.rows.length === 0) {
            return res.status(404).json({ error: 'Staff not found' });
        }
        if (!staffExists.rows[0].is_active) {
            return res.status(400).json({ error: 'Cannot check in: staff is inactive' });
        }
        const existing = await (0, database_1.query)(`SELECT * FROM attendance WHERE staff_id = $1 AND date = $2`, [staff_id, today]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Already checked in today' });
        }
        const status = (0, nepaliTime_1.isLate)(OFFICE_START_TIME, LATE_AFTER_MINUTES) ? 'late' : 'present';
        const result = await (0, database_1.query)(`INSERT INTO attendance (staff_id, date, check_in, status)
       VALUES ($1, $2, $3, $4) RETURNING *`, [staff_id, today, now, status]);
        res.status(201).json({ data: result.rows[0] });
    }
    catch (err) {
        next(err);
    }
};
exports.checkIn = checkIn;
const checkOut = async (req, res, next) => {
    try {
        const { staff_id } = req.body;
        const today = (0, nepaliTime_1.getNepaliDateStr)();
        const now = (0, nepaliTime_1.getNepaliISOString)();
        const staffExists = await (0, database_1.query)(`SELECT id, is_active FROM staff WHERE id = $1`, [staff_id]);
        if (staffExists.rows.length === 0) {
            return res.status(404).json({ error: 'Staff not found' });
        }
        const existing = await (0, database_1.query)(`SELECT * FROM attendance WHERE staff_id = $1 AND date = $2`, [staff_id, today]);
        if (existing.rows.length === 0) {
            return res.status(400).json({ error: 'Not checked in today' });
        }
        if (existing.rows[0].check_out) {
            return res.status(400).json({ error: 'Already checked out today' });
        }
        const result = await (0, database_1.query)(`UPDATE attendance SET check_out = $1, updated_at = CURRENT_TIMESTAMP
       WHERE staff_id = $2 AND date = $3 RETURNING *`, [now, staff_id, today]);
        res.json({ data: result.rows[0] });
    }
    catch (err) {
        next(err);
    }
};
exports.checkOut = checkOut;
const markAttendance = async (req, res, next) => {
    try {
        const { staff_id, date, status, check_in, check_out, remarks } = req.body;
        const staffExists = await (0, database_1.query)(`SELECT id FROM staff WHERE id = $1`, [staff_id]);
        if (staffExists.rows.length === 0) {
            return res.status(404).json({ error: 'Staff not found' });
        }
        const existing = await (0, database_1.query)(`SELECT * FROM attendance WHERE staff_id = $1 AND date = $2`, [staff_id, date]);
        if (existing.rows.length > 0) {
            const result = await (0, database_1.query)(`UPDATE attendance SET status = $1, check_in = $2, check_out = $3,
         remarks = $4, updated_at = CURRENT_TIMESTAMP
         WHERE staff_id = $5 AND date = $6 RETURNING *`, [status, check_in || null, check_out || null, remarks, staff_id, date]);
            return res.json({ data: result.rows[0] });
        }
        const result = await (0, database_1.query)(`INSERT INTO attendance (staff_id, date, check_in, check_out, status, remarks)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [staff_id, date, check_in || null, check_out || null, status, remarks]);
        res.status(201).json({ data: result.rows[0] });
    }
    catch (err) {
        next(err);
    }
};
exports.markAttendance = markAttendance;
const getTodayAttendance = async (_req, res, next) => {
    try {
        const today = (0, nepaliTime_1.getNepaliDateStr)();
        const result = await (0, database_1.query)(`SELECT a.*, s.full_name, s.employee_id, s.full_name_np,
              d.name as department_name, des.title as designation_title
       FROM attendance a
       JOIN staff s ON a.staff_id = s.id
       LEFT JOIN departments d ON s.department_id = d.id
       LEFT JOIN designations des ON s.designation_id = des.id
       WHERE a.date = $1
       ORDER BY s.full_name ASC`, [today]);
        res.json(result.rows);
    }
    catch (err) {
        next(err);
    }
};
exports.getTodayAttendance = getTodayAttendance;
//# sourceMappingURL=attendanceController.js.map