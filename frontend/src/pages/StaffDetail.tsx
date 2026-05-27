import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Staff, Attendance } from '../types';
import { formatDate, formatDateWithBs, getStatusBadgeClass, getStatusLabel, calculateAge } from '../utils/helpers';

export default function StaffDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.staff.get(Number(id)),
      api.attendance.staffHistory(Number(id), 30),
    ]).then(([s, a]) => {
      setStaff(s);
      setAttendance(a);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nepali-blue"></div></div>;
  }

  if (!staff) {
    return <div className="text-center py-12 text-gray-500">Staff not found</div>;
  }

  const presentCount = attendance.filter(a => a.status === 'present').length;
  const lateCount = attendance.filter(a => a.status === 'late').length;
  const absentCount = attendance.filter(a => a.status === 'absent').length;

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/staff')} className="text-nepali-blue hover:underline text-sm">&larr; Back to Staff</button>

      <div className="card">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-nepali-blue/10 flex items-center justify-center text-3xl font-bold text-nepali-blue shrink-0">
            {staff.full_name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">{staff.full_name}</h2>
                <p className="text-gray-500">{staff.full_name_np}</p>
                <p className="text-sm text-gray-400 mt-1">Employee ID: {staff.employee_id}</p>
              </div>
              <span className={staff.is_active ? 'badge-success' : 'badge-danger'}>
                {staff.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div>
                <p className="text-xs text-gray-400">Department</p>
                <p className="font-medium">{staff.department_name || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Designation</p>
                <p className="font-medium">{staff.designation_title || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="font-medium">{staff.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="font-medium">{staff.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Date of Birth</p>
                <p className="font-medium">{formatDateWithBs(staff.date_of_birth)}</p>
                <p className="text-xs text-gray-400">({calculateAge(staff.date_of_birth)} yrs)</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Date of Joining</p>
                <p className="font-medium">{formatDateWithBs(staff.date_of_joining)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Gender</p>
                <p className="font-medium capitalize">{staff.gender}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Address</p>
                <p className="font-medium">{staff.address || '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-600">{presentCount}</p>
          <p className="text-sm text-gray-500">Present</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-amber-600">{lateCount}</p>
          <p className="text-sm text-gray-500">Late</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-red-600">{absentCount}</p>
          <p className="text-sm text-gray-500">Absent</p>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">Recent Attendance (Last 30 Days)</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Date</th>
                <th className="table-header">Check In</th>
                <th className="table-header">Check Out</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(a => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="table-cell">{formatDate(a.date)}</td>
                  <td className="table-cell">
                    {a.check_in ? new Date(a.check_in).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td className="table-cell">
                    {a.check_out ? new Date(a.check_out).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td className="table-cell">
                    <span className={getStatusBadgeClass(a.status)}>{getStatusLabel(a.status)}</span>
                  </td>
                </tr>
              ))}
              {attendance.length === 0 && (
                <tr><td colSpan={4} className="text-center py-8 text-gray-400">No attendance records</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
