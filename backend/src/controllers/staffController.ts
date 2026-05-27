import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';

export const getAllStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;
    const search = req.query.search as string;
    const department_id = req.query.department_id as string;

    let whereClause = 'WHERE s.is_active = true';
    const params: any[] = [];
    let paramIndex = 1;

    if (search) {
      whereClause += ` AND (s.full_name ILIKE $${paramIndex} OR s.employee_id ILIKE $${paramIndex} OR s.full_name_np ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (department_id) {
      whereClause += ` AND s.department_id = $${paramIndex}`;
      params.push(department_id);
      paramIndex++;
    }

    const countResult = await query(
      `SELECT COUNT(*) FROM staff s ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    params.push(limit);
    params.push(offset);

    const result = await query(
      `SELECT s.*, d.title as designation_title, d.title_np as designation_title_np,
              dep.name as department_name, dep.name_np as department_name_np
       FROM staff s
       LEFT JOIN designations d ON s.designation_id = d.id
       LEFT JOIN departments dep ON s.department_id = dep.id
       ${whereClause}
       ORDER BY s.full_name ASC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params
    );

    res.json({
      data: result.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getStaffById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT s.*, d.title as designation_title, d.title_np as designation_title_np,
              dep.name as department_name, dep.name_np as department_name_np
       FROM staff s
       LEFT JOIN designations d ON s.designation_id = d.id
       LEFT JOIN departments dep ON s.department_id = dep.id
       WHERE s.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const createStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      employee_id, full_name, full_name_np, email, phone, address,
      date_of_birth, date_of_joining, gender, designation_id, department_id
    } = req.body;

    const result = await query(
      `INSERT INTO staff (employee_id, full_name, full_name_np, email, phone, address,
        date_of_birth, date_of_joining, gender, designation_id, department_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [employee_id, full_name, full_name_np, email, phone, address,
       date_of_birth, date_of_joining, gender, designation_id, department_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const updateStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const {
      full_name, full_name_np, email, phone, address,
      date_of_birth, date_of_joining, gender, designation_id, department_id, is_active
    } = req.body;

    const result = await query(
      `UPDATE staff SET full_name = $1, full_name_np = $2, email = $3, phone = $4,
        address = $5, date_of_birth = $6, date_of_joining = $7, gender = $8,
        designation_id = $9, department_id = $10, is_active = $11, updated_at = CURRENT_TIMESTAMP
       WHERE id = $12 RETURNING *`,
      [full_name, full_name_np, email, phone, address,
       date_of_birth, date_of_joining, gender, designation_id, department_id, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const deleteStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await query(
      `UPDATE staff SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    res.json({ message: 'Staff deactivated successfully' });
  } catch (err) {
    next(err);
  }
};
