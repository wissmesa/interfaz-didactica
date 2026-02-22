import Link from 'next/link';
import { sql } from '@/lib/db';
import { LEAD_STAGES, getStage } from '@/lib/lead-stages';

async function getStats() {
  const [coursesCount] = await sql`SELECT COUNT(*)::int as count FROM courses WHERE active = true`;
  const [testimonialsCount] = await sql`SELECT COUNT(*)::int as count FROM testimonials WHERE active = true`;
  const [companiesCount] = await sql`SELECT COUNT(*)::int as count FROM partner_companies WHERE active = true`;
  const [leadsCount] = await sql`SELECT COUNT(*)::int as count FROM leads`;
  const [contactsCount] = await sql`SELECT COUNT(*)::int as count FROM contacts`;
  const [dealsCount] = await sql`SELECT COUNT(*)::int as count FROM deals`;
  const [dealsAmount] = await sql`SELECT COALESCE(SUM(amount), 0)::numeric as total FROM deals WHERE stage NOT IN ('ganada', 'perdida')`;

  const dealStageCounts = await sql`
    SELECT stage, COUNT(*)::int as count FROM deals GROUP BY stage
  `;

  const recentDeals = await sql`
    SELECT d.id, d.title, d.stage, d.amount, d.created_at,
           c.name as contact_name, c.lastname as contact_lastname, c.company as contact_company
    FROM deals d LEFT JOIN contacts c ON d.contact_id = c.id
    ORDER BY d.created_at DESC LIMIT 5
  `;

  const pendingLeads = await sql`
    SELECT COUNT(*)::int as count FROM leads WHERE converted_to_contact_id IS NULL
  `;

  return {
    courses: coursesCount.count,
    testimonials: testimonialsCount.count,
    companies: companiesCount.count,
    leads: leadsCount.count,
    contacts: contactsCount.count,
    deals: dealsCount.count,
    dealsAmount: parseFloat(dealsAmount.total) || 0,
    pendingLeads: pendingLeads[0].count,
    dealStageCounts: Object.fromEntries(
      dealStageCounts.map((r: Record<string, unknown>) => [r.stage, r.count])
    ),
    recentDeals,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    {
      label: 'Leads Pendientes',
      value: stats.pendingLeads,
      href: '/admin/leads',
      color: 'bg-orange-50 text-orange-700',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      ),
    },
    {
      label: 'Contactos',
      value: stats.contacts,
      href: '/admin/contactos',
      color: 'bg-blue-50 text-blue-700',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: 'Deals Activos',
      value: stats.deals,
      href: '/admin/deals',
      color: 'bg-purple-50 text-purple-700',
      subtitle: stats.dealsAmount > 0 ? `$${stats.dealsAmount.toLocaleString('es-VE', { minimumFractionDigits: 0 })} pipeline` : undefined,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
      ),
    },
    {
      label: 'Cursos Activos',
      value: stats.courses,
      href: '/admin/cursos',
      color: 'bg-green-50 text-green-700',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link
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
                {'subtitle' in card && card.subtitle && (
                  <p className="text-xs text-green-600 font-medium mt-0.5">{card.subtitle}</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Deals Pipeline */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900">Pipeline de Deals</h2>
          <Link href="/admin/deals" className="text-sm text-brand-orange hover:text-brand-orange-hover font-medium">
            Ver pipeline →
          </Link>
        </div>
        <div className="flex items-end gap-2">
          {LEAD_STAGES.map((stage) => {
            const count = (stats.dealStageCounts[stage.key] as number) || 0;
            const pct = stats.deals > 0 ? (count / stats.deals) * 100 : 0;
            return (
              <div key={stage.key} className="flex-1 text-center">
                <div className="relative mx-auto w-full max-w-[80px]">
                  <div className="h-24 bg-slate-100 rounded-t-lg relative overflow-hidden">
                    <div
                      className={`absolute bottom-0 left-0 right-0 rounded-t-lg ${stage.dotColor}`}
                      style={{ height: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                </div>
                <p className="text-lg font-bold text-slate-900 mt-2">{count}</p>
                <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{stage.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Deals */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Deals Recientes</h2>
          <Link href="/admin/deals" className="text-sm text-brand-orange hover:text-brand-orange-hover font-medium">
            Ver todos →
          </Link>
        </div>
        {stats.recentDeals.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-sm">
            No hay deals registrados todavía.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3">Título</th>
                <th className="px-6 py-3">Contacto</th>
                <th className="px-6 py-3">Monto</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.recentDeals.map((deal: Record<string, string | number>, i: number) => {
                const stage = getStage(deal.stage as string);
                return (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-3 text-sm text-slate-900 font-medium">{deal.title}</td>
                    <td className="px-6 py-3 text-sm text-slate-600">
                      {deal.contact_name ? `${deal.contact_name}${deal.contact_lastname ? ` ${deal.contact_lastname}` : ''}` : '—'}
                      {deal.contact_company && <span className="text-slate-400 ml-1">· {deal.contact_company}</span>}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-green-600">
                      {deal.amount ? `$${parseFloat(deal.amount as string).toLocaleString('es-VE', { minimumFractionDigits: 0 })}` : '—'}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${stage.bgColor} ${stage.textColor}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${stage.dotColor}`} />
                        {stage.label}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-500">
                      {new Date(deal.created_at as string).toLocaleDateString('es-VE')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
