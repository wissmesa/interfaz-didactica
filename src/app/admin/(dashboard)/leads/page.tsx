'use client';

import { useState, useEffect, useCallback } from 'react';

type Lead = {
  id: number;
  name: string;
  lastname: string | null;
  email: string;
  company: string | null;
  phone: string | null;
  interest: string | null;
  message: string | null;
  source: string | null;
  status: string;
  notes: string | null;
  converted_to_contact_id: number | null;
  created_at: string;
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [converting, setConverting] = useState<number | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      params.set('limit', '200');
      const res = await fetch(`/api/admin/leads?${params}`);
      const data = await res.json();
      setLeads(data.leads || []);
    } catch {
      console.error('Error fetching leads');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleConvert = async (leadId: number) => {
    setConverting(leadId);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/convert`, { method: 'POST' });
      if (res.ok) {
        fetchLeads();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al convertir');
      }
    } catch {
      alert('Error al convertir lead');
    } finally {
      setConverting(null);
    }
  };

  const totalLeads = leads.length;
  const pendingCount = leads.filter((l) => !l.converted_to_contact_id).length;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-brand-orange h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads — Inbox</h1>
          <p className="mt-1 text-sm text-slate-500">
            {totalLeads} lead{totalLeads !== 1 ? 's' : ''}
            {pendingCount > 0 && (
              <span className="ml-2 font-medium text-blue-600">· {pendingCount} sin convertir</span>
            )}
          </p>
        </div>
        <div className="relative max-w-sm">
          <svg
            className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar nombre, email, empresa…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="focus:ring-brand-orange/40 w-72 rounded-lg border border-slate-200 py-2 pr-3 pl-9 text-sm focus:ring-2 focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        {leads.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No hay leads registrados.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-medium tracking-wider text-slate-500 uppercase">
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Empresa</th>
                <th className="px-4 py-3">Interés</th>
                <th className="px-4 py-3">Origen</th>
                <th className="px-4 py-3">Mensaje</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium whitespace-nowrap text-slate-900">
                    {lead.name}
                    {lead.lastname ? ` ${lead.lastname}` : ''}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{lead.email}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{lead.company || '—'}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{lead.interest || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {lead.source || '—'}
                    </span>
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-sm text-slate-600">
                    {lead.message || '—'}
                  </td>
                  <td className="px-4 py-3">
                    {lead.converted_to_contact_id ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Convertido
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                        Pendiente
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap text-slate-500">
                    {new Date(lead.created_at).toLocaleDateString('es-VE')}
                  </td>
                  <td className="px-4 py-3">
                    {!lead.converted_to_contact_id ? (
                      <button
                        onClick={() => handleConvert(lead.id)}
                        disabled={converting === lead.id}
                        className="bg-brand-orange hover:bg-brand-orange-hover inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap text-white transition-colors disabled:opacity-40"
                      >
                        {converting === lead.id ? (
                          'Convirtiendo…'
                        ) : (
                          <>
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                              />
                            </svg>
                            Convertir
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">
                        ID #{lead.converted_to_contact_id}
                      </span>
                    )}
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
