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

export function calcAgeAtDate(dateOfBirth: string, atDate: string): number {
  const birth = new Date(dateOfBirth);
  const target = new Date(atDate);
  let age = target.getFullYear() - birth.getFullYear();
  const m = target.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && target.getDate() < birth.getDate())) age--;
  return age;
}

export function getTodayDate(): string {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const nepalOffset = 345 * 60000; // UTC+5:45
  return new Date(utc + nepalOffset).toISOString().split('T')[0];
}

const VOWELS = new Set(['a', 'i', 'u', 'e', 'o']);
const CONSONANT_CHARS = new Set([
  'k', 'K', 'g', 'G', 'c', 'C', 'j', 'J', 't', 'T', 'd', 'D', 'n', 'N',
  'p', 'P', 'b', 'B', 'm', 'M', 'y', 'Y', 'r', 'R', 'l', 'L', 'v', 'V',
  'w', 'W', 's', 'S', 'h', 'H', 'z', 'Z',
]);

const multiConsonantMap: [RegExp, string][] = [
  [/chh/gi, 'छ'], [/Chh/g, 'छ'], [/CHH/g, 'छ'],
  [/sh/gi, 'श'], [/Sh/g, 'ष'], [/SH/g, 'ष'],
  [/kh/gi, 'ख'], [/gh/gi, 'घ'],
  [/th/gi, 'थ'], [/Th/g, 'थ'], [/TH/g, 'थ'],
  [/dh/gi, 'ध'], [/Dh/g, 'ध'], [/DH/g, 'ध'],
  [/bh/gi, 'भ'], [/Bh/g, 'भ'], [/BH/g, 'भ'],
  [/ph/gi, 'फ'], [/Ph/g, 'फ'], [/PH/g, 'फ'],
  [/jh/gi, 'झ'], [/Jh/g, 'झ'], [/JH/g, 'झ'],
  [/ng/gi, 'ङ'], [/Ng/g, 'ङ'], [/NG/g, 'ङ'],
  [/ny/gi, 'ञ'], [/Ny/g, 'ञ'], [/NY/g, 'ञ'],
  [/ch/gi, 'च'], [/Ch/g, 'च'], [/CH/g, 'च'],
];

const consonantMap: Record<string, string> = {
  k: 'क', K: 'क', g: 'ग', G: 'ग',
  c: 'च', C: 'च', j: 'ज', J: 'ज',
  t: 'त', T: 'ट', d: 'द', D: 'ड',
  n: 'न', N: 'ण',
  p: 'प', P: 'प', b: 'ब', B: 'ब',
  m: 'म', M: 'म',
  y: 'य', Y: 'य', r: 'र', R: 'र',
  l: 'ल', L: 'ल',
  v: 'व', V: 'व', w: 'व', W: 'व',
  s: 'स', S: 'स', h: 'ह', H: 'ह',
  z: 'ज', Z: 'ज',
};

const vowelInitMap: Record<string, string> = {
  a: 'अ', A: 'अ',
  i: 'इ', I: 'इ',
  u: 'उ', U: 'उ',
  e: 'ए', E: 'ए',
  o: 'ओ', O: 'ओ',
};

const DEV_JOINER = '्';

export function transliterateToNepali(text: string): string {
  return text.trim().split(/\s+/).map(transliterateWord).join(' ');
}

function isVowel(ch: string): boolean {
  return VOWELS.has(ch) || VOWELS.has(ch.toLowerCase());
}

function transliterateWord(word: string): string {
  if (!word) return '';

  // Step 1: normalize all vowel-sign-like patterns to Devanagari
  for (const [pat, rep] of multiConsonantMap) {
    word = word.replace(pat, rep);
  }

  word = word.replace(/aa/gi, 'ा');
  word = word.replace(/ii/gi, 'ी').replace(/ee/gi, 'ी');
  word = word.replace(/uu/gi, 'ू').replace(/oo/gi, 'ू');
  word = word.replace(/ai/gi, 'ै');
  word = word.replace(/au/gi, 'ौ');

  // Step 2: heuristics for ambiguous 'a'
  // English 'a' before a single word-final consonant → long 'ā' (ा)
  // English word-final 'a' → long 'ā' (ा)
  // This handles: Ram→राम, Sharma→शर्मा, Prasad→प्रसाद
  // If wrong, user can type Nepali manually (auto-fill stops once Nepali field is touched)
  word = word.replace(/a([bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ])$/, 'ा$1');
  word = word.replace(/a$/, 'ा');

  // Step 3: character-by-character conversion
  let output = '';
  let i = 0;

  while (i < word.length) {
    const ch = word[i];
    const next = i + 1 < word.length ? word[i + 1] : '';

    // Already Devanagari (vowel signs or consonant)
    if ('ाीूुिेैोौृ्'.includes(ch) ||
        'कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह'.includes(ch)) {
      output += ch;
      i++;
      continue;
    }

    if (ch === 'ा') { output += 'ा'; i++; continue; }
    if (ch === 'ी') { output += 'ी'; i++; continue; }
    if (ch === 'ू') { output += 'ू'; i++; continue; }
    if (ch === 'ु') { output += 'ु'; i++; continue; }
    if (ch === 'ि') { output += 'ि'; i++; continue; }
    if (ch === 'े') { output += 'े'; i++; continue; }
    if (ch === 'ै') { output += 'ै'; i++; continue; }
    if (ch === 'ो') { output += 'ो'; i++; continue; }
    if (ch === 'ौ') { output += 'ौ'; i++; continue; }

    if (consonantMap[ch]) {
      output += consonantMap[ch];

      if (consonantMap[next] || next === 'श' || next === 'ष' || next === 'स') {
        output += DEV_JOINER;
      } else if (next === 'ा' || next === 'ी' || next === 'ू' || next === 'ु' ||
                 next === 'ि' || next === 'े' || next === 'ै' || next === 'ो' ||
                 next === 'ौ') {
        // already a vowel sign following — no implicit a
      } else if (isVowel(next)) {
        const v = next.toLowerCase();
        if (v === 'a') { /* implicit a — skip */ }
        else if (v === 'i') output += 'ि';
        else if (v === 'u') output += 'ु';
        else if (v === 'e') output += 'े';
        else if (v === 'o') output += 'ो';
        i++; // consume the vowel
      }
      i++;
      continue;
    }

    if (vowelInitMap[ch]) {
      if (output.length === 0 || output.endsWith(' ')) {
        output += vowelInitMap[ch];
      } else {
        const v = ch.toLowerCase();
        if (v === 'a') { /* inherent — already accounted for */ }
        else if (v === 'i') output += 'ि';
        else if (v === 'u') output += 'ु';
        else if (v === 'e') output += 'े';
        else if (v === 'o') output += 'ो';
      }
      i++;
      continue;
    }

    output += ch;
    i++;
  }

  return output;
}
