import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';
import { DashboardStats } from '../types';

export const getDashboardStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const totalStaff = await query(`SELECT COUNT(*) as count FROM staff WHERE is_active = true`);
    const departmentCount = await query(`SELECT COUNT(*) as count FROM departments WHERE is_active = true`);

    const today = new Date().toISOString().split('T')[0];

    const attendanceToday = await query(
      `SELECT status, COUNT(*) as count FROM attendance WHERE date = $1 GROUP BY status`,
      [today]
    );

    const pendingLeaves = await query(
      `SELECT COUNT(*) as count FROM leave_requests WHERE status = 'pending'`
    );

    const stats: DashboardStats = {
      total_staff: parseInt(totalStaff.rows[0].count),
      present_today: 0,
      absent_today: 0,
      on_leave_today: 0,
      late_today: 0,
      pending_leaves: parseInt(pendingLeaves.rows[0].count),
      department_count: parseInt(departmentCount.rows[0].count),
      attendance_percentage: 0,
    };

    for (const row of attendanceToday.rows) {
      switch (row.status) {
        case 'present':
          stats.present_today = parseInt(row.count);
          break;
        case 'absent':
          stats.absent_today = parseInt(row.count);
          break;
        case 'late':
          stats.late_today = parseInt(row.count);
          break;
        case 'leave':
          stats.on_leave_today = parseInt(row.count);
          break;
      }
    }

    const totalToday = stats.present_today + stats.absent_today + stats.late_today + stats.on_leave_today;
    stats.attendance_percentage = totalToday > 0
      ? Math.round(((stats.present_today + stats.late_today) / totalToday) * 100)
      : 0;

    res.json(stats);
  } catch (err) {
    next(err);
  }
};

export const getAttendanceTrends = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await query(`
      SELECT date,
             SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present,
             SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late,
             SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent,
             SUM(CASE WHEN status = 'leave' THEN 1 ELSE 0 END) as on_leave,
             COUNT(*) as total
      FROM attendance
      WHERE date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY date
      ORDER BY date ASC
    `);

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const getDepartmentStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const result = await query(
      `
      SELECT d.id, d.name, d.name_np, d.code,
             COUNT(s.id) as total_staff,
             COALESCE(SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END), 0) as present,
             COALESCE(SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END), 0) as late,
             COALESCE(SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END), 0) as absent,
             COALESCE(SUM(CASE WHEN a.status = 'leave' THEN 1 ELSE 0 END), 0) as on_leave
      FROM departments d
      LEFT JOIN staff s ON s.department_id = d.id AND s.is_active = true
      LEFT JOIN attendance a ON a.staff_id = s.id AND a.date = $1
      GROUP BY d.id, d.name, d.name_np, d.code
      ORDER BY d.name ASC
      `,
      [today]
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};
