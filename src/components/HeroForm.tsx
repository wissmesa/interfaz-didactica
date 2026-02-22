'use client';

import { useState } from 'react';

type FormData = {
  name: string;
  lastname: string;
  email: string;
  phone: string;
  message: string;
};

export function HeroForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    lastname: '',
    email: '',
    phone: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Enviar datos a la API
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'hero-form',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar el formulario');
      }

      // Envío exitoso
      setSubmitStatus('success');

      // Resetear formulario después de 3 segundos
      setTimeout(() => {
        setFormData({
          name: '',
          lastname: '',
          email: '',
          phone: '',
          message: '',
        });
        setSubmitStatus('idle');
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
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-2xl">
        <div className="mb-4 text-6xl">✅</div>
        <h2 className="mb-2 text-2xl font-bold text-slate-900">¡Gracias por contactarnos!</h2>
        <p className="text-slate-600">
          Hemos recibido tu solicitud. Uno de nuestros especialistas se pondrá en contacto contigo
          en las próximas 24 horas.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl">
      <div className="mb-6 text-center">
        <h2 className="mb-2 text-2xl font-bold text-slate-900">
          ¿Listo para Transformar tu Equipo?
        </h2>
        <p className="text-slate-600">Obtén una consulta gratuita personalizada</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre y Apellido en la misma línea */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
              Nombre *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label htmlFor="lastname" className="mb-2 block text-sm font-medium text-slate-700">
              Apellido *
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="Tu apellido"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
            Correo electrónico *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-700">
            Teléfono *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-700">
            Mensaje (opcional)
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="Cuéntanos sobre tus necesidades específicas..."
          ></textarea>
        </div>

        {submitStatus === 'error' && (
          <div className="rounded-lg border border-red-500/50 bg-red-500/20 p-3 text-sm text-red-200">
            Hubo un error al enviar el formulario. Por favor, intenta nuevamente.
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center rounded-xl bg-orange-600 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-orange-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
              Enviando...
            </>
          ) : (
            'Solicitar Consulta Gratuita'
          )}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-xs text-slate-500">
          Al enviar este formulario, aceptas recibir comunicaciones de Interfaz Didáctica.
        </p>
      </div>
    </div>
  );
}
