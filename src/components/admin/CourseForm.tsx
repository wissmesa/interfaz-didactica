'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type CourseData = {
  id?: number;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  hours: number | null;
  requirements: string;
  audience: string;
  image: string;
  category_slug: string;
  modality_slugs: string[] | null;
  featured: boolean;
};

const CATEGORIES = [
  { slug: 'tecnologicos', name: 'Tecnológicos' },
  { slug: 'atencion-al-cliente', name: 'Atención al Cliente' },
  { slug: 'competencias-gerenciales', name: 'Competencias Gerenciales' },
  { slug: 'desarrollo-profesional', name: 'Desarrollo Profesional y Personal' },
  { slug: 'seguridad-higiene-ambiente', name: 'Seguridad, Higiene y Ambiente' },
  { slug: 'recursos-humanos', name: 'Recursos Humanos' },
];

const MODALITIES = [
  { slug: 'presencial', name: 'Presencial' },
  { slug: 'online', name: 'Online' },
  { slug: 'in-company', name: 'In-Company' },
];

export function CourseForm({ course }: { course?: CourseData }) {
  const router = useRouter();
  const isEditing = !!course?.id;

  const [form, setForm] = useState({
    slug: course?.slug || '',
    title: course?.title || '',
    excerpt: course?.excerpt || '',
    description: course?.description || '',
    hours: course?.hours || '',
    requirements: course?.requirements || '',
    audience: course?.audience || '',
    image: course?.image || '',
    categorySlug: course?.category_slug || '',
    modalitySlugs: course?.modality_slugs || [],
    featured: course?.featured || false,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleModalityToggle = (slug: string) => {
    setForm((prev) => ({
      ...prev,
      modalitySlugs: prev.modalitySlugs.includes(slug)
        ? prev.modalitySlugs.filter((s) => s !== slug)
        : [...prev.modalitySlugs, slug],
    }));
  };

  const generateSlug = () => {
    const slug = form.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setForm((prev) => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = isEditing
        ? `/api/admin/courses/${course!.id}`
        : '/api/admin/courses';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: form.slug,
          title: form.title,
          excerpt: form.excerpt || null,
          description: form.description || null,
          hours: form.hours ? parseInt(form.hours as string) : null,
          requirements: form.requirements || null,
          audience: form.audience || null,
          image: form.image || null,
          categorySlug: form.categorySlug || null,
          modalitySlugs: form.modalitySlugs,
          featured: form.featured,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push('/admin/cursos');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy transition-all text-sm';

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Título *
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            onBlur={() => !form.slug && generateSlug()}
            required
            className={inputClass}
            placeholder="Ej: Excel Avanzado (16 horas)"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Slug *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="excel-avanzado-16h"
            />
            <button
              type="button"
              onClick={generateSlug}
              className="px-3 py-2 text-xs font-medium text-brand-navy bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
            >
              Auto
            </button>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Extracto
          </label>
          <input
            type="text"
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            className={inputClass}
            placeholder="Breve descripción del curso"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Descripción
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className={inputClass}
            placeholder="Descripción detallada del curso"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Horas
          </label>
          <input
            type="number"
            name="hours"
            value={form.hours}
            onChange={handleChange}
            className={inputClass}
            placeholder="8"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Categoría
          </label>
          <select
            name="categorySlug"
            value={form.categorySlug}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Seleccionar</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Modalidades
          </label>
          <div className="flex flex-wrap gap-2">
            {MODALITIES.map((mod) => (
              <button
                key={mod.slug}
                type="button"
                onClick={() => handleModalityToggle(mod.slug)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  form.modalitySlugs.includes(mod.slug)
                    ? 'bg-brand-navy text-white border-brand-navy'
                    : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                }`}
              >
                {mod.name}
              </button>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Requisitos
          </label>
          <input
            type="text"
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            className={inputClass}
            placeholder="Ej: Conocimientos de Excel Básico"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Dirigido a
          </label>
          <input
            type="text"
            name="audience"
            value={form.audience}
            onChange={handleChange}
            className={inputClass}
            placeholder="Ej: Analistas y coordinadores"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            URL de Imagen
          </label>
          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            className={inputClass}
            placeholder="https://..."
          />
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="w-4 h-4 rounded border-slate-300 text-brand-navy focus:ring-brand-navy"
            />
            <span className="text-sm font-medium text-slate-700">Curso destacado</span>
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-navy text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-navy-light transition-colors disabled:opacity-50"
        >
          {saving ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Curso'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
