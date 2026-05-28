import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', err.message);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if ((err as any).code === '23505') {
    const detail = (err as any).detail || '';
    const match = detail.match(/\(([^)]+)\)=\(([^)]+)\)/);
    const field = match ? match[1] : 'record';
    return res.status(409).json({ error: `Duplicate ${field}. This ${field} already exists.` });
  }

  if ((err as any).code === '23503') {
    return res.status(400).json({ error: 'Referenced record not found.' });
  }

  if ((err as any).code === '23514') {
    return res.status(400).json({ error: 'Value violates a constraint check.' });
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({ error: 'Internal server error' });
};
