'use client';

import { useState, useEffect, useCallback } from 'react';

type Contact = {
  id: number;
  name: string;
  lastname: string | null;
  email: string;
  company: string | null;
  phone: string | null;
  position: string | null;
  notes: string | null;
  lead_id: number | null;
  created_at: string;
};

type FormData = {
  name: string;
  lastname: string;
  email: string;
  company: string;
  phone: string;
  position: string;
  notes: string;
};

const emptyForm: FormData = {
  name: '',
  lastname: '',
  email: '',
  company: '',
  phone: '',
  position: '',
  notes: '',
};

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchContacts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/contacts?${params}`);
      const data = await res.json();
      setContacts(data.contacts || []);
    } catch {
      console.error('Error fetching contacts');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  };

  const openEdit = (c: Contact) => {
    setEditingId(c.id);
    setForm({
      name: c.name,
      lastname: c.lastname || '',
      email: c.email,
      company: c.company || '',
      phone: c.phone || '',
      position: c.position || '',
      notes: c.notes || '',
    });
    setError('');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.email) {
      setError('Nombre y email son requeridos');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const url = editingId ? `/api/admin/contacts/${editingId}` : '/api/admin/contacts';
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al guardar');
        return;
      }
      setShowForm(false);
      fetchContacts();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este contacto?')) return;
    await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
    fetchContacts();
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-brand-orange h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contactos</h1>
          <p className="mt-1 text-sm text-slate-500">
            {contacts.length} contacto{contacts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-brand-orange hover:bg-brand-orange-hover rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
        >
          + Nuevo contacto
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-sm">
          <svg
            className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre, email, empresa…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="focus:ring-brand-orange/40 w-full rounded-lg border border-slate-200 py-2 pr-3 pl-9 text-sm focus:ring-2 focus:outline-none"
          />
        </div>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              {editingId ? 'Editar contacto' : 'Nuevo contacto'}
            </h2>
            {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Nombre *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="focus:ring-brand-orange/40 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Apellido</label>
                <input
                  value={form.lastname}
                  onChange={(e) => setForm({ ...form, lastname: e.target.value })}
                  className="focus:ring-brand-orange/40 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-500">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="focus:ring-brand-orange/40 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Empresa</label>
                <input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="focus:ring-brand-orange/40 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Teléfono</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="focus:ring-brand-orange/40 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-500">Cargo</label>
                <input
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  className="focus:ring-brand-orange/40 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-500">Notas</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="focus:ring-brand-orange/40 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-brand-orange hover:bg-brand-orange-hover rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
              >
                {saving ? 'Guardando…' : editingId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        {contacts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No hay contactos registrados.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-medium tracking-wider text-slate-500 uppercase">
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Empresa</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Cargo</th>
                <th className="px-4 py-3">Origen</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contacts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium whitespace-nowrap text-slate-900">
                    {c.name}
                    {c.lastname ? ` ${c.lastname}` : ''}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{c.email}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{c.company || '—'}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{c.phone || '—'}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{c.position || '—'}</td>
                  <td className="px-4 py-3">
                    {c.lead_id ? (
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                        Lead #{c.lead_id}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                        Manual
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap text-slate-500">
                    {new Date(c.created_at).toLocaleDateString('es-VE')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(c)}
                        className="hover:text-brand-orange rounded-lg p-1.5 text-slate-400 hover:bg-orange-50"
                        title="Editar"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        title="Eliminar"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
