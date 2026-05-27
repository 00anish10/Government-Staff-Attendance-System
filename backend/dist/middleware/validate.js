"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDate = exports.isPhone = exports.isEmail = exports.required = exports.validate = void 0;
const validate = (schema) => {
    return (req, res, next) => {
        const errors = [];
        for (const [field, validator] of Object.entries(schema)) {
            const value = req.body[field];
            const error = validator(value);
            if (error) {
                errors.push(`${field}: ${error}`);
            }
        }
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        next();
    };
};
exports.validate = validate;
const required = (val) => {
    if (val === undefined || val === null || val === '') {
        return 'This field is required';
    }
    return null;
};
exports.required = required;
const isEmail = (val) => {
    if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        return 'Invalid email format';
    }
    return null;
};
exports.isEmail = isEmail;
const isPhone = (val) => {
    if (val && !/^\+?[\d\s-]{7,15}$/.test(val)) {
        return 'Invalid phone number';
    }
    return null;
};
exports.isPhone = isPhone;
const isDate = (val) => {
    if (val && isNaN(Date.parse(val))) {
        return 'Invalid date format';
    }
    return null;
};
exports.isDate = isDate;
//# sourceMappingURL=validate.js.map