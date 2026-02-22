import { Stat } from '@/data/site';

type Props = {
  stats: Stat[];
};

export function StatsSection({ stats }: Props) {
  return (
    <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Nuestros Números Hablan</h2>
          <p className="text-lg text-indigo-100">Más de una década transformando organizaciones</p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mb-2 text-4xl font-bold md:text-5xl">{stat.number}</div>
              <div className="mb-1 text-lg font-semibold">{stat.label}</div>
              <div className="text-sm text-indigo-100">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
