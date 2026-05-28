"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStaff = exports.updateStaff = exports.createStaff = exports.getStaffById = exports.getAllStaff = void 0;
const database_1 = require("../config/database");
const getAllStaff = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const offset = (page - 1) * limit;
        const search = req.query.search;
        const department_id = req.query.department_id;
        let whereClause = 'WHERE s.is_active = true';
        const params = [];
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
        const countResult = await (0, database_1.query)(`SELECT COUNT(*) FROM staff s ${whereClause}`, params);
        const total = parseInt(countResult.rows[0].count);
        params.push(limit);
        params.push(offset);
        const result = await (0, database_1.query)(`SELECT s.*, d.title as designation_title, d.title_np as designation_title_np,
              dep.name as department_name, dep.name_np as department_name_np
       FROM staff s
       LEFT JOIN designations d ON s.designation_id = d.id
       LEFT JOIN departments dep ON s.department_id = dep.id
       ${whereClause}
       ORDER BY s.full_name ASC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`, params);
        res.json({
            data: result.rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getAllStaff = getAllStaff;
const getStaffById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await (0, database_1.query)(`SELECT s.*, d.title as designation_title, d.title_np as designation_title_np,
              dep.name as department_name, dep.name_np as department_name_np
       FROM staff s
       LEFT JOIN designations d ON s.designation_id = d.id
       LEFT JOIN departments dep ON s.department_id = dep.id
       WHERE s.id = $1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Staff not found' });
        }
        res.json({ data: result.rows[0] });
    }
    catch (err) {
        next(err);
    }
};
exports.getStaffById = getStaffById;
const calcAgeAtJoining = (dob, doj) => {
    const birth = new Date(dob);
    const joining = new Date(doj);
    let age = joining.getFullYear() - birth.getFullYear();
    const monthDiff = joining.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && joining.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};
const createStaff = async (req, res, next) => {
    try {
        const { employee_id, full_name, full_name_np, email, phone, address, date_of_birth, date_of_joining, gender, designation_id, department_id } = req.body;
        if (new Date(date_of_birth) > new Date(date_of_joining)) {
            return res.status(400).json({ error: 'Date of birth cannot be after date of joining' });
        }
        const age = calcAgeAtJoining(date_of_birth, date_of_joining);
        const is_minor = age < 18;
        const result = await (0, database_1.query)(`INSERT INTO staff (employee_id, full_name, full_name_np, email, phone, address,
        date_of_birth, date_of_joining, age, is_minor, gender, designation_id, department_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`, [employee_id, full_name, full_name_np, email, phone, address,
            date_of_birth, date_of_joining, age, is_minor, gender, designation_id, department_id]);
        res.status(201).json({ data: result.rows[0] });
    }
    catch (err) {
        next(err);
    }
};
exports.createStaff = createStaff;
const updateStaff = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { full_name, full_name_np, email, phone, address, date_of_birth, date_of_joining, gender, designation_id, department_id, is_active } = req.body;
        const dob = date_of_birth ?? (await (0, database_1.query)(`SELECT date_of_birth FROM staff WHERE id = $1`, [id])).rows[0]?.date_of_birth;
        const doj = date_of_joining ?? (await (0, database_1.query)(`SELECT date_of_joining FROM staff WHERE id = $1`, [id])).rows[0]?.date_of_joining;
        if (dob && doj && new Date(dob) > new Date(doj)) {
            return res.status(400).json({ error: 'Date of birth cannot be after date of joining' });
        }
        const age = dob && doj ? calcAgeAtJoining(dob, doj) : undefined;
        const is_minor = age !== undefined ? age < 18 : undefined;
        const fields = [];
        const params = [];
        let idx = 1;
        if (full_name !== undefined) {
            fields.push(`full_name = $${idx++}`);
            params.push(full_name);
        }
        if (full_name_np !== undefined) {
            fields.push(`full_name_np = $${idx++}`);
            params.push(full_name_np);
        }
        if (email !== undefined) {
            fields.push(`email = $${idx++}`);
            params.push(email);
        }
        if (phone !== undefined) {
            fields.push(`phone = $${idx++}`);
            params.push(phone);
        }
        if (address !== undefined) {
            fields.push(`address = $${idx++}`);
            params.push(address);
        }
        if (date_of_birth !== undefined) {
            fields.push(`date_of_birth = $${idx++}`);
            params.push(date_of_birth);
        }
        if (date_of_joining !== undefined) {
            fields.push(`date_of_joining = $${idx++}`);
            params.push(date_of_joining);
        }
        if (age !== undefined) {
            fields.push(`age = $${idx++}`);
            params.push(age);
        }
        if (is_minor !== undefined) {
            fields.push(`is_minor = $${idx++}`);
            params.push(is_minor);
        }
        if (gender !== undefined) {
            fields.push(`gender = $${idx++}`);
            params.push(gender);
        }
        if (designation_id !== undefined) {
            fields.push(`designation_id = $${idx++}`);
            params.push(designation_id);
        }
        if (department_id !== undefined) {
            fields.push(`department_id = $${idx++}`);
            params.push(department_id);
        }
        if (is_active !== undefined) {
            fields.push(`is_active = $${idx++}`);
            params.push(is_active);
        }
        if (fields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        params.push(id);
        const result = await (0, database_1.query)(`UPDATE staff SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, params);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Staff not found' });
        }
        res.json({ data: result.rows[0] });
    }
    catch (err) {
        next(err);
    }
};
exports.updateStaff = updateStaff;
const deleteStaff = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await (0, database_1.query)(`DELETE FROM staff WHERE id = $1 RETURNING *`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Staff not found' });
        }
        res.json({ message: 'Staff deleted successfully' });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteStaff = deleteStaff;
//# sourceMappingURL=staffController.js.map