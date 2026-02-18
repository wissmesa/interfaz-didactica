import { sql } from '@/lib/db';

async function getLeads() {
  const leads = await sql`
    SELECT * FROM leads ORDER BY created_at DESC LIMIT 100
  `;
  return leads;
}

export default async function AdminLeadsPage() {
  const leads = await getLeads();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Leads</h1>

      {leads.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500">No hay leads registrados.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Empresa</th>
                <th className="px-6 py-3">Mensaje</th>
                <th className="px-6 py-3">Origen</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead: Record<string, string | number>, i: number) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-6 py-3 text-sm text-slate-900 whitespace-nowrap">
                    {lead.name} {lead.lastname ? ` ${lead.lastname}` : ''}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-600">{lead.email}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{lead.company || '—'}</td>
                  <td className="px-6 py-3 text-sm text-slate-600 max-w-xs truncate">{lead.message || '—'}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {lead.source}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      lead.status === 'new'
                        ? 'bg-blue-100 text-blue-700'
                        : lead.status === 'contacted'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-500 whitespace-nowrap">
                    {new Date(lead.created_at as string).toLocaleDateString('es-VE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
