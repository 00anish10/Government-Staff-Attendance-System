import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';

export const getAllDesignations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const department_id = req.query.department_id as string;

    let whereClause = 'WHERE dg.is_active = true';
    const params: any[] = [];
    let paramIndex = 1;

    if (department_id) {
      whereClause += ` AND dg.department_id = $${paramIndex}`;
      params.push(department_id);
      paramIndex++;
    }

    const result = await query(
      `SELECT dg.*, dep.name as department_name, dep.name_np as department_name_np,
              COUNT(s.id) as staff_count
       FROM designations dg
       LEFT JOIN departments dep ON dg.department_id = dep.id
       LEFT JOIN staff s ON s.designation_id = dg.id AND s.is_active = true
       ${whereClause}
       GROUP BY dg.id, dep.name, dep.name_np
       ORDER BY dg.grade ASC, dg.title ASC`,
      params
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const getDesignationById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT dg.*, dep.name as department_name, dep.name_np as department_name_np
       FROM designations dg
       LEFT JOIN departments dep ON dg.department_id = dep.id
       WHERE dg.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Designation not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const createDesignation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, title_np, grade, pay_scale, department_id } = req.body;

    const result = await query(
      `INSERT INTO designations (title, title_np, grade, pay_scale, department_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, title_np, grade, pay_scale, department_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const updateDesignation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, title_np, grade, pay_scale, department_id, is_active } = req.body;

    const result = await query(
      `UPDATE designations SET title = $1, title_np = $2, grade = $3,
       pay_scale = $4, department_id = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 RETURNING *`,
      [title, title_np, grade, pay_scale, department_id, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Designation not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const deleteDesignation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await query(
      `UPDATE designations SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Designation not found' });
    }

    res.json({ message: 'Designation deactivated successfully' });
  } catch (err) {
    next(err);
  }
};
