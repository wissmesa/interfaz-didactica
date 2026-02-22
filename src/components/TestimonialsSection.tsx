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
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900">Lo Que Dicen Nuestros Clientes</h2>
          <p className="text-lg text-slate-600">
            Experiencias reales de organizaciones que han transformado su talento humano
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="rounded-lg bg-slate-50 p-6">
              <div className="mb-4">
                <StarRating rating={testimonial.rating} />
              </div>
              <blockquote className="mb-6 text-slate-700 italic">
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
