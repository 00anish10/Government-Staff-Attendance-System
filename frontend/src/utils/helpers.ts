import { AttendanceStatus, LeaveType, LeaveStatus } from '../types';
import { toBsDateStr } from './nepaliDate';

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatDateWithBs(dateStr: string): string {
  const ad = formatDate(dateStr);
  const bs = toBsDateStr(dateStr);
  return `${ad} / ${bs}`;
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTime(dateStr: string | null): string {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function getStatusBadgeClass(status: AttendanceStatus | LeaveStatus): string {
  const map: Record<string, string> = {
    present: 'badge-success',
    absent: 'badge-danger',
    late: 'badge-warning',
    'half-day': 'badge-warning',
    holiday: 'badge-info',
    leave: 'badge-info',
    pending: 'badge-warning',
    approved: 'badge-success',
    rejected: 'badge-danger',
  };
  return map[status] || 'badge-gray';
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    present: 'Present',
    absent: 'Absent',
    late: 'Late',
    'half-day': 'Half Day',
    holiday: 'Holiday',
    leave: 'On Leave',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
  };
  return map[status] || status;
}

export function getLeaveTypeLabel(type: LeaveType): string {
  const map: Record<string, string> = {
    annual: 'Annual Leave',
    sick: 'Sick Leave',
    personal: 'Personal Leave',
    maternity: 'Maternity Leave',
    paternity: 'Paternity Leave',
    other: 'Other',
  };
  return map[type] || type;
}

export function getGenderLabel(gender: string): string {
  const map: Record<string, string> = { male: 'Male', female: 'Female', other: 'Other' };
  return map[gender] || gender;
}

export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}
