import Link from 'next/link';
import { sql } from '@/lib/db';
import { LEAD_STAGES, getStage } from '@/lib/lead-stages';

async function getStats() {
  const [coursesCount] = await sql`SELECT COUNT(*)::int as count FROM courses WHERE active = true`;
  const [testimonialsCount] =
    await sql`SELECT COUNT(*)::int as count FROM testimonials WHERE active = true`;
  const [companiesCount] =
    await sql`SELECT COUNT(*)::int as count FROM partner_companies WHERE active = true`;
  const [leadsCount] = await sql`SELECT COUNT(*)::int as count FROM leads`;
  const [contactsCount] = await sql`SELECT COUNT(*)::int as count FROM contacts`;
  const [dealsCount] = await sql`SELECT COUNT(*)::int as count FROM deals`;
  const [dealsAmount] =
    await sql`SELECT COALESCE(SUM(amount), 0)::numeric as total FROM deals WHERE stage NOT IN ('ganada', 'perdida')`;

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
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      ),
    },
    {
      label: 'Contactos',
      value: stats.contacts,
      href: '/admin/contactos',
      color: 'bg-blue-50 text-blue-700',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      label: 'Deals Activos',
      value: stats.deals,
      href: '/admin/deals',
      color: 'bg-purple-50 text-purple-700',
      subtitle:
        stats.dealsAmount > 0
          ? `$${stats.dealsAmount.toLocaleString('es-VE', { minimumFractionDigits: 0 })} pipeline`
          : undefined,
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
          />
        </svg>
      ),
    },
    {
      label: 'Cursos Activos',
      value: stats.courses,
      href: '/admin/cursos',
      color: 'bg-green-50 text-green-700',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Dashboard</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.color}`}
              >
                {card.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                <p className="text-sm text-slate-500">{card.label}</p>
                {'subtitle' in card && card.subtitle && (
                  <p className="mt-0.5 text-xs font-medium text-green-600">{card.subtitle}</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Deals Pipeline */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Pipeline de Deals</h2>
          <Link
            href="/admin/deals"
            className="text-brand-orange hover:text-brand-orange-hover text-sm font-medium"
          >
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
                  <div className="relative h-24 overflow-hidden rounded-t-lg bg-slate-100">
                    <div
                      className={`absolute right-0 bottom-0 left-0 rounded-t-lg ${stage.dotColor}`}
                      style={{ height: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                </div>
                <p className="mt-2 text-lg font-bold text-slate-900">{count}</p>
                <p className="mt-0.5 text-[10px] leading-tight text-slate-500">{stage.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Deals */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-900">Deals Recientes</h2>
          <Link
            href="/admin/deals"
            className="text-brand-orange hover:text-brand-orange-hover text-sm font-medium"
          >
            Ver todos →
          </Link>
        </div>
        {stats.recentDeals.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-500">
            No hay deals registrados todavía.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium tracking-wider text-slate-500 uppercase">
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
                    <td className="px-6 py-3 text-sm font-medium text-slate-900">{deal.title}</td>
                    <td className="px-6 py-3 text-sm text-slate-600">
                      {deal.contact_name
                        ? `${deal.contact_name}${deal.contact_lastname ? ` ${deal.contact_lastname}` : ''}`
                        : '—'}
                      {deal.contact_company && (
                        <span className="ml-1 text-slate-400">· {deal.contact_company}</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-green-600">
                      {deal.amount
                        ? `$${parseFloat(deal.amount as string).toLocaleString('es-VE', { minimumFractionDigits: 0 })}`
                        : '—'}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${stage.bgColor} ${stage.textColor}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${stage.dotColor}`} />
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
