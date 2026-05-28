const NEPAL_TIMEZONE = 'Asia/Kathmandu';
const NEPAL_UTC_OFFSET = 345; // 5h45m = 345 minutes

export function getNepaliNow(): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + NEPAL_UTC_OFFSET * 60000);
}

export function getNepaliDateStr(): string {
  return getNepaliNow().toISOString().split('T')[0];
}

export function getNepaliISOString(): string {
  return getNepaliNow().toISOString();
}

export function getNepaliHour(): number {
  return getNepaliNow().getHours();
}

export function getNepaliMinutes(): number {
  return getNepaliNow().getHours() * 60 + getNepaliNow().getMinutes();
}

export function getLateThresholdMinutes(officeStartTime: string, lateAfterMinutes: number): number {
  const [h, m] = officeStartTime.split(':').map(Number);
  return h * 60 + m + lateAfterMinutes;
}

export function isLate(officeStartTime: string, lateAfterMinutes: number): boolean {
  const nowMinutes = getNepaliMinutes();
  const threshold = getLateThresholdMinutes(officeStartTime, lateAfterMinutes);
  return nowMinutes > threshold;
}
