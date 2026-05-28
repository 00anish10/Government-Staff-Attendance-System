"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDesignation = exports.updateDesignation = exports.createDesignation = exports.getDesignationById = exports.getAllDesignations = void 0;
const database_1 = require("../config/database");
const getAllDesignations = async (req, res, next) => {
    try {
        const department_id = req.query.department_id;
        let whereClause = 'WHERE dg.is_active = true';
        const params = [];
        let paramIndex = 1;
        if (department_id) {
            whereClause += ` AND dg.department_id = $${paramIndex}`;
            params.push(department_id);
            paramIndex++;
        }
        const result = await (0, database_1.query)(`SELECT dg.*, dep.name as department_name, dep.name_np as department_name_np,
              COUNT(s.id) as staff_count
       FROM designations dg
       LEFT JOIN departments dep ON dg.department_id = dep.id
       LEFT JOIN staff s ON s.designation_id = dg.id AND s.is_active = true
       ${whereClause}
       GROUP BY dg.id, dep.name, dep.name_np
       ORDER BY dg.grade ASC, dg.title ASC`, params);
        res.json({ data: result.rows });
    }
    catch (err) {
        next(err);
    }
};
exports.getAllDesignations = getAllDesignations;
const getDesignationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await (0, database_1.query)(`SELECT dg.*, dep.name as department_name, dep.name_np as department_name_np
       FROM designations dg
       LEFT JOIN departments dep ON dg.department_id = dep.id
       WHERE dg.id = $1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Designation not found' });
        }
        res.json({ data: result.rows[0] });
    }
    catch (err) {
        next(err);
    }
};
exports.getDesignationById = getDesignationById;
const createDesignation = async (req, res, next) => {
    try {
        const { title, title_np, grade, pay_scale, department_id } = req.body;
        const result = await (0, database_1.query)(`INSERT INTO designations (title, title_np, grade, pay_scale, department_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`, [title, title_np, grade, pay_scale, department_id]);
        res.status(201).json({ data: result.rows[0] });
    }
    catch (err) {
        next(err);
    }
};
exports.createDesignation = createDesignation;
const updateDesignation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, title_np, grade, pay_scale, department_id, is_active } = req.body;
        const result = await (0, database_1.query)(`UPDATE designations SET title = $1, title_np = $2, grade = $3,
       pay_scale = $4, department_id = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 RETURNING *`, [title, title_np, grade, pay_scale, department_id, is_active, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Designation not found' });
        }
        res.json({ data: result.rows[0] });
    }
    catch (err) {
        next(err);
    }
};
exports.updateDesignation = updateDesignation;
const deleteDesignation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const staffCount = await (0, database_1.query)(`SELECT COUNT(*) as count FROM staff WHERE designation_id = $1 AND is_active = true`, [id]);
        if (parseInt(staffCount.rows[0].count) > 0) {
            return res.status(400).json({ error: `Cannot deactivate designation: ${staffCount.rows[0].count} active staff assigned. Reassign them first.` });
        }
        const result = await (0, database_1.query)(`UPDATE designations SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Designation not found' });
        }
        res.json({ message: 'Designation deactivated successfully' });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteDesignation = deleteDesignation;
//# sourceMappingURL=designationController.js.map