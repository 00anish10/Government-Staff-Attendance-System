import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Attendance } from '../types';
import { getStatusBadgeClass, getStatusLabel, formatTime, getTodayDate } from '../utils/helpers';
import NepaliDatePicker from '../components/NepaliDatePicker';

export default function AttendanceList() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(getTodayDate());
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [showMarkForm, setShowMarkForm] = useState(false);
  const [showCheckinPanel, setShowCheckinPanel] = useState(false);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [markForm, setMarkForm] = useState({ staff_id: '', status: 'present', check_in: '', check_out: '', remarks: '' });
  const [checkinStaffId, setCheckinStaffId] = useState('');
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [checkinMsg, setCheckinMsg] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [markSubmitting, setMarkSubmitting] = useState(false);

  const fetchRecords = () => {
    setLoading(true);
    api.attendance.list({
      page: pagination.page, limit: 30,
      date: date || undefined,
      status: statusFilter || undefined,
    }).then(res => {
      setRecords(res.data);
      setPagination(res.pagination);
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => {
    api.staff.list({ limit: 200 }).then(res => setStaffList(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [pagination.page, statusFilter]);

  const handleDateSearch = () => {
    setPagination(p => ({ ...p, page: 1 }));
    fetchRecords();
  };

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!markForm.staff_id) {
      alert('Please select a staff member');
      return;
    }
    setMarkSubmitting(true);
    try {
      const checkInTime = markForm.check_in ? `${date}T${markForm.check_in}:00` : null;
      const checkOutTime = markForm.check_out ? `${date}T${markForm.check_out}:00` : null;
      await api.attendance.mark({
        staff_id: Number(markForm.staff_id),
        date, status: markForm.status,
        check_in: checkInTime, check_out: checkOutTime,
        remarks: markForm.remarks || undefined,
      });
      setShowMarkForm(false);
      setMarkForm({ staff_id: '', status: 'present', check_in: '', check_out: '', remarks: '' });
      fetchRecords();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setMarkSubmitting(false);
    }
  };

  const handleQuickCheckin = async () => {
    if (!checkinStaffId) return;
    setCheckinLoading(true);
    setCheckinMsg('');
    try {
      await api.attendance.checkIn(Number(checkinStaffId));
      setCheckinMsg('Check-in successful!');
      setCheckinStaffId('');
      fetchRecords();
    } catch (err: any) {
      setCheckinMsg(err.message);
    } finally {
      setCheckinLoading(false);
      setTimeout(() => setCheckinMsg(''), 3000);
    }
  };

  const handleQuickCheckout = async (staffId: number) => {
    if (!confirm('Check out this staff member?')) return;
    setActionLoading(staffId);
    try {
      await api.attendance.checkOut(staffId);
      fetchRecords();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const exportCSV = () => {
    const headers = ['Date', 'Employee ID', 'Name', 'Department', 'Designation', 'Check In', 'Check Out', 'Status', 'Remarks'];
    const rows = records.map(r => [
      r.date,
      r.employee_id || '',
      r.staff_name || '',
      r.department_name || '',
      r.designation_title || '',
      r.check_in ? new Date(r.check_in).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
      r.check_out ? new Date(r.check_out).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
      r.status,
      r.remarks || '',
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const todayStr = getTodayDate();
  const isToday = date === todayStr;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <NepaliDatePicker className="max-w-[200px]" value={date} onChange={v => { setDate(v); setPagination(p => ({ ...p, page: 1 })); }} />
          <select className="input max-w-[150px]" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="leave">On Leave</option>
          </select>
          <button className="btn-primary btn-sm" onClick={handleDateSearch}>Filter</button>
        </div>
        <div className="flex gap-2">
          {isToday && (
            <button className="btn-success btn-sm" onClick={() => setShowCheckinPanel(!showCheckinPanel)}>
              {showCheckinPanel ? 'Close' : 'Quick Check-in'}
            </button>
          )}
          <button className="btn-outline btn-sm" onClick={exportCSV} disabled={records.length === 0}>
            Export CSV
          </button>
          <button className="btn-primary" onClick={() => setShowMarkForm(!showMarkForm)}>
            {showMarkForm ? 'Cancel' : '+ Mark Attendance'}
          </button>
        </div>
      </div>

      {showCheckinPanel && isToday && (
        <div className="card flex items-end gap-3">
          <div className="flex-1">
            <label className="label">Staff Member</label>
            <select className="input" value={checkinStaffId} onChange={e => setCheckinStaffId(e.target.value)}>
              <option value="">Select staff to check in...</option>
              {staffList.map(s => (
                <option key={s.id} value={s.id} disabled={records.some(r => r.staff_id === s.id)}>
                  {s.employee_id} - {s.full_name} {records.some(r => r.staff_id === s.id) ? '(already recorded)' : ''}
                </option>
              ))}
            </select>
          </div>
          <button className="btn-success" disabled={!checkinStaffId || checkinLoading} onClick={handleQuickCheckin}>
            {checkinLoading ? 'Checking in...' : 'Check In'}
          </button>
          {checkinMsg && (
            <span className={`text-sm ${checkinMsg.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
              {checkinMsg}
            </span>
          )}
        </div>
      )}

      {showMarkForm && (
        <form onSubmit={handleMarkAttendance} className="card grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Staff Member</label>
            <select className="input" required value={markForm.staff_id} onChange={e => setMarkForm(f => ({ ...f, staff_id: e.target.value }))}>
              <option value="">Select Staff</option>
              {staffList.map(s => <option key={s.id} value={s.id}>{s.employee_id} - {s.full_name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={markForm.status} onChange={e => setMarkForm(f => ({ ...f, status: e.target.value }))}>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="half-day">Half Day</option>
              <option value="leave">Leave</option>
              <option value="holiday">Holiday</option>
            </select>
          </div>
          <div>
            <label className="label">Check In Time</label>
            <input className="input" type="time" value={markForm.check_in} onChange={e => setMarkForm(f => ({ ...f, check_in: e.target.value }))} />
          </div>
          <div>
            <label className="label">Check Out Time</label>
            <input className="input" type="time" value={markForm.check_out} onChange={e => setMarkForm(f => ({ ...f, check_out: e.target.value }))} />
          </div>
          <div>
            <label className="label">Remarks</label>
            <input className="input" value={markForm.remarks} onChange={e => setMarkForm(f => ({ ...f, remarks: e.target.value }))} />
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-success w-full" disabled={markSubmitting}>
              {markSubmitting ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </form>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Date</th>
                <th className="table-header">Employee</th>
                <th className="table-header">Department</th>
                <th className="table-header">Designation</th>
                <th className="table-header">Check In</th>
                <th className="table-header">Check Out</th>
                <th className="table-header">Status</th>
                <th className="table-header">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="table-cell text-sm">{new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td className="table-cell">
                    <div>
                      <p className="font-medium">{r.staff_name}</p>
                      <p className="text-xs text-gray-400">{r.employee_id}</p>
                    </div>
                  </td>
                  <td className="table-cell text-sm">{r.department_name || '—'}</td>
                  <td className="table-cell text-sm">{r.designation_title || '—'}</td>
                  <td className="table-cell">{formatTime(r.check_in)}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <span>{formatTime(r.check_out)}</span>
                      {isToday && r.check_in && !r.check_out && (
                        <button className="text-xs text-nepali-blue hover:underline" disabled={actionLoading === r.id}
                          onClick={() => handleQuickCheckout(r.staff_id)}>
                          {actionLoading === r.id ? '...' : 'Check Out'}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={getStatusBadgeClass(r.status)}>{getStatusLabel(r.status)}</span>
                  </td>
                  <td className="table-cell text-xs text-gray-500">{r.remarks || '—'}</td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">No attendance records found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Total: {pagination.total} records</span>
          <div className="flex gap-2">
            <button className="btn-outline btn-sm" disabled={pagination.page <= 1}
              onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}>Previous</button>
            <span className="px-3 py-1.5 text-gray-600">Page {pagination.page} of {pagination.totalPages}</span>
            <button className="btn-outline btn-sm" disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
