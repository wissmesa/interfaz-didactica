'use client';

import Link from 'next/link';
import { useContact } from '@/components/ClientLayout';

export function CTASection() {
  const { openContactModal } = useContact();
  return (
    <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 text-white">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold">¿Listo para Transformar tu Organización?</h2>
        <p className="mb-8 text-xl text-indigo-100">
          Descubre cómo podemos ayudarte a desarrollar el potencial de tu equipo y alcanzar tus
          objetivos empresariales
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button
            onClick={openContactModal}
            className="rounded-lg bg-white px-8 py-3 font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
          >
            Solicitar Consulta Gratuita
          </button>
          <Link
            href="/cursos"
            className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-indigo-600"
          >
            Ver Nuestros Cursos
          </Link>
        </div>

        <div className="mt-8 text-indigo-100">
          <p className="text-sm">📧 info@interfazdidactica.com | 📞 +1 (555) 123-4567</p>
        </div>
      </div>
    </section>
  );
}
