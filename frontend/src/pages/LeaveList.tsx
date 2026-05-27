import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LeaveRequest } from '../types';
import { getStatusBadgeClass, getStatusLabel, getLeaveTypeLabel, formatDateShort } from '../utils/helpers';
import NepaliDatePicker from '../components/NepaliDatePicker';

export default function LeaveList() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [form, setForm] = useState({ staff_id: '', leave_type: 'annual', start_date: '', end_date: '', reason: '' });
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchLeaves = () => {
    setLoading(true);
    api.leaves.list({ page: pagination.page, limit: 20, status: statusFilter || undefined })
      .then(res => {
        setLeaves(res.data);
        setPagination(res.pagination);
      }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => {
    api.staff.list({ limit: 200 }).then(res => setStaffList(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [pagination.page, statusFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.leaves.create({ ...form, staff_id: Number(form.staff_id) });
      setShowForm(false);
      setForm({ staff_id: '', leave_type: 'annual', start_date: '', end_date: '', reason: '' });
      fetchLeaves();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try {
      await api.leaves.approve(id, 1);
      fetchLeaves();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt('Enter rejection reason:');
    setActionLoading(id);
    try {
      await api.leaves.reject(id, 1, reason || undefined);
      fetchLeaves();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <select className="input max-w-[180px]" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ New Leave Request'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="label">Staff</label>
            <select className="input" required value={form.staff_id} onChange={e => setForm(f => ({ ...f, staff_id: e.target.value }))}>
              <option value="">Select Staff</option>
              {staffList.map(s => <option key={s.id} value={s.id}>{s.employee_id} - {s.full_name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Leave Type</label>
            <select className="input" value={form.leave_type} onChange={e => setForm(f => ({ ...f, leave_type: e.target.value }))}>
              <option value="annual">Annual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="personal">Personal Leave</option>
              <option value="maternity">Maternity Leave</option>
              <option value="paternity">Paternity Leave</option>
              <option value="other">Other</option>
            </select>
          </div>
          <NepaliDatePicker label="Start Date" required value={form.start_date} onChange={v => setForm(f => ({ ...f, start_date: v }))} />
          <NepaliDatePicker label="End Date" required value={form.end_date} onChange={v => setForm(f => ({ ...f, end_date: v }))} />
          <div className="flex items-end">
            <button type="submit" className="btn-success w-full">Submit</button>
          </div>
          <div className="md:col-span-5">
            <label className="label">Reason</label>
            <textarea className="input" rows={2} required value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} />
          </div>
        </form>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Staff</th>
                <th className="table-header">Department</th>
                <th className="table-header">Leave Type</th>
                <th className="table-header">Duration</th>
                <th className="table-header">Days</th>
                <th className="table-header">Reason</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map(l => {
                const start = new Date(l.start_date);
                const end = new Date(l.end_date);
                const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

                return (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <p className="font-medium">{l.staff_name}</p>
                      <p className="text-xs text-gray-400">{l.employee_id}</p>
                    </td>
                    <td className="table-cell text-sm">{l.department_name || '—'}</td>
                    <td className="table-cell text-sm">{getLeaveTypeLabel(l.leave_type)}</td>
                    <td className="table-cell text-sm">
                      {formatDateShort(l.start_date)} - {formatDateShort(l.end_date)}
                    </td>
                    <td className="table-cell font-medium">{days}</td>
                    <td className="table-cell text-sm max-w-[200px] truncate">{l.reason}</td>
                    <td className="table-cell">
                      <span className={getStatusBadgeClass(l.status)}>{getStatusLabel(l.status)}</span>
                    </td>
                    <td className="table-cell">
                      {l.status === 'pending' && (
                        <div className="flex gap-2">
                          <button className="btn-success btn-sm" disabled={actionLoading === l.id}
                            onClick={() => handleApprove(l.id)}>Approve</button>
                          <button className="btn-danger btn-sm" disabled={actionLoading === l.id}
                            onClick={() => handleReject(l.id)}>Reject</button>
                        </div>
                      )}
                      {l.status !== 'pending' && (
                        <span className="text-xs text-gray-400">{l.approver_name ? `by ${l.approver_name}` : ''}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {leaves.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">No leave requests found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Total: {pagination.total} requests</span>
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
