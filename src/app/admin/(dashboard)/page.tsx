import { sql } from '@/lib/db';

async function getStats() {
  const [coursesCount] = await sql`SELECT COUNT(*) as count FROM courses WHERE active = true`;
  const [testimonialsCount] = await sql`SELECT COUNT(*) as count FROM testimonials WHERE active = true`;
  const [companiesCount] = await sql`SELECT COUNT(*) as count FROM partner_companies WHERE active = true`;
  const [leadsCount] = await sql`SELECT COUNT(*) as count FROM leads`;
  const recentLeads = await sql`
    SELECT name, email, source, created_at FROM leads 
    ORDER BY created_at DESC LIMIT 5
  `;

  return {
    courses: parseInt(coursesCount.count),
    testimonials: parseInt(testimonialsCount.count),
    companies: parseInt(companiesCount.count),
    leads: parseInt(leadsCount.count),
    recentLeads,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    {
      label: 'Cursos Activos',
      value: stats.courses,
      href: '/admin/cursos',
      color: 'bg-blue-50 text-blue-700',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      label: 'Reseñas',
      value: stats.testimonials,
      href: '/admin/resenas',
      color: 'bg-amber-50 text-amber-700',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
    {
      label: 'Empresas Aliadas',
      value: stats.companies,
      href: '/admin/empresas',
      color: 'bg-green-50 text-green-700',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      label: 'Leads Totales',
      value: stats.leads,
      href: '/admin/leads',
      color: 'bg-purple-50 text-purple-700',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.color}`}>
                {card.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                <p className="text-sm text-slate-500">{card.label}</p>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Leads Recientes</h2>
        </div>
        {stats.recentLeads.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-sm">
            No hay leads registrados todavía.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Origen</th>
                <th className="px-6 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.recentLeads.map((lead: Record<string, string>, i: number) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-6 py-3 text-sm text-slate-900">{lead.name}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{lead.email}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {lead.source}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-500">
                    {new Date(lead.created_at).toLocaleDateString('es-VE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
