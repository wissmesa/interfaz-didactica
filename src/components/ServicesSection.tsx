import { Service } from '@/data/site';

type Props = {
services: Service[];
};

export function ServicesSection({ services }: Props) {
return (
<section className="py-16 bg-slate-50">
<div className="max-w-6xl mx-auto px-4">
<div className="text-center mb-12">
<h2 className="text-3xl font-bold text-slate-900 mb-4">Nuestros Servicios</h2>
<p className="text-slate-600 text-lg max-w-2xl mx-auto">
Ofrecemos soluciones integrales para el desarrollo organizacional y la
capacitación del talento humano
</p>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
{services.map((service, index) => (
<div
key={index}
className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
>
<div className="text-4xl mb-4 text-center">{service.icon}</div>
<h3 className="text-xl font-semibold text-slate-900 mb-3 text-center">
{service.title}
</h3>
<p className="text-slate-600 text-center">{service.description}</p>
</div>
))}
</div>
</div>
</section>
);
}
