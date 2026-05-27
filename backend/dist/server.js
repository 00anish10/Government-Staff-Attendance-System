"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("./middleware/errorHandler");
const auth_1 = require("./middleware/auth");
const departmentRoutes_1 = __importDefault(require("./routes/departmentRoutes"));
const designationRoutes_1 = __importDefault(require("./routes/designationRoutes"));
const staffRoutes_1 = __importDefault(require("./routes/staffRoutes"));
const attendanceRoutes_1 = __importDefault(require("./routes/attendanceRoutes"));
const leaveRoutes_1 = __importDefault(require("./routes/leaveRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use((0, cors_1.default)({ origin: CORS_ORIGIN, credentials: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', message: 'Sarkaari Hajiri Pranali API is running', timestamp: new Date().toISOString() });
});
app.use('/api/departments', auth_1.basicAuth, departmentRoutes_1.default);
app.use('/api/designations', auth_1.basicAuth, designationRoutes_1.default);
app.use('/api/staff', auth_1.basicAuth, staffRoutes_1.default);
app.use('/api/attendance', auth_1.basicAuth, attendanceRoutes_1.default);
app.use('/api/leaves', auth_1.basicAuth, leaveRoutes_1.default);
app.use('/api/dashboard', auth_1.basicAuth, dashboardRoutes_1.default);
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`🟢 Sarkaari Hajiri Pranali API server running on http://localhost:${PORT}`);
    console.log(`📍 CORS origin: ${CORS_ORIGIN}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map