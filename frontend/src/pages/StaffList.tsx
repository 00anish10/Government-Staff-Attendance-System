import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Staff, Department } from '../types';
import { calculateAge, getStatusBadgeClass } from '../utils/helpers';
import NepaliDatePicker from '../components/NepaliDatePicker';

export default function StaffList() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<{ id: number; title: string; title_np: string; department_id: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    employee_id: '', full_name: '', full_name_np: '', email: '', phone: '',
    address: '', date_of_birth: '', date_of_joining: '', gender: 'male' as string,
    designation_id: '', department_id: '',
  });

  const fetchStaff = () => {
    setLoading(true);
    api.staff.list({ page: pagination.page, limit: 20, search: search || undefined, department_id: deptFilter || undefined })
      .then(res => {
        setStaff(res.data);
        setPagination(res.pagination);
      }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => {
    Promise.all([
      api.departments.list(),
      api.designations.list(),
    ]).then(([depts, desigs]) => {
      setDepartments(depts);
      setDesignations(desigs);
    }).catch(console.error);
  }, []);

  const filteredDesignations = designations.filter(d =>
    !form.department_id || d.department_id === Number(form.department_id)
  );

  useEffect(() => {
    fetchStaff();
  }, [pagination.page, deptFilter]);

  const handleSearch = () => {
    setPagination(p => ({ ...p, page: 1 }));
    fetchStaff();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.staff.create({
        ...form,
        designation_id: form.designation_id ? Number(form.designation_id) : null,
        department_id: form.department_id ? Number(form.department_id) : null,
      });
      setShowForm(false);
      setForm({ employee_id: '', full_name: '', full_name_np: '', email: '', phone: '', address: '', date_of_birth: '', date_of_joining: '', gender: 'male', designation_id: '', department_id: '' });
      fetchStaff();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-1">
          <input
            className="input max-w-xs"
            placeholder="Search by name or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <select className="input max-w-[200px]" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
            <option value="">All Departments</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <button className="btn-primary btn-sm" onClick={handleSearch}>Search</button>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Staff'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Employee ID</label>
            <input className="input" required value={form.employee_id} onChange={e => setForm(f => ({ ...f, employee_id: e.target.value }))} />
          </div>
          <div>
            <label className="label">Full Name (English)</label>
            <input className="input" required value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
          </div>
          <div>
            <label className="label">Full Name (Nepali)</label>
            <input className="input" required value={form.full_name_np} onChange={e => setForm(f => ({ ...f, full_name_np: e.target.value }))} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </div>
          <div>
            <label className="label">Address</label>
            <input className="input" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
          </div>
          <NepaliDatePicker
            label="Date of Birth"
            required
            value={form.date_of_birth}
            onChange={v => setForm(f => ({ ...f, date_of_birth: v }))}
          />
          <NepaliDatePicker
            label="Date of Joining"
            required
            value={form.date_of_joining}
            onChange={v => setForm(f => ({ ...f, date_of_joining: v }))}
          />
          <div>
            <label className="label">Gender</label>
            <select className="input" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="label">Department</label>
            <select className="input" required value={form.department_id} onChange={e => { setForm(f => ({ ...f, department_id: e.target.value, designation_id: '' })); }}>
              <option value="">Select Department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Designation</label>
            <select className="input" required value={form.designation_id} onChange={e => setForm(f => ({ ...f, designation_id: e.target.value }))}>
              <option value="">Select Designation</option>
              {filteredDesignations.map(d => (
                <option key={d.id} value={d.id}>{d.title} ({d.title_np})</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-success w-full">Save Staff</button>
          </div>
        </form>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">ID</th>
                <th className="table-header">Name</th>
                <th className="table-header">Department</th>
                <th className="table-header">Designation</th>
                <th className="table-header">Email</th>
                <th className="table-header">Phone</th>
                <th className="table-header">Age</th>
                <th className="table-header">Status</th>
                <th className="table-header"></th>
              </tr>
            </thead>
            <tbody>
              {staff.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/staff/${s.id}`)}>
                  <td className="table-cell font-mono text-xs">{s.employee_id}</td>
                  <td className="table-cell">
                    <div>
                      <p className="font-medium">{s.full_name}</p>
                      <p className="text-xs text-gray-400">{s.full_name_np}</p>
                    </div>
                  </td>
                  <td className="table-cell">{s.department_name || '—'}</td>
                  <td className="table-cell">{s.designation_title || '—'}</td>
                  <td className="table-cell text-xs">{s.email}</td>
                  <td className="table-cell">{s.phone}</td>
                  <td className="table-cell">{calculateAge(s.date_of_birth)}</td>
                  <td className="table-cell">
                    <span className={s.is_active ? 'badge-success' : 'badge-danger'}>
                      {s.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <button className="text-nepali-blue hover:underline text-xs" onClick={e => { e.stopPropagation(); navigate(`/staff/${s.id}`); }}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {staff.length === 0 && (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400">No staff records found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Total: {pagination.total} staff</span>
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
