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
  updated_at?: string;
};

type Activity = {
  id: number;
  from_status: string;
  to_status: string;
  note: string | null;
  created_at: string;
};

function sourceLabel(source: string | null) {
  if (!source) return '—';
  const map: Record<string, string> = {
    'hero-form': 'Formulario principal',
    'contact-modal': 'Modal de cotización',
  };
  return map[source] || source;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-VE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-VE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium tracking-wide text-slate-400 uppercase">{label}</span>
      <span className="text-sm text-slate-800">{children || <span className="text-slate-300">—</span>}</span>
    </div>
  );
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [converting, setConverting] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const openDetail = async (lead: Lead) => {
    setSelectedLead(lead);
    setDrawerOpen(true);
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`);
      const data = await res.json();
      setSelectedLead(data.lead);
      setActivities(data.activities || []);
    } catch {
      console.error('Error fetching lead detail');
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      setSelectedLead(null);
      setActivities([]);
    }, 300);
  };

  const handleConvert = async (leadId: number) => {
    setConverting(leadId);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/convert`, { method: 'POST' });
      if (res.ok) {
        fetchLeads();
        if (selectedLead?.id === leadId) closeDrawer();
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

  const handleDelete = async (leadId: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este lead? Esta acción no se puede deshacer.'))
      return;
    setDeleting(leadId);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchLeads();
        if (selectedLead?.id === leadId) closeDrawer();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al eliminar');
      }
    } catch {
      alert('Error al eliminar lead');
    } finally {
      setDeleting(null);
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
                <tr
                  key={lead.id}
                  className={`cursor-pointer transition-colors hover:bg-slate-50 ${selectedLead?.id === lead.id ? 'bg-blue-50/50' : ''}`}
                  onClick={() => openDetail(lead)}
                >
                  <td className="px-4 py-3 text-sm font-medium whitespace-nowrap text-slate-900">
                    {lead.name}
                    {lead.lastname ? ` ${lead.lastname}` : ''}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{lead.email}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{lead.company || '—'}</td>
                  <td className="max-w-[150px] truncate px-4 py-3 text-sm text-slate-600">
                    {lead.interest || '—'}
                  </td>
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
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
                    {formatDate(lead.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
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
                              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <span className="text-xs text-slate-400">ID #{lead.converted_to_contact_id}</span>
                      )}
                      <button
                        onClick={() => handleDelete(lead.id)}
                        disabled={deleting === lead.id}
                        title="Eliminar lead"
                        className="inline-flex items-center rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                      >
                        {deleting === lead.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                        ) : (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Drawer overlay */}
      {selectedLead && (
        <div
          className={`fixed inset-0 z-40 transition-opacity duration-300 ${drawerOpen ? 'bg-black/20' : 'pointer-events-none bg-transparent'}`}
          onClick={closeDrawer}
        />
      )}

      {/* Detail drawer */}
      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedLead && (
          <>
            {/* Drawer header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-900">Detalle del Lead</h2>
              <button
                onClick={closeDrawer}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {loadingDetail ? (
                <div className="flex h-32 items-center justify-center">
                  <div className="border-brand-orange h-6 w-6 animate-spin rounded-full border-3 border-t-transparent" />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Identity */}
                  <div className="flex items-start gap-4">
                    <div className="bg-brand-navy flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white">
                      {(selectedLead.name?.[0] || '?').toUpperCase()}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-slate-900">
                        {selectedLead.name}
                        {selectedLead.lastname ? ` ${selectedLead.lastname}` : ''}
                      </p>
                      <p className="text-sm text-slate-500">{selectedLead.email}</p>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div>
                    {selectedLead.converted_to_contact_id ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Convertido a contacto (ID #{selectedLead.converted_to_contact_id})
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                        Pendiente
                      </span>
                    )}
                  </div>

                  <hr className="border-slate-100" />

                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <DetailRow label="Teléfono">{selectedLead.phone}</DetailRow>
                    <DetailRow label="Empresa">{selectedLead.company}</DetailRow>
                    <DetailRow label="Origen">{sourceLabel(selectedLead.source)}</DetailRow>
                    <DetailRow label="Fecha de registro">{formatDateTime(selectedLead.created_at)}</DetailRow>
                  </div>

                  <DetailRow label="Cursos de interés">
                    {selectedLead.interest && (
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {selectedLead.interest.split(',').map((item, i) => (
                          <span
                            key={i}
                            className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
                          >
                            {item.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </DetailRow>

                  <DetailRow label="Mensaje">
                    {selectedLead.message && (
                      <p className="mt-0.5 leading-relaxed text-slate-600">{selectedLead.message}</p>
                    )}
                  </DetailRow>

                  {selectedLead.notes && (
                    <DetailRow label="Notas internas">
                      <p className="mt-0.5 leading-relaxed text-slate-600">{selectedLead.notes}</p>
                    </DetailRow>
                  )}

                  {/* Activities timeline */}
                  {activities.length > 0 && (
                    <div>
                      <hr className="mb-5 border-slate-100" />
                      <h3 className="mb-3 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                        Historial de actividad
                      </h3>
                      <div className="space-y-3">
                        {activities.map((act) => (
                          <div key={act.id} className="flex gap-3">
                            <div className="relative flex flex-col items-center">
                              <div className="h-2 w-2 rounded-full bg-slate-300" />
                              <div className="w-px flex-1 bg-slate-200" />
                            </div>
                            <div className="pb-3">
                              <p className="text-sm text-slate-700">
                                <span className="font-medium">{act.from_status}</span>
                                <span className="mx-1.5 text-slate-400">&rarr;</span>
                                <span className="font-medium">{act.to_status}</span>
                              </p>
                              {act.note && <p className="mt-0.5 text-xs text-slate-500">{act.note}</p>}
                              <p className="mt-0.5 text-xs text-slate-400">{formatDateTime(act.created_at)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Drawer footer actions */}
            {!loadingDetail && (
              <div className="shrink-0 border-t border-slate-100 px-6 py-4">
                <div className="flex items-center gap-3">
                  {!selectedLead.converted_to_contact_id && (
                    <button
                      onClick={() => handleConvert(selectedLead.id)}
                      disabled={converting === selectedLead.id}
                      className="bg-brand-orange hover:bg-brand-orange-hover flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-40"
                    >
                      {converting === selectedLead.id ? (
                        'Convirtiendo…'
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            />
                          </svg>
                          Convertir a contacto
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selectedLead.id)}
                    disabled={deleting === selectedLead.id}
                    className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-40"
                  >
                    {deleting === selectedLead.id ? (
                      'Eliminando…'
                    ) : (
                      <>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Eliminar
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
