import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

const dotenvResult = dotenv.config();
if (dotenvResult.error) {
  console.error('[database.ts] dotenv.config() failed:', dotenvResult.error.message);
} else {
  console.log('[database.ts] dotenv.config() succeeded, JWT_SECRET:', process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 15) + '...' : 'NOT SET');
}

const poolConfig: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'anishshrestha',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'Government Staff Attendance System',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text: text.substring(0, 80), duration, rows: res.rowCount });
  return res;
};

export const getClient = async () => {
  const client = await pool.connect();
  return client;
};

export default pool;
