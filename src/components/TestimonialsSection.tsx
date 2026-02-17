import { Testimonial } from '@/data/site';

type Props = {
testimonials: Testimonial[];
};

function StarRating({ rating }: { rating: number }) {
return (
<div className="flex gap-1">
{[...Array(5)].map((_, i) => (
<span key={i} className="text-yellow-400">
{i < rating ? '★' : '☆'}
</span>
))}
</div>
);
}

export function TestimonialsSection({ testimonials }: Props) {
return (
<section className="py-16 bg-white">
<div className="max-w-6xl mx-auto px-4">
<div className="text-center mb-12">
<h2 className="text-3xl font-bold text-slate-900 mb-4">
Lo Que Dicen Nuestros Clientes
</h2>
<p className="text-slate-600 text-lg">
Experiencias reales de organizaciones que han transformado su talento humano
</p>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{testimonials.map((testimonial, index) => (
<div key={index} className="bg-slate-50 rounded-lg p-6">
<div className="mb-4">
<StarRating rating={testimonial.rating} />
</div>
<blockquote className="text-slate-700 mb-6 italic">
&ldquo;{testimonial.content}&rdquo;
</blockquote>
<div className="border-t pt-4">
<div className="font-semibold text-slate-900">{testimonial.name}</div>
<div className="text-sm text-slate-600">
{testimonial.position}, {testimonial.company}
</div>
</div>
</div>
))}
</div>
</div>
</section>
);
}
