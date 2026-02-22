import { Service } from '@/data/site';

type Props = {
  services: Service[];
};

export function ServicesSection({ services }: Props) {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900">Nuestros Servicios</h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Ofrecemos soluciones integrales para el desarrollo organizacional y la capacitación del
            talento humano
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 text-center text-4xl">{service.icon}</div>
              <h3 className="mb-3 text-center text-xl font-semibold text-slate-900">
                {service.title}
              </h3>
              <p className="text-center text-slate-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
