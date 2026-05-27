"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.basicAuth = void 0;
const basicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header required' });
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Invalid authorization format. Use: Bearer <token>' });
    }
    const token = parts[1];
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [username, password] = decoded.split(':');
    if (!username || !password) {
        return res.status(401).json({ error: 'Invalid credentials format' });
    }
    req.user = {
        id: 1,
        username,
        role: 'admin',
        staff_id: 1,
    };
    next();
};
exports.basicAuth = basicAuth;
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=auth.js.map