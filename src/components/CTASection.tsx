'use client';

import Link from 'next/link';
import { useContact } from '@/components/ClientLayout';

export function CTASection() {
const { openContactModal } = useContact();
return (
<section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
<div className="max-w-4xl mx-auto px-4 text-center">
<h2 className="text-3xl font-bold mb-4">
¿Listo para Transformar tu Organización?
</h2>
<p className="text-xl text-indigo-100 mb-8">
Descubre cómo podemos ayudarte a desarrollar el potencial de tu equipo y
alcanzar tus objetivos empresariales
</p>

<div className="flex flex-col sm:flex-row gap-4 justify-center">
<button
onClick={openContactModal}
className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
>
Solicitar Consulta Gratuita
</button>
<Link
href="/cursos"
className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
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
