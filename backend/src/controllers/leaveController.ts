import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';

export const getLeaveRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;
    const status = req.query.status as string;
    const staff_id = req.query.staff_id as string;

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
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

    const countResult = await query(
      `SELECT COUNT(*) FROM leave_requests l ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    params.push(limit);
    params.push(offset);

    const result = await query(
      `SELECT l.*, s.full_name as staff_name, s.employee_id,
              s.full_name_np as staff_name_np, d.name as department_name,
              a.full_name as approver_name
       FROM leave_requests l
       JOIN staff s ON l.staff_id = s.id
       LEFT JOIN departments d ON s.department_id = d.id
       LEFT JOIN staff a ON l.approved_by = a.id
       ${whereClause}
       ORDER BY l.created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params
    );

    res.json({
      data: result.rows,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

export const createLeaveRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { staff_id, leave_type, start_date, end_date, reason } = req.body;

    const result = await query(
      `INSERT INTO leave_requests (staff_id, leave_type, start_date, end_date, reason)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [staff_id, leave_type, start_date, end_date, reason]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const approveLeave = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { approved_by, remarks } = req.body;

    const leave = await query(`SELECT * FROM leave_requests WHERE id = $1`, [id]);
    if (leave.rows.length === 0) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    const result = await query(
      `UPDATE leave_requests SET status = 'approved', approved_by = $1,
       remarks = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *`,
      [approved_by, remarks, id]
    );

    const leaveData = result.rows[0];
    const startDate = new Date(leaveData.start_date);
    const endDate = new Date(leaveData.end_date);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      await query(
        `INSERT INTO attendance (staff_id, date, status)
         VALUES ($1, $2, 'leave')
         ON CONFLICT (staff_id, date) DO UPDATE SET status = 'leave'`,
        [leaveData.staff_id, dateStr]
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const rejectLeave = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { approved_by, remarks } = req.body;

    const leave = await query(`SELECT * FROM leave_requests WHERE id = $1`, [id]);
    if (leave.rows.length === 0) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    const result = await query(
      `UPDATE leave_requests SET status = 'rejected', approved_by = $1,
       remarks = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *`,
      [approved_by, remarks, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};
