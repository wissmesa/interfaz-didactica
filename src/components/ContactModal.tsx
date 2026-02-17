'use client';

import { useState } from 'react';

type FormData = {
  fullName: string;
  email: string;
  company: string;
  teamSize: string;
  area: string;
};

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
    area: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName.split(' ')[0] || formData.fullName,
          lastname: formData.fullName.split(' ').slice(1).join(' ') || '',
          email: formData.email,
          phone: '',
          message: `Empresa: ${formData.company} | Personas: ${formData.teamSize} | Área: ${formData.area}`,
          source: 'contact-modal',
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Error al enviar el formulario');

      setSubmitStatus('success');

      setTimeout(() => {
        setFormData({ fullName: '', email: '', company: '', teamSize: '', area: '' });
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
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-slate-900">
            ¡Gracias por contactarnos!
          </h2>
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

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-brand-navy">
            Cotizar ahora
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50"
            aria-label="Cerrar modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <p className="text-slate-500 text-sm mb-6">
            Completa el formulario y te enviaremos una propuesta personalizada.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="modal-fullName" className="block text-sm font-medium text-slate-700 mb-1.5">
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
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="modal-email" className="block text-sm font-medium text-slate-700 mb-1.5">
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
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="modal-company" className="block text-sm font-medium text-slate-700 mb-1.5">
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
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all duration-200"
                />
              </div>

              <div>
                <label htmlFor="modal-teamSize" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nro. personas
                </label>
                <input
                  type="text"
                  id="modal-teamSize"
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleChange}
                  placeholder="Ej: 15"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label htmlFor="modal-area" className="block text-sm font-medium text-slate-700 mb-1.5">
                Área de Interés *
              </label>
              <select
                id="modal-area"
                name="area"
                required
                value={formData.area}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all duration-200 appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                }}
              >
                <option value="">Selecciona un área</option>
                <option value="ofimatica">Ofimática</option>
                <option value="atencion-cliente">Atención al Cliente</option>
                <option value="gerencia">Gerencia</option>
              </select>
            </div>

            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                Hubo un error al enviar. Por favor, intenta nuevamente.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-orange text-white py-3.5 rounded-lg text-base font-semibold hover:bg-brand-orange-hover transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  Enviando...
                </>
              ) : (
                'Solicitar Asesoría Gratuita'
              )}
            </button>
          </form>

          <p className="mt-4 text-xs text-slate-400 text-center">
            Al enviar este formulario, aceptas recibir comunicaciones de Interfaz Didáctica.
          </p>
        </div>
      </div>
    </div>
  );
}
