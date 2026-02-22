'use client';

import { useState } from 'react';

type FormData = {
  fullName: string;
  email: string;
  company: string;
  teamSize: string;
  areas: string[];
};

const AREA_OPTIONS = [
  { value: 'ofimatica', label: 'Ofimática' },
  { value: 'atencion-cliente', label: 'Atención al Cliente' },
  { value: 'gerencia', label: 'Gerencia' },
];

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    company: '',
    teamSize: '',
    areas: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleArea = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      areas: prev.areas.includes(value)
        ? prev.areas.filter((a) => a !== value)
        : [...prev.areas, value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.areas.length === 0) return;
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const areasLabel = formData.areas
      .map((v) => AREA_OPTIONS.find((o) => o.value === v)?.label || v)
      .join(', ');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName.split(' ')[0] || formData.fullName,
          lastname: formData.fullName.split(' ').slice(1).join(' ') || '',
          email: formData.email,
          phone: '',
          interest: formData.areas.join(','),
          message: `Empresa: ${formData.company} | Personas: ${formData.teamSize} | Áreas: ${areasLabel}`,
          source: 'contact-modal',
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Error al enviar el formulario');

      setSubmitStatus('success');

      setTimeout(() => {
        setFormData({ fullName: '', email: '', company: '', teamSize: '', areas: [] });
        setSubmitStatus('idle');
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (submitStatus === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-slate-900">¡Gracias por contactarnos!</h2>
          <p className="text-slate-600">
            Uno de nuestros especialistas se pondrá en contacto contigo en las próximas 24 horas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <h2 className="text-brand-navy text-xl font-bold">Cotizar ahora</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
            aria-label="Cerrar modal"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <p className="mb-6 text-sm text-slate-500">
            Completa el formulario y te enviaremos una propuesta personalizada.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="modal-fullName"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Nombre y Apellido *
              </label>
              <input
                type="text"
                id="modal-fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Ej: María García"
                className="focus:ring-brand-orange/50 focus:border-brand-orange w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all duration-200 focus:ring-2 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="modal-email"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Correo Corporativo *
              </label>
              <input
                type="email"
                id="modal-email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="nombre@empresa.com"
                className="focus:ring-brand-orange/50 focus:border-brand-orange w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all duration-200 focus:ring-2 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="modal-company"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Empresa *
                </label>
                <input
                  type="text"
                  id="modal-company"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Tu empresa"
                  className="focus:ring-brand-orange/50 focus:border-brand-orange w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all duration-200 focus:ring-2 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="modal-teamSize"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Nro. personas
                </label>
                <input
                  type="text"
                  id="modal-teamSize"
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleChange}
                  placeholder="Ej: 15"
                  className="focus:ring-brand-orange/50 focus:border-brand-orange w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 transition-all duration-200 focus:ring-2 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <p className="mb-2 block text-sm font-medium text-slate-700">Áreas de Interés *</p>
              <div className="flex flex-wrap gap-2">
                {AREA_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleArea(opt.value)}
                    className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      formData.areas.includes(opt.value)
                        ? 'bg-brand-orange border-brand-orange text-white shadow-sm'
                        : 'hover:border-brand-orange/50 border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {formData.areas.length === 0 && (
                <p className="mt-1.5 text-xs text-slate-400">Selecciona al menos un área</p>
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
      </div>
    </div>
  );
}
