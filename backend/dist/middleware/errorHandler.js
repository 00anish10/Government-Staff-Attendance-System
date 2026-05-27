"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}
exports.AppError = AppError;
const errorHandler = (err, _req, res, _next) => {
    console.error('Error:', err.message);
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    if (err.code === '23505') {
        return res.status(409).json({ error: 'Duplicate entry. This record already exists.' });
    }
    if (err.code === '23503') {
        return res.status(400).json({ error: 'Referenced record not found.' });
    }
    return res.status(500).json({ error: 'Internal server error' });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map