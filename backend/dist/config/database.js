"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = exports.query = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'anishshrestha',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'Government Staff Attendance System',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};
const pool = new pg_1.Pool(poolConfig);
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});
const query = async (text, params) => {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text: text.substring(0, 80), duration, rows: res.rowCount });
    return res;
};
exports.query = query;
const getClient = async () => {
    const client = await pool.connect();
    return client;
};
exports.getClient = getClient;
exports.default = pool;
//# sourceMappingURL=database.js.map