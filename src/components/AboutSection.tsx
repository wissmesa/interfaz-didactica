import { companyInfo } from '@/data/site';

export function AboutSection() {
return (
<section className="py-16 bg-white">
<div className="max-w-6xl mx-auto px-4">
<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
<div>
<h2 className="text-3xl font-bold text-slate-900 mb-6">
Sobre Interfaz Didáctica
</h2>
<p className="text-slate-600 text-lg mb-6">{companyInfo.description}</p>

<div className="space-y-6">
<div>
<h3 className="text-xl font-semibold text-slate-900 mb-2">Nuestra Misión</h3>
<p className="text-slate-600">{companyInfo.mission}</p>
</div>

<div>
<h3 className="text-xl font-semibold text-slate-900 mb-2">Nuestra Visión</h3>
<p className="text-slate-600">{companyInfo.vision}</p>
</div>
</div>
</div>

<div className="bg-slate-50 rounded-lg p-8">
<h3 className="text-2xl font-bold text-slate-900 mb-6">Nuestros Valores</h3>
<div className="space-y-4">
{companyInfo.values.map((value, index) => (
<div key={index} className="flex items-center">
<div className="w-2 h-2 bg-indigo-600 rounded-full mr-4"></div>
<span className="text-slate-700 font-medium">{value}</span>
</div>
))}
</div>

<div className="mt-8 pt-6 border-t border-slate-200">
<div className="text-center">
<div className="text-3xl font-bold text-indigo-600 mb-2">
{companyInfo.founded}
</div>
<div className="text-slate-600">Año de fundación</div>
</div>
</div>
</div>
</div>
</div>
</section>
);
}
