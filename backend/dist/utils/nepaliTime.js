"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNepaliNow = getNepaliNow;
exports.getNepaliDateStr = getNepaliDateStr;
exports.getNepaliISOString = getNepaliISOString;
exports.getNepaliHour = getNepaliHour;
exports.getNepaliMinutes = getNepaliMinutes;
exports.getLateThresholdMinutes = getLateThresholdMinutes;
exports.isLate = isLate;
const NEPAL_TIMEZONE = 'Asia/Kathmandu';
const NEPAL_UTC_OFFSET = 345; // 5h45m = 345 minutes
function getNepaliNow() {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utc + NEPAL_UTC_OFFSET * 60000);
}
function getNepaliDateStr() {
    return getNepaliNow().toISOString().split('T')[0];
}
function getNepaliISOString() {
    return getNepaliNow().toISOString();
}
function getNepaliHour() {
    return getNepaliNow().getHours();
}
function getNepaliMinutes() {
    return getNepaliNow().getHours() * 60 + getNepaliNow().getMinutes();
}
function getLateThresholdMinutes(officeStartTime, lateAfterMinutes) {
    const [h, m] = officeStartTime.split(':').map(Number);
    return h * 60 + m + lateAfterMinutes;
}
function isLate(officeStartTime, lateAfterMinutes) {
    const nowMinutes = getNepaliMinutes();
    const threshold = getLateThresholdMinutes(officeStartTime, lateAfterMinutes);
    return nowMinutes > threshold;
}
//# sourceMappingURL=nepaliTime.js.map