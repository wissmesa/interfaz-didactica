'use client';

import { useState } from 'react';

type FormData = {
name: string;
email: string;
company: string;
phone: string;
interest: string;
message: string;
};

export function HeroForm() {
const [formData, setFormData] = useState<FormData>({
name: '',
email: '',
company: '',
phone: '',
interest: '',
message: ''
});

const [isSubmitting, setIsSubmitting] = useState(false);
const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>(
'idle'
);

const handleChange = (
e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
const { name, value } = e.target;
setFormData((prev) => ({
...prev,
[name]: value
}));
};

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
setIsSubmitting(true);
setSubmitStatus('idle');

try {
// Aquí puedes integrar con tu servicio de email o API
// Por ahora simulamos el envío
await new Promise((resolve) => setTimeout(resolve, 2000));

// Simular envío exitoso
setSubmitStatus('success');

// Resetear formulario después de 3 segundos
setTimeout(() => {
setFormData({
name: '',
email: '',
company: '',
phone: '',
interest: '',
message: ''
});
setSubmitStatus('idle');
}, 3000);
} catch (error) {
setSubmitStatus('error');
} finally {
setIsSubmitting(false);
}
};

if (submitStatus === 'success') {
return (
<div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-2xl text-center">
<div className="text-6xl mb-4">✅</div>
<h2 className="text-2xl font-bold mb-2 text-slate-900">
¡Gracias por contactarnos!
</h2>
<p className="text-slate-600">
Hemos recibido tu solicitud. Uno de nuestros especialistas se pondrá en contacto
contigo en las próximas 24 horas.
</p>
</div>
);
}

return (
<div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-2xl">
<div className="text-center mb-6">
<h2 className="text-2xl font-bold mb-2 text-slate-900">
¿Listo para Transformar tu Equipo?
</h2>
<p className="text-slate-600">Obtén una consulta gratuita personalizada</p>
</div>

<form onSubmit={handleSubmit} className="space-y-4">
<div>
<label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
Nombre completo *
</label>
<input
type="text"
id="name"
name="name"
value={formData.name}
onChange={handleChange}
required
className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
placeholder="Tu nombre completo"
/>
</div>

<div>
<label
htmlFor="email"
className="block text-sm font-medium text-slate-700 mb-2"
>
Correo electrónico *
</label>
<input
type="email"
id="email"
name="email"
value={formData.email}
onChange={handleChange}
required
className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
placeholder="tu@email.com"
/>
</div>

<div>
<label
htmlFor="company"
className="block text-sm font-medium text-slate-700 mb-2"
>
Empresa
</label>
<input
type="text"
id="company"
name="company"
value={formData.company}
onChange={handleChange}
className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
placeholder="Nombre de tu empresa"
/>
</div>

<div>
<label
htmlFor="phone"
className="block text-sm font-medium text-slate-700 mb-2"
>
Teléfono
</label>
<input
type="tel"
id="phone"
name="phone"
value={formData.phone}
onChange={handleChange}
className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
placeholder="+1 (555) 123-4567"
/>
</div>

<div>
<label
htmlFor="interest"
className="block text-sm font-medium text-slate-700 mb-2"
>
Área de interés
</label>
<select
id="interest"
name="interest"
value={formData.interest}
onChange={handleChange}
className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
>
<option value="" className="text-slate-800">
Selecciona una opción
</option>
<option value="capacitacion" className="text-slate-800">
Capacitación In-Company
</option>
<option value="consultoria" className="text-slate-800">
Consultoría Organizacional
</option>
<option value="liderazgo" className="text-slate-800">
Desarrollo de Liderazgo
</option>
<option value="evaluacion" className="text-slate-800">
Evaluación de Competencias
</option>
<option value="cursos" className="text-slate-800">
Cursos Específicos
</option>
<option value="otro" className="text-slate-800">
Otro
</option>
</select>
</div>

<div>
<label
htmlFor="message"
className="block text-sm font-medium text-slate-700 mb-2"
>
Mensaje (opcional)
</label>
<textarea
id="message"
name="message"
value={formData.message}
onChange={handleChange}
rows={3}
className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 resize-none"
placeholder="Cuéntanos sobre tus necesidades específicas..."
></textarea>
</div>

{submitStatus === 'error' && (
<div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
Hubo un error al enviar el formulario. Por favor, intenta nuevamente.
</div>
)}

<button
type="submit"
disabled={isSubmitting}
className="w-full bg-orange-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
>
{isSubmitting ? (
<>
<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
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
