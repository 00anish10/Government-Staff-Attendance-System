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
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nepali-blue"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Staff', value: stats?.total_staff ?? 0, color: 'bg-blue-50 text-blue-600', icon: '👥' },
    { label: 'Present Today', value: stats?.present_today ?? 0, color: 'bg-green-50 text-green-600', icon: '✅' },
    { label: 'Late Today', value: stats?.late_today ?? 0, color: 'bg-amber-50 text-amber-600', icon: '⏰' },
    { label: 'Absent Today', value: stats?.absent_today ?? 0, color: 'bg-red-50 text-red-600', icon: '❌' },
    { label: 'On Leave', value: stats?.on_leave_today ?? 0, color: 'bg-purple-50 text-purple-600', icon: '🏖️' },
    { label: 'Pending Leaves', value: stats?.pending_leaves ?? 0, color: 'bg-amber-50 text-amber-600', icon: '📋' },
    { label: 'Departments', value: stats?.department_count ?? 0, color: 'bg-indigo-50 text-indigo-600', icon: '🏛️' },
    { label: 'Attendance %', value: `${stats?.attendance_percentage ?? 0}%`, color: 'bg-teal-50 text-teal-600', icon: '📊' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className={`${card.color} rounded-xl p-5`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{card.icon}</span>
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm opacity-80">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Attendance Trends (Last 30 Days)</h3>
          <div className="space-y-2">
            {trends.slice(-10).map(t => {
              const presentPct = t.total > 0 ? Math.round(((t.present + t.late) / t.total) * 100) : 0;
              return (
                <div key={t.date} className="flex items-center gap-3 text-sm">
                  <span className="w-24 text-gray-500">{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden flex">
                    <div className="bg-green-500 h-full transition-all" style={{ width: `${(t.present / t.total) * 100}%` }} />
                    <div className="bg-amber-400 h-full transition-all" style={{ width: `${(t.late / t.total) * 100}%` }} />
                    <div className="bg-red-400 h-full transition-all" style={{ width: `${(t.absent / t.total) * 100}%` }} />
                  </div>
                  <span className="w-16 text-right font-medium">{presentPct}%</span>
                </div>
              );
            })}
            {trends.length === 0 && <p className="text-gray-400 text-sm">No data available yet</p>}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Department-wise Today</h3>
          <div className="space-y-3">
            {deptStats.map(d => (
              <div key={d.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{d.name}</p>
                  <p className="text-xs text-gray-500">{d.total_staff} staff</p>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="badge-success">{d.present} present</span>
                  {d.late > 0 && <span className="badge-warning">{d.late} late</span>}
                  {d.absent > 0 && <span className="badge-danger">{d.absent} absent</span>}
                </div>
              </div>
            ))}
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
