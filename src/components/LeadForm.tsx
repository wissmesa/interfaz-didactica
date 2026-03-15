'use client';

import { useState, useEffect } from 'react';

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  teamSize: string;
  courseIds: string[];
};

type Course = {
  id: number;
  title: string;
  slug: string;
};

interface LeadFormProps {
  source: string;
  onSuccess?: () => void;
}

export function LeadForm({ source, onSuccess }: LeadFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    teamSize: '',
    courseIds: [],
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showCourseError, setShowCourseError] = useState(false);

  useEffect(() => {
    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => setCourses(data.courses || []))
      .catch(console.error)
      .finally(() => setLoadingCourses(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCourse = (slug: string) => {
    setShowCourseError(false);
    setFormData((prev) => ({
      ...prev,
      courseIds: prev.courseIds.includes(slug)
        ? prev.courseIds.filter((s) => s !== slug)
        : [...prev.courseIds, slug],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone.trim()) return;
    if (formData.courseIds.length === 0) {
      setShowCourseError(true);
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const selectedCourses = formData.courseIds
      .map((slug) => courses.find((c) => c.slug === slug)?.title || slug)
      .join(', ');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName.split(' ')[0] || formData.fullName,
          lastname: formData.fullName.split(' ').slice(1).join(' ') || '',
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          interest: selectedCourses,
          message: formData.teamSize ? `Personas: ${formData.teamSize}` : null,
          source,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Error al enviar el formulario');

      setSubmitStatus('success');

      setTimeout(() => {
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          company: '',
          teamSize: '',
          courseIds: [],
        });
        setSubmitStatus('idle');
        onSuccess?.();
      }, 3000);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-bold text-slate-900">¡Gracias por contactarnos!</h3>
        <p className="text-slate-600">
          Uno de nuestros especialistas se pondrá en contacto contigo en las próximas 24 horas.
        </p>
      </div>
    );
  }

  const inputClass =
    'focus:ring-brand-orange/50 focus:border-brand-orange w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all duration-200 focus:ring-2 focus:outline-none';

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor={`${source}-fullName`} className="mb-1.5 block text-sm font-medium text-slate-700">
            Nombre y Apellido *
          </label>
          <input
            type="text"
            id={`${source}-fullName`}
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Ej: María García"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor={`${source}-email`} className="mb-1.5 block text-sm font-medium text-slate-700">
            Correo Corporativo *
          </label>
          <input
            type="email"
            id={`${source}-email`}
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="nombre@empresa.com"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor={`${source}-phone`} className="mb-1.5 block text-sm font-medium text-slate-700">
            Teléfono de contacto *
          </label>
          <input
            type="tel"
            id={`${source}-phone`}
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="Ej: 0412-555-0000"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${source}-company`} className="mb-1.5 block text-sm font-medium text-slate-700">
              Empresa *
            </label>
            <input
              type="text"
              id={`${source}-company`}
              name="company"
              required
              value={formData.company}
              onChange={handleChange}
              placeholder="Tu empresa"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor={`${source}-teamSize`} className="mb-1.5 block text-sm font-medium text-slate-700">
              Nro. personas
            </label>
            <input
              type="text"
              id={`${source}-teamSize`}
              name="teamSize"
              value={formData.teamSize}
              onChange={handleChange}
              placeholder="Ej: 15"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <p className="mb-2 block text-sm font-medium text-slate-700">Cursos de interés *</p>
          {loadingCourses ? (
            <div className="flex items-center gap-2 py-3 text-sm text-slate-400">
              <div className="border-brand-navy h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
              Cargando cursos...
            </div>
          ) : (
            <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto">
              {courses.map((course) => (
                <button
                  key={course.slug}
                  type="button"
                  onClick={() => toggleCourse(course.slug)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    formData.courseIds.includes(course.slug)
                      ? 'bg-brand-orange border-brand-orange text-white shadow-sm'
                      : 'hover:border-brand-orange/50 border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  {course.title}
                </button>
              ))}
            </div>
          )}
          {formData.courseIds.length === 0 && !loadingCourses && (
            <p className={`mt-1.5 text-xs ${showCourseError ? 'font-medium text-red-500' : 'text-slate-400'}`}>
              {showCourseError
                ? 'Debes seleccionar al menos un curso para continuar'
                : 'Selecciona al menos un curso'}
            </p>
          )}
        </div>

        {submitStatus === 'error' && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            Hubo un error al enviar. Por favor, intenta nuevamente.
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-brand-orange hover:bg-brand-orange-hover flex w-full items-center justify-center gap-2 rounded-lg py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Enviando...
            </>
          ) : (
            'Solicitar Asesoría Gratuita'
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-slate-400">
        Al enviar este formulario, aceptas recibir comunicaciones de Interfaz Didáctica.
      </p>
    </div>
  );
}
