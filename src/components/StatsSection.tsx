import { Stat } from '@/data/site';

type Props = {
stats: Stat[];
};

export function StatsSection({ stats }: Props) {
return (
<section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
<div className="max-w-6xl mx-auto px-4">
<div className="text-center mb-12">
<h2 className="text-3xl font-bold mb-4">Nuestros Números Hablan</h2>
<p className="text-indigo-100 text-lg">
Más de una década transformando organizaciones
</p>
</div>

<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
{stats.map((stat, index) => (
<div key={index} className="text-center">
<div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
<div className="text-lg font-semibold mb-1">{stat.label}</div>
<div className="text-indigo-100 text-sm">{stat.description}</div>
</div>
))}
</div>
</div>
</section>
);
}
