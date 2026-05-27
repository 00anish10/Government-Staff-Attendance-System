"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDepartment = exports.updateDepartment = exports.createDepartment = exports.getDepartmentById = exports.getAllDepartments = void 0;
const database_1 = require("../config/database");
const getAllDepartments = async (_req, res, next) => {
    try {
        const result = await (0, database_1.query)(`SELECT d.*, COUNT(s.id) as staff_count
       FROM departments d
       LEFT JOIN staff s ON s.department_id = d.id AND s.is_active = true
       GROUP BY d.id
       ORDER BY d.name ASC`);
        res.json(result.rows);
    }
    catch (err) {
        next(err);
    }
};
exports.getAllDepartments = getAllDepartments;
const getDepartmentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await (0, database_1.query)(`SELECT d.*, COUNT(s.id) as staff_count
       FROM departments d
       LEFT JOIN staff s ON s.department_id = d.id AND s.is_active = true
       WHERE d.id = $1
       GROUP BY d.id`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        next(err);
    }
};
exports.getDepartmentById = getDepartmentById;
const createDepartment = async (req, res, next) => {
    try {
        const { name, name_np, code, description } = req.body;
        const result = await (0, database_1.query)(`INSERT INTO departments (name, name_np, code, description)
       VALUES ($1, $2, $3, $4) RETURNING *`, [name, name_np, code, description]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        next(err);
    }
};
exports.createDepartment = createDepartment;
const updateDepartment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, name_np, code, description, is_active } = req.body;
        const result = await (0, database_1.query)(`UPDATE departments SET name = $1, name_np = $2, code = $3,
       description = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 RETURNING *`, [name, name_np, code, description, is_active, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        next(err);
    }
};
exports.updateDepartment = updateDepartment;
const deleteDepartment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await (0, database_1.query)(`UPDATE departments SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }
        res.json({ message: 'Department deactivated successfully' });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteDepartment = deleteDepartment;
//# sourceMappingURL=departmentController.js.map