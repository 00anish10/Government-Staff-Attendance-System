import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DashboardStats, AttendanceTrend, DepartmentStat } from '../types';
import { getStatusBadgeClass, getStatusLabel } from '../utils/helpers';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trends, setTrends] = useState<AttendanceTrend[]>([]);
  const [deptStats, setDeptStats] = useState<DepartmentStat[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.dashboard.stats(),
      api.dashboard.trends(),
      api.dashboard.departments(),
      api.attendance.today(),
    ]).then(([s, t, d, a]) => {
      setStats(s);
      setTrends(t);
      setDeptStats(d);
      setTodayAttendance(a);
    }).catch(err => {
      setError(err.message);
      console.error(err);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nepali-blue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600 bg-red-50 px-6 py-4 rounded-lg">{error}</div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Staff', value: stats?.total_staff ?? 0, color: 'bg-blue-50 text-blue-600', gradient: 'from-blue-500 to-blue-600', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { label: 'Present Today', value: stats?.present_today ?? 0, color: 'bg-green-50 text-green-600', gradient: 'from-green-500 to-green-600', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Late Today', value: stats?.late_today ?? 0, color: 'bg-amber-50 text-amber-600', gradient: 'from-amber-500 to-amber-600', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Absent Today', value: stats?.absent_today ?? 0, color: 'bg-red-50 text-red-600', gradient: 'from-red-500 to-red-600', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'On Leave', value: stats?.on_leave_today ?? 0, color: 'bg-purple-50 text-purple-600', gradient: 'from-purple-500 to-purple-600', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { label: 'Pending Leaves', value: stats?.pending_leaves ?? 0, color: 'bg-amber-50 text-amber-600', gradient: 'from-amber-500 to-amber-600', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { label: 'Departments', value: stats?.department_count ?? 0, color: 'bg-indigo-50 text-indigo-600', gradient: 'from-indigo-500 to-indigo-600', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { label: 'Attendance %', value: `${stats?.attendance_percentage ?? 0}%`, color: 'bg-teal-50 text-teal-600', gradient: 'from-teal-500 to-teal-600', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className={`${card.color} rounded-xl p-5 transition-shadow hover:shadow-md`}>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm opacity-80 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Attendance Trends (Last 30 Days)</h3>
          <div className="space-y-2">
            {trends.slice(-10).map(t => {
              const present = Number(t.present);
              const late = Number(t.late);
              const absent = Number(t.absent);
              const total = Number(t.total) || 1;
              const presentPct = Math.round(((present + late) / total) * 100);
              return (
                <div key={t.date} className="flex items-center gap-3 text-sm">
                  <span className="w-24 text-gray-500 shrink-0">
                    {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden flex">
                    <div className="bg-green-500 h-full transition-all" style={{ width: `${(present / total) * 100}%` }} title={`Present: ${present}`} />
                    <div className="bg-amber-400 h-full transition-all" style={{ width: `${(late / total) * 100}%` }} title={`Late: ${late}`} />
                    <div className="bg-red-400 h-full transition-all" style={{ width: `${(absent / total) * 100}%` }} title={`Absent: ${absent}`} />
                  </div>
                  <span className="w-16 text-right font-medium shrink-0">{presentPct}%</span>
                </div>
              );
            })}
            {trends.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No attendance data yet</p>}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Department-wise Today</h3>
          <div className="space-y-3">
            {deptStats.map(d => (
              <div key={d.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                  <p className="text-sm font-medium">{d.name}</p>
                  <p className="text-xs text-gray-500">{d.total_staff} staff</p>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="badge-success">{d.present} present</span>
                  {Number(d.late) > 0 && <span className="badge-warning">{d.late} late</span>}
                  {Number(d.absent) > 0 && <span className="badge-danger">{d.absent} absent</span>}
                </div>
              </div>
            ))}
            {deptStats.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No departments</p>}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Today's Attendance</h3>
          <span className="text-xs text-gray-400">{todayAttendance.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Employee ID</th>
                <th className="table-header">Name</th>
                <th className="table-header">Department</th>
                <th className="table-header">Check In</th>
                <th className="table-header">Check Out</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {todayAttendance.map(a => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="table-cell font-mono text-xs">{a.employee_id}</td>
                  <td className="table-cell">
                    <div>
                      <p className="font-medium">{a.full_name}</p>
                      <p className="text-xs text-gray-400">{a.full_name_np}</p>
                    </div>
                  </td>
                  <td className="table-cell text-sm">{a.department_name || '—'}</td>
                  <td className="table-cell">{a.check_in ? new Date(a.check_in).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                  <td className="table-cell">{a.check_out ? new Date(a.check_out).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                  <td className="table-cell">
                    <span className={getStatusBadgeClass(a.status)}>{getStatusLabel(a.status)}</span>
                  </td>
                </tr>
              ))}
              {todayAttendance.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400 text-sm">No attendance records for today</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
