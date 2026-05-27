"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectLeave = exports.approveLeave = exports.createLeaveRequest = exports.getLeaveRequests = void 0;
const database_1 = require("../config/database");
const getLeaveRequests = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const offset = (page - 1) * limit;
        const status = req.query.status;
        const staff_id = req.query.staff_id;
        let whereClause = 'WHERE 1=1';
        const params = [];
        let paramIndex = 1;
        if (status) {
            whereClause += ` AND l.status = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }
        if (staff_id) {
            whereClause += ` AND l.staff_id = $${paramIndex}`;
            params.push(staff_id);
            paramIndex++;
        }
        const countResult = await (0, database_1.query)(`SELECT COUNT(*) FROM leave_requests l ${whereClause}`, params);
        const total = parseInt(countResult.rows[0].count);
        params.push(limit);
        params.push(offset);
        const result = await (0, database_1.query)(`SELECT l.*, s.full_name as staff_name, s.employee_id,
              s.full_name_np as staff_name_np, d.name as department_name,
              a.full_name as approver_name
       FROM leave_requests l
       JOIN staff s ON l.staff_id = s.id
       LEFT JOIN departments d ON s.department_id = d.id
       LEFT JOIN staff a ON l.approved_by = a.id
       ${whereClause}
       ORDER BY l.created_at DESC
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
exports.getLeaveRequests = getLeaveRequests;
const createLeaveRequest = async (req, res, next) => {
    try {
        const { staff_id, leave_type, start_date, end_date, reason } = req.body;
        const result = await (0, database_1.query)(`INSERT INTO leave_requests (staff_id, leave_type, start_date, end_date, reason)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`, [staff_id, leave_type, start_date, end_date, reason]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        next(err);
    }
};
exports.createLeaveRequest = createLeaveRequest;
const approveLeave = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { approved_by, remarks } = req.body;
        const leave = await (0, database_1.query)(`SELECT * FROM leave_requests WHERE id = $1`, [id]);
        if (leave.rows.length === 0) {
            return res.status(404).json({ error: 'Leave request not found' });
        }
        const result = await (0, database_1.query)(`UPDATE leave_requests SET status = 'approved', approved_by = $1,
       remarks = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *`, [approved_by, remarks, id]);
        const leaveData = result.rows[0];
        const startDate = new Date(leaveData.start_date);
        const endDate = new Date(leaveData.end_date);
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            await (0, database_1.query)(`INSERT INTO attendance (staff_id, date, status)
         VALUES ($1, $2, 'leave')
         ON CONFLICT (staff_id, date) DO UPDATE SET status = 'leave'`, [leaveData.staff_id, dateStr]);
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        next(err);
    }
};
exports.approveLeave = approveLeave;
const rejectLeave = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { approved_by, remarks } = req.body;
        const leave = await (0, database_1.query)(`SELECT * FROM leave_requests WHERE id = $1`, [id]);
        if (leave.rows.length === 0) {
            return res.status(404).json({ error: 'Leave request not found' });
        }
        const result = await (0, database_1.query)(`UPDATE leave_requests SET status = 'rejected', approved_by = $1,
       remarks = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *`, [approved_by, remarks, id]);
        res.json(result.rows[0]);
    }
    catch (err) {
        next(err);
    }
};
exports.rejectLeave = rejectLeave;
//# sourceMappingURL=leaveController.js.map