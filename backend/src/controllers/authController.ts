import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';
import { JWT_SECRET } from '../middleware/auth';

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const result = await query(
      `SELECT u.id, u.username, u.password_hash, u.role, u.staff_id, s.full_name, s.full_name_np, s.profile_image
       FROM users u
       LEFT JOIN staff s ON u.staff_id = s.id
       WHERE u.username = $1 AND u.is_active = true`,
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = result.rows[0];

    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      staff_id: user.staff_id,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });

    res.json({
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          staff_id: user.staff_id,
          full_name: user.full_name,
          full_name_np: user.full_name_np,
          profile_image: user.profile_image,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as any;
    const userId = authReq.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const result = await query(
      `SELECT u.id, u.username, u.role, u.staff_id, s.full_name, s.full_name_np, s.profile_image
       FROM users u
       LEFT JOIN staff s ON u.staff_id = s.id
       WHERE u.id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};
