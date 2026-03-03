'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type ContentModule = {
  title: string;
  topics: string[];
  dynamic: string;
};

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
  general_objective: string;
  specific_objectives: string[];
  methodology: string;
  benefits: string[];
  content_modules: ContentModule[];
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
    generalObjective: course?.general_objective || '',
    specificObjectives: course?.specific_objectives?.length ? course.specific_objectives : [''],
    methodology: course?.methodology || '',
    benefits: course?.benefits?.length ? course.benefits : [''],
    contentModules: course?.content_modules?.length
      ? course.content_modules.map((m) => ({ ...m, dynamic: m.dynamic || '' }))
      : [{ title: '', topics: [''], dynamic: '' }],
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

  // --- Dynamic list helpers ---
  const updateListItem = (
    field: 'specificObjectives' | 'benefits',
    index: number,
    value: string
  ) => {
    setForm((prev) => {
      const list = [...prev[field]];
      list[index] = value;
      return { ...prev, [field]: list };
    });
  };

  const addListItem = (field: 'specificObjectives' | 'benefits') => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeListItem = (field: 'specificObjectives' | 'benefits', index: number) => {
    setForm((prev) => {
      const list = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: list.length ? list : [''] };
    });
  };

  // --- Module helpers ---
  const updateModuleTitle = (index: number, title: string) => {
    setForm((prev) => {
      const modules = [...prev.contentModules];
      modules[index] = { ...modules[index], title };
      return { ...prev, contentModules: modules };
    });
  };

  const addModule = () => {
    setForm((prev) => ({
      ...prev,
      contentModules: [...prev.contentModules, { title: '', topics: [''], dynamic: '' }],
    }));
  };

  const removeModule = (index: number) => {
    setForm((prev) => {
      const modules = prev.contentModules.filter((_, i) => i !== index);
      return {
        ...prev,
        contentModules: modules.length ? modules : [{ title: '', topics: [''], dynamic: '' }],
      };
    });
  };

  const updateModuleDynamic = (index: number, dynamic: string) => {
    setForm((prev) => {
      const modules = [...prev.contentModules];
      modules[index] = { ...modules[index], dynamic };
      return { ...prev, contentModules: modules };
    });
  };

  const updateModuleTopic = (modIndex: number, topicIndex: number, value: string) => {
    setForm((prev) => {
      const modules = [...prev.contentModules];
      const topics = [...modules[modIndex].topics];
      topics[topicIndex] = value;
      modules[modIndex] = { ...modules[modIndex], topics };
      return { ...prev, contentModules: modules };
    });
  };

  const addModuleTopic = (modIndex: number) => {
    setForm((prev) => {
      const modules = [...prev.contentModules];
      modules[modIndex] = {
        ...modules[modIndex],
        topics: [...modules[modIndex].topics, ''],
      };
      return { ...prev, contentModules: modules };
    });
  };

  const removeModuleTopic = (modIndex: number, topicIndex: number) => {
    setForm((prev) => {
      const modules = [...prev.contentModules];
      const topics = modules[modIndex].topics.filter((_, i) => i !== topicIndex);
      modules[modIndex] = {
        ...modules[modIndex],
        topics: topics.length ? topics : [''],
      };
      return { ...prev, contentModules: modules };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const cleanList = (items: string[]) => items.filter((s) => s.trim() !== '');
    const cleanModules = (modules: ContentModule[]) =>
      modules
        .filter((m) => m.title.trim() !== '' || m.topics.some((t) => t.trim() !== ''))
        .map((m) => ({
          title: m.title.trim(),
          topics: m.topics.filter((t) => t.trim() !== ''),
          dynamic: m.dynamic.trim(),
        }));

    try {
      const url = isEditing ? `/api/admin/courses/${course!.id}` : '/api/admin/courses';
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
          generalObjective: form.generalObjective || null,
          specificObjectives: cleanList(form.specificObjectives),
          methodology: form.methodology || null,
          benefits: cleanList(form.benefits),
          contentModules: cleanModules(form.contentModules),
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

  const sectionTitle = (label: string) => (
    <h3 className="col-span-full border-b border-slate-200 pb-2 text-sm font-bold tracking-wider text-slate-500 uppercase">
      {label}
    </h3>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {/* ── Info básica ── */}
      <div className="space-y-4">
        {sectionTitle('Información básica')}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Título *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              onBlur={() => !form.slug && generateSlug()}
              required
              className={inputClass}
              placeholder="Ej: Atención al Cliente y Calidad de Servicio"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Slug *</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="atencion-al-cliente-calidad-de-servicio"
              />
              <button
                type="button"
                onClick={generateSlug}
                className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium whitespace-nowrap text-slate-700 transition-colors hover:bg-slate-200"
              >
                Auto
              </button>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Extracto</label>
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
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className={inputClass}
              placeholder="Descripción detallada del curso"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Horas</label>
            <input
              type="number"
              name="hours"
              value={form.hours}
              onChange={handleChange}
              className={inputClass}
              placeholder="16"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Categoría</label>
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
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Modalidades</label>
            <div className="flex flex-wrap gap-2">
              {MODALITIES.map((mod) => (
                <button
                  key={mod.slug}
                  type="button"
                  onClick={() => handleModalityToggle(mod.slug)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    form.modalitySlugs.includes(mod.slug)
                      ? 'border-brand-navy bg-brand-navy text-white'
                      : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                  }`}
                >
                  {mod.name}
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Requisitos</label>
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
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Dirigido a</label>
            <textarea
              name="audience"
              value={form.audience}
              onChange={handleChange}
              rows={2}
              className={inputClass}
              placeholder="Ej: Todas aquellas personas que atienden a los clientes y sus requerimientos."
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">URL de Imagen</label>
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
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="text-brand-navy focus:ring-brand-navy h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm font-medium text-slate-700">Curso destacado</span>
            </label>
          </div>
        </div>
      </div>

      {/* ── Objetivos ── */}
      <div className="space-y-4">
        {sectionTitle('Objetivos')}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Objetivo General
          </label>
          <textarea
            name="generalObjective"
            value={form.generalObjective}
            onChange={handleChange}
            rows={3}
            className={inputClass}
            placeholder="Ej: Identificar la atención al cliente como un factor diferenciador importante..."
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Objetivos Específicos
          </label>
          <div className="space-y-2">
            {form.specificObjectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-2.5 text-xs font-semibold text-slate-400">{i + 1}.</span>
                <input
                  type="text"
                  value={obj}
                  onChange={(e) => updateListItem('specificObjectives', i, e.target.value)}
                  className={inputClass}
                  placeholder={`Objetivo específico ${i + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeListItem('specificObjectives', i)}
                  className="mt-1.5 shrink-0 rounded p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  title="Eliminar"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addListItem('specificObjectives')}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Agregar objetivo
          </button>
        </div>
      </div>

      {/* ── Metodología ── */}
      <div className="space-y-4">
        {sectionTitle('Metodología')}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Metodología de Aprendizaje
          </label>
          <textarea
            name="methodology"
            value={form.methodology}
            onChange={handleChange}
            rows={3}
            className={inputClass}
            placeholder="Ej: Basándose en el principio de Aprender Haciendo..."
          />
        </div>
      </div>

      {/* ── Beneficios ── */}
      <div className="space-y-4">
        {sectionTitle('Beneficios para los Participantes')}
        <div className="space-y-2">
          {form.benefits.map((b, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-2.5 text-xs font-semibold text-slate-400">{i + 1}.</span>
              <input
                type="text"
                value={b}
                onChange={(e) => updateListItem('benefits', i, e.target.value)}
                className={inputClass}
                placeholder={`Beneficio ${i + 1}`}
              />
              <button
                type="button"
                onClick={() => removeListItem('benefits', i)}
                className="mt-1.5 shrink-0 rounded p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                title="Eliminar"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addListItem('benefits')}
          className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar beneficio
        </button>
      </div>

      {/* ── Contenido Programático (Módulos) ── */}
      <div className="space-y-4">
        {sectionTitle('Contenido Programático')}
        <div className="space-y-6">
          {form.contentModules.map((mod, modIdx) => (
            <div key={modIdx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Módulo {modIdx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeModule(modIdx)}
                  className="rounded p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  title="Eliminar módulo"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>

              <input
                type="text"
                value={mod.title}
                onChange={(e) => updateModuleTitle(modIdx, e.target.value)}
                className={inputClass}
                placeholder={`Ej: Módulo ${modIdx + 1}: Relación Interpersonal`}
              />

              <div className="mt-3 space-y-2 pl-4">
                <label className="block text-xs font-medium text-slate-500">Temas</label>
                {mod.topics.map((topic, topicIdx) => (
                  <div key={topicIdx} className="flex items-start gap-2">
                    <span className="mt-2.5 text-[10px] text-slate-400">●</span>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => updateModuleTopic(modIdx, topicIdx, e.target.value)}
                      className={inputClass}
                      placeholder={`Tema ${topicIdx + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeModuleTopic(modIdx, topicIdx)}
                      className="mt-1.5 shrink-0 rounded p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      title="Eliminar tema"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addModuleTopic(modIdx)}
                  className="inline-flex items-center gap-1 rounded bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500 shadow-sm transition-colors hover:bg-slate-100"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Agregar tema
                </button>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-slate-500">
                  Dinámica / Actividad
                </label>
                <input
                  type="text"
                  value={mod.dynamic}
                  onChange={(e) => updateModuleDynamic(modIdx, e.target.value)}
                  className={inputClass}
                  placeholder="Ej: Comunicación oral y corporal - Empatía"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addModule}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-slate-400 hover:bg-slate-50"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar módulo
        </button>
      </div>

      {/* ── Errores y acciones ── */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 border-t border-slate-200 pt-6">
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-navy hover:bg-brand-navy-light rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"
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
