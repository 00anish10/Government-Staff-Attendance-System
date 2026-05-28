import { useState, useEffect } from 'react';
import {
  getBsYearRange, getDaysInBsMonth, bsMonthList,
  bsToAdDateStr, adDateStrToBs, getTodayBs,
} from '../utils/nepaliDate';

interface Props {
  value: string;
  onChange: (adDate: string) => void;
  label?: string;
  required?: boolean;
  className?: string;
}

export default function NepaliDatePicker({ value, onChange, label, required, className }: Props) {
  const today = getTodayBs();
  const initial = value ? adDateStrToBs(value) : null;

  const [bsYear, setBsYear] = useState(initial?.year ?? today?.year ?? 2080);
  const [bsMonth, setBsMonth] = useState(initial?.month ?? today?.month ?? 1);
  const [bsDay, setBsDay] = useState(initial?.day ?? today?.day ?? 1);
  const [open, setOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const years = getBsYearRange();
  const maxDay = getDaysInBsMonth(bsYear, bsMonth);

  useEffect(() => {
    if (bsDay > maxDay) {
      setBsDay(maxDay);
    }
  }, [bsYear, bsMonth, maxDay, bsDay]);

  const emitChange = (y: number, m: number, d: number) => {
    const ad = bsToAdDateStr(y, m, d);
    if (ad) onChange(ad);
    setHasInteracted(true);
  };

  const handleYearChange = (y: number) => {
    setBsYear(y);
    emitChange(y, bsMonth, Math.min(bsDay, getDaysInBsMonth(y, bsMonth)));
  };

  const handleMonthChange = (m: number) => {
    setBsMonth(m);
    const max = getDaysInBsMonth(bsYear, m);
    const day = Math.min(bsDay, max);
    setBsDay(day);
    emitChange(bsYear, m, day);
  };

  const handleDayChange = (d: number) => {
    setBsDay(d);
    emitChange(bsYear, bsMonth, d);
  };

  const displayText = value
    ? `${bsYear}/${String(bsMonth).padStart(2, '0')}/${String(bsDay).padStart(2, '0')} BS`
    : '';

  const displayNp = value
    ? `${bsDay} ${bsMonthList[bsMonth - 1]?.[0] || ''} ${bsYear}`
    : '';

  return (
    <div className={className}>
      {label && (
        <label className="label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          className="input text-left flex items-center justify-between"
          onClick={() => setOpen(!open)}
        >
          <span className={value ? 'text-gray-800' : 'text-gray-400'}>
            {value ? `${displayNp}` : 'Select Nepali date...'}
          </span>
          <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-semibold">Year</label>
                <select
                  className="input text-sm"
                  value={bsYear}
                  onChange={e => handleYearChange(Number(e.target.value))}
                >
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase font-semibold">Month</label>
                <select
                  className="input text-sm"
                  value={bsMonth}
                  onChange={e => handleMonthChange(Number(e.target.value))}
                >
                  {bsMonthList.map((m, i) => (
                    <option key={i} value={i + 1}>{m[0]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase font-semibold">Day</label>
                <select
                  className="input text-sm"
                  value={Math.min(bsDay, maxDay)}
                  onChange={e => handleDayChange(Number(e.target.value))}
                >
                  {Array.from({ length: maxDay }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2">
              <span className="text-xs text-gray-400">{displayText}</span>
              <button
                type="button"
                className="text-xs text-nepali-blue font-medium hover:underline"
                onClick={() => {
                  const t = getTodayBs();
                  if (t) {
                    handleYearChange(t.year);
                    handleMonthChange(t.month);
                    setBsDay(t.day);
                  }
                  setOpen(false);
                }}
              >
                Today
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
