'use client';

import { useEffect, useState } from 'react';

type Testimonial = {
  id: number;
  name: string;
  position: string | null;
  company: string | null;
  content: string;
  rating: number;
  initials: string | null;
  active: boolean;
  sort_order: number;
};

export default function AdminResenasPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '',
    position: '',
    company: '',
    content: '',
    rating: '5',
    initials: '',
    sortOrder: '0',
  });
  const [saving, setSaving] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/admin/testimonials');
      const data = await res.json();
      setTestimonials(data.testimonials || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const resetForm = () => {
    setForm({ name: '', position: '', company: '', content: '', rating: '5', initials: '', sortOrder: '0' });
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (t: Testimonial) => {
    setForm({
      name: t.name,
      position: t.position || '',
      company: t.company || '',
      content: t.content,
      rating: String(t.rating),
      initials: t.initials || '',
      sortOrder: String(t.sort_order),
    });
    setEditingId(t.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingId
        ? `/api/admin/testimonials/${editingId}`
        : '/api/admin/testimonials';
      const method = editingId ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          position: form.position || null,
          company: form.company || null,
          content: form.content,
          rating: parseInt(form.rating),
          initials: form.initials || null,
          sortOrder: parseInt(form.sortOrder) || 0,
        }),
      });

      resetForm();
      fetchTestimonials();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: number, active: boolean) => {
    await fetch(`/api/admin/testimonials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    });
    fetchTestimonials();
  };

  const deleteTestimonial = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta reseña?')) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
    fetchTestimonials();
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
        <h1 className="text-2xl font-bold text-slate-900">Reseñas</h1>
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
          Nueva Reseña
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="font-semibold text-slate-900 mb-4">
            {editingId ? 'Editar Reseña' : 'Nueva Reseña'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy"
                  placeholder="María González"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Iniciales</label>
                <input
                  type="text"
                  value={form.initials}
                  onChange={(e) => setForm({ ...form, initials: e.target.value })}
                  maxLength={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy"
                  placeholder="MG"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Cargo</label>
                <input
                  type="text"
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy"
                  placeholder="Directora de RRHH"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Empresa</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy"
                  placeholder="TechCorp Venezuela"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Contenido *</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy"
                placeholder="La experiencia fue excelente..."
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Rating (1-5)</label>
                <select
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{r} estrella{r > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Orden</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy"
                />
              </div>
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

      {testimonials.length === 0 && !showForm ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500">No hay reseñas registradas.</p>
        </div>
      ) : testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-navy flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {t.initials || t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">
                      {[t.position, t.company].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-600 italic mb-4 line-clamp-3">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <button
                  onClick={() => toggleActive(t.id, t.active)}
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    t.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {t.active ? 'Activa' : 'Inactiva'}
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={() => startEdit(t)} className="text-xs text-brand-navy hover:underline">
                    Editar
                  </button>
                  <button onClick={() => deleteTestimonial(t.id)} className="text-xs text-red-600 hover:underline">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
