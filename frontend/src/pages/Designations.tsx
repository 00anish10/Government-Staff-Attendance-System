import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Designation, Department } from '../types';

export default function Designations() {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Designation | null>(null);
  const [form, setForm] = useState({ title: '', title_np: '', grade: '', pay_scale: '', department_id: '' });

  const fetchData = () => {
    Promise.all([
      api.designations.list(),
      api.departments.list(),
    ]).then(([des, deps]) => {
      setDesignations(des);
      setDepartments(deps);
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...form, pay_scale: Number(form.pay_scale), department_id: Number(form.department_id) };
      if (editing) {
        await api.designations.update(editing.id, { ...payload, is_active: editing.is_active });
      } else {
        await api.designations.create(payload);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ title: '', title_np: '', grade: '', pay_scale: '', department_id: '' });
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEdit = (d: Designation) => {
    setEditing(d);
    setForm({ title: d.title, title_np: d.title_np, grade: d.grade, pay_scale: String(d.pay_scale), department_id: String(d.department_id) });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deactivate this designation?')) return;
    try {
      await api.designations.delete(id);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nepali-blue"></div></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ title: '', title_np: '', grade: '', pay_scale: '', department_id: '' }); }}>
          {showForm ? '✕ Cancel' : '+ Add Designation'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="label">Title (English)</label>
            <input className="input" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="label">Title (Nepali)</label>
            <input className="input" required value={form.title_np} onChange={e => setForm(f => ({ ...f, title_np: e.target.value }))} />
          </div>
          <div>
            <label className="label">Grade</label>
            <input className="input" required value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))} />
          </div>
          <div>
            <label className="label">Pay Scale (NPR)</label>
            <input className="input" type="number" required value={form.pay_scale} onChange={e => setForm(f => ({ ...f, pay_scale: e.target.value }))} />
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-success w-full">{editing ? 'Update' : 'Save'}</button>
          </div>
          <div className="md:col-span-5">
            <label className="label">Department</label>
            <select className="input" required value={form.department_id} onChange={e => setForm(f => ({ ...f, department_id: e.target.value }))}>
              <option value="">Select Department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        </form>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Title</th>
                <th className="table-header">Nepali Title</th>
                <th className="table-header">Grade</th>
                <th className="table-header">Pay Scale</th>
                <th className="table-header">Department</th>
                <th className="table-header">Staff Count</th>
                <th className="table-header"></th>
              </tr>
            </thead>
            <tbody>
              {designations.map(d => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="table-cell font-medium">{d.title}</td>
                  <td className="table-cell">{d.title_np}</td>
                  <td className="table-cell">{d.grade}</td>
                  <td className="table-cell">Rs. {Number(d.pay_scale).toLocaleString()}</td>
                  <td className="table-cell">{d.department_name || '—'}</td>
                  <td className="table-cell">{d.staff_count ?? 0}</td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button className="text-nepali-blue hover:underline text-xs" onClick={() => handleEdit(d)}>Edit</button>
                      <button className="text-red-600 hover:underline text-xs" onClick={() => handleDelete(d.id)}>Deactivate</button>
                    </div>
                  </td>
                </tr>
              ))}
              {designations.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No designations found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
