'use client';

import { useEffect, useState } from 'react';

type Company = {
  id: number;
  name: string;
  logo_url: string | null;
  website: string | null;
  active: boolean;
  sort_order: number;
};

export default function AdminEmpresasPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '',
    logoUrl: '',
    website: '',
    sortOrder: '0',
  });
  const [saving, setSaving] = useState(false);

  const fetchCompanies = async () => {
    try {
      const res = await fetch('/api/admin/companies');
      const data = await res.json();
      setCompanies(data.companies || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const resetForm = () => {
    setForm({ name: '', logoUrl: '', website: '', sortOrder: '0' });
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (company: Company) => {
    setForm({
      name: company.name,
      logoUrl: company.logo_url || '',
      website: company.website || '',
      sortOrder: String(company.sort_order),
    });
    setEditingId(company.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingId
        ? `/api/admin/companies/${editingId}`
        : '/api/admin/companies';
      const method = editingId ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          logoUrl: form.logoUrl || null,
          website: form.website || null,
          sortOrder: parseInt(form.sortOrder) || 0,
        }),
      });

      resetForm();
      fetchCompanies();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: number, active: boolean) => {
    await fetch(`/api/admin/companies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    });
    fetchCompanies();
  };

  const deleteCompany = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta empresa?')) return;
    await fetch(`/api/admin/companies/${id}`, { method: 'DELETE' });
    fetchCompanies();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-navy border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Empresas Aliadas</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 bg-brand-navy text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-navy-light transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Empresa
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="font-semibold text-slate-900 mb-4">
            {editingId ? 'Editar Empresa' : 'Nueva Empresa'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nombre *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy"
                placeholder="Nombre de la empresa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                URL del Logo
              </label>
              <input
                type="text"
                value={form.logoUrl}
                onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Sitio Web
              </label>
              <input
                type="text"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy"
                placeholder="https://empresa.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Orden
              </label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy"
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-brand-navy text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-navy-light transition-colors disabled:opacity-50"
              >
                {saving ? 'Guardando...' : editingId ? 'Guardar' : 'Crear'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {companies.length === 0 && !showForm ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500">No hay empresas registradas.</p>
        </div>
      ) : companies.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Website</th>
                <th className="px-6 py-3">Orden</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {company.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {company.website ? (
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-brand-navy hover:underline">
                        {company.website}
                      </a>
                    ) : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{company.sort_order}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(company.id, company.active)}
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        company.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {company.active ? 'Activa' : 'Inactiva'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(company)}
                        className="text-sm text-brand-navy hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteCompany(company.id)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
