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

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

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
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads — Inbox</h1>
          <p className="text-sm text-slate-500 mt-1">
            {totalLeads} lead{totalLeads !== 1 ? 's' : ''}
            {pendingCount > 0 && <span className="ml-2 text-blue-600 font-medium">· {pendingCount} sin convertir</span>}
          </p>
        </div>
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar nombre, email, empresa…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        {leads.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No hay leads registrados.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-200">
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
                  <td className="px-4 py-3 text-sm text-slate-900 font-medium whitespace-nowrap">
                    {lead.name}{lead.lastname ? ` ${lead.lastname}` : ''}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{lead.email}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{lead.company || '—'}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{lead.interest || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      {lead.source || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 max-w-[200px] truncate">{lead.message || '—'}</td>
                  <td className="px-4 py-3">
                    {lead.converted_to_contact_id ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Convertido
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        Pendiente
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">
                    {new Date(lead.created_at).toLocaleDateString('es-VE')}
                  </td>
                  <td className="px-4 py-3">
                    {!lead.converted_to_contact_id ? (
                      <button
                        onClick={() => handleConvert(lead.id)}
                        disabled={converting === lead.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-brand-orange text-white rounded-lg hover:bg-brand-orange-hover disabled:opacity-40 transition-colors whitespace-nowrap"
                      >
                        {converting === lead.id ? (
                          'Convirtiendo…'
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            Convertir
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">ID #{lead.converted_to_contact_id}</span>
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
