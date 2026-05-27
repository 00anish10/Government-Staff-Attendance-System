import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Department } from '../types';

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [form, setForm] = useState({ name: '', name_np: '', code: '', description: '' });

  const fetchDepts = () => {
    api.departments.list().then(setDepartments).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchDepts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.departments.update(editing.id, { ...form, is_active: editing.is_active });
      } else {
        await api.departments.create(form);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', name_np: '', code: '', description: '' });
      fetchDepts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEdit = (d: Department) => {
    setEditing(d);
    setForm({ name: d.name, name_np: d.name_np, code: d.code, description: d.description || '' });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deactivate this department?')) return;
    try {
      await api.departments.delete(id);
      fetchDepts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nepali-blue"></div></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', name_np: '', code: '', description: '' }); }}>
          {showForm ? '✕ Cancel' : '+ Add Department'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Department Name (English)</label>
            <input className="input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="label">Department Name (Nepali)</label>
            <input className="input" required value={form.name_np} onChange={e => setForm(f => ({ ...f, name_np: e.target.value }))} />
          </div>
          <div>
            <label className="label">Code</label>
            <input className="input" required value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} />
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-success w-full">{editing ? 'Update' : 'Save'}</button>
          </div>
          <div className="md:col-span-2">
            <label className="label">Description</label>
            <textarea className="input" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map(d => (
          <div key={d.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">{d.name}</h3>
                <p className="text-sm text-gray-500">{d.name_np}</p>
              </div>
              <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{d.code}</span>
            </div>
            {d.description && <p className="text-sm text-gray-600 mb-3">{d.description}</p>}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                <strong className="text-gray-800">{d.staff_count ?? 0}</strong> staff
              </span>
              <div className="flex gap-2">
                <button className="text-nepali-blue hover:underline text-xs" onClick={() => handleEdit(d)}>Edit</button>
                <button className="text-red-600 hover:underline text-xs" onClick={() => handleDelete(d.id)}>Deactivate</button>
              </div>
            </div>
          </div>
        ))}
        {departments.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400">No departments found</div>
        )}
      </div>
    </div>
  );
}
