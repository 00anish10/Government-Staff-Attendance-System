"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEnum = exports.isPositive = exports.isNumber = exports.isDate = exports.isPhone = exports.isEmail = exports.required = exports.validate = void 0;
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
const isNumber = (val) => {
    if (val !== undefined && val !== null && val !== '' && isNaN(Number(val))) {
        return 'Must be a number';
    }
    return null;
};
exports.isNumber = isNumber;
const isPositive = (val) => {
    if (val !== undefined && val !== null && val !== '' && Number(val) <= 0) {
        return 'Must be a positive number';
    }
    return null;
};
exports.isPositive = isPositive;
const isEnum = (validValues) => {
    return (val) => {
        if (val && !validValues.includes(val)) {
            return `Must be one of: ${validValues.join(', ')}`;
        }
        return null;
    };
};
exports.isEnum = isEnum;
//# sourceMappingURL=validate.js.map