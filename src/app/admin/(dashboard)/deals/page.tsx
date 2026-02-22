'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { LEAD_STAGES, getStage } from '@/lib/lead-stages';
import DealDetailPanel from '@/components/admin/DealDetailPanel';

type Deal = {
  id: number;
  title: string;
  contact_id: number | null;
  stage: string;
  amount: string | null;
  expected_close_date: string | null;
  notes: string | null;
  contact_name: string | null;
  contact_lastname: string | null;
  contact_email: string | null;
  contact_company: string | null;
  created_at: string;
};

type Contact = {
  id: number;
  name: string;
  lastname: string | null;
  email: string;
  company: string | null;
};

type ViewMode = 'kanban' | 'table';

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stageCounts, setStageCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<ViewMode>('kanban');
  const [selectedDealId, setSelectedDealId] = useState<number | null>(null);
  const [showNewDeal, setShowNewDeal] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newDeal, setNewDeal] = useState({
    title: '',
    contact_id: '',
    stage: 'pendiente',
    amount: '',
    expected_close_date: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const dragDealId = useRef<number | null>(null);

  const fetchDeals = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/deals?${params}`);
      const data = await res.json();
      setDeals(data.deals || []);
      setStageCounts(data.stageCounts || {});
    } catch {
      console.error('Error fetching deals');
    } finally {
      setLoading(false);
    }
  }, [search]);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/admin/contacts?limit=500');
      const data = await res.json();
      setContacts(data.contacts || []);
    } catch {
      console.error('Error fetching contacts');
    }
  };

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const updateDealStage = async (dealId: number, newStage: string) => {
    const deal = deals.find((d) => d.id === dealId);
    if (!deal || deal.stage === newStage) return;
    setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d)));
    try {
      await fetch(`/api/admin/deals/${dealId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });
      fetchDeals();
    } catch {
      fetchDeals();
    }
  };

  const handleDragStart = (dealId: number) => {
    dragDealId.current = dealId;
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  const handleDrop = (stageKey: string) => {
    if (dragDealId.current !== null) {
      updateDealStage(dragDealId.current, stageKey);
      dragDealId.current = null;
    }
  };

  const openNewDeal = () => {
    setNewDeal({
      title: '',
      contact_id: '',
      stage: 'pendiente',
      amount: '',
      expected_close_date: '',
      notes: '',
    });
    fetchContacts();
    setShowNewDeal(true);
  };

  const handleCreateDeal = async () => {
    if (!newDeal.title) return;
    setSaving(true);
    try {
      await fetch('/api/admin/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDeal,
          contact_id: newDeal.contact_id ? parseInt(newDeal.contact_id) : null,
          amount: newDeal.amount ? parseFloat(newDeal.amount) : null,
          expected_close_date: newDeal.expected_close_date || null,
        }),
      });
      setShowNewDeal(false);
      fetchDeals();
    } finally {
      setSaving(false);
    }
  };

  const formatAmount = (amount: string | null) => {
    if (!amount) return null;
    const num = parseFloat(amount);
    return isNaN(num) ? null : `$${num.toLocaleString('es-VE', { minimumFractionDigits: 0 })}`;
  };

  const totalDeals = deals.length;
  const totalAmount = deals.reduce((sum, d) => sum + (d.amount ? parseFloat(d.amount) : 0), 0);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-brand-orange h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Deals — Pipeline</h1>
          <p className="mt-1 text-sm text-slate-500">
            {totalDeals} deal{totalDeals !== 1 ? 's' : ''}
            {totalAmount > 0 && (
              <span className="ml-2 font-medium text-green-600">
                · ${totalAmount.toLocaleString('es-VE', { minimumFractionDigits: 0 })}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
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
              placeholder="Buscar deal, contacto, empresa…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="focus:ring-brand-orange/40 w-64 rounded-lg border border-slate-200 py-2 pr-3 pl-9 text-sm focus:ring-2 focus:outline-none"
            />
          </div>
          <div className="flex rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => setView('kanban')}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${view === 'kanban' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Kanban
            </button>
            <button
              onClick={() => setView('table')}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${view === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Tabla
            </button>
          </div>
          <button
            onClick={openNewDeal}
            className="bg-brand-orange hover:bg-brand-orange-hover rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            + Nuevo deal
          </button>
        </div>
      </div>

      {/* New Deal Modal */}
      {showNewDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowNewDeal(false)} />
          <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Nuevo Deal</h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Título *</label>
                <input
                  value={newDeal.title}
                  onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                  placeholder="Ej: Capacitación Excel para Ventas"
                  className="focus:ring-brand-orange/40 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Contacto asociado
                </label>
                <select
                  value={newDeal.contact_id}
                  onChange={(e) => setNewDeal({ ...newDeal, contact_id: e.target.value })}
                  className="focus:ring-brand-orange/40 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                >
                  <option value="">Sin contacto</option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                      {c.lastname ? ` ${c.lastname}` : ''} — {c.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Monto estimado ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newDeal.amount}
                    onChange={(e) => setNewDeal({ ...newDeal, amount: e.target.value })}
                    className="focus:ring-brand-orange/40 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Fecha esperada cierre
                  </label>
                  <input
                    type="date"
                    value={newDeal.expected_close_date}
                    onChange={(e) =>
                      setNewDeal({ ...newDeal, expected_close_date: e.target.value })
                    }
                    className="focus:ring-brand-orange/40 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Etapa</label>
                <select
                  value={newDeal.stage}
                  onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}
                  className="focus:ring-brand-orange/40 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                >
                  {LEAD_STAGES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Notas</label>
                <textarea
                  value={newDeal.notes}
                  onChange={(e) => setNewDeal({ ...newDeal, notes: e.target.value })}
                  rows={2}
                  className="focus:ring-brand-orange/40 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowNewDeal(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateDeal}
                disabled={saving || !newDeal.title}
                className="bg-brand-orange hover:bg-brand-orange-hover rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
              >
                {saving ? 'Creando…' : 'Crear deal'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kanban View */}
      {view === 'kanban' && (
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex h-full min-w-max gap-4">
            {LEAD_STAGES.map((stage) => {
              const stageDeals = deals.filter((d) => d.stage === stage.key);
              const count = stageCounts[stage.key] || stageDeals.length;
              const stageAmount = stageDeals.reduce(
                (sum, d) => sum + (d.amount ? parseFloat(d.amount) : 0),
                0
              );

              return (
                <div
                  key={stage.key}
                  className="flex w-72 flex-shrink-0 flex-col rounded-xl bg-slate-50"
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(stage.key)}
                >
                  <div className="flex items-center gap-2 px-4 py-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${stage.dotColor}`} />
                    <h3 className="text-sm font-semibold text-slate-700">{stage.label}</h3>
                    <span
                      className={`ml-auto rounded-full px-2 py-0.5 text-xs font-medium ${stage.bgColor} ${stage.textColor}`}
                    >
                      {count}
                    </span>
                  </div>
                  {stageAmount > 0 && (
                    <div className="-mt-1 mb-1 px-4">
                      <span className="text-xs font-medium text-green-600">
                        ${stageAmount.toLocaleString('es-VE', { minimumFractionDigits: 0 })}
                      </span>
                    </div>
                  )}
                  <div className="max-h-[calc(100vh-300px)] flex-1 space-y-2 overflow-y-auto px-2 pb-2">
                    {stageDeals.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">Sin deals</div>
                    ) : (
                      stageDeals.map((deal) => (
                        <div
                          key={deal.id}
                          draggable
                          onDragStart={() => handleDragStart(deal.id)}
                          onClick={() => setSelectedDealId(deal.id)}
                          className="group cursor-pointer rounded-lg border border-slate-200 bg-white p-3 transition-all hover:border-slate-300 hover:shadow-md"
                        >
                          <p className="mb-1.5 line-clamp-2 text-sm font-medium text-slate-900">
                            {deal.title}
                          </p>
                          {deal.contact_name && (
                            <p className="mb-1 text-xs text-slate-500">
                              {deal.contact_name}
                              {deal.contact_lastname ? ` ${deal.contact_lastname}` : ''}
                              {deal.contact_company && (
                                <span className="text-slate-400"> · {deal.contact_company}</span>
                              )}
                            </p>
                          )}
                          <div className="mt-2 flex items-center justify-between">
                            {formatAmount(deal.amount) ? (
                              <span className="text-xs font-semibold text-green-600">
                                {formatAmount(deal.amount)}
                              </span>
                            ) : (
                              <span />
                            )}
                            <span className="text-[10px] text-slate-400">
                              {new Date(deal.created_at).toLocaleDateString('es-VE', {
                                day: '2-digit',
                                month: 'short',
                              })}
                            </span>
                          </div>
                          {deal.expected_close_date && (
                            <p className="mt-1 text-[10px] text-slate-400">
                              Cierre:{' '}
                              {new Date(deal.expected_close_date).toLocaleDateString('es-VE', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Table View */}
      {view === 'table' && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          {deals.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No hay deals registrados.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-medium tracking-wider text-slate-500 uppercase">
                  <th className="px-4 py-3">Título</th>
                  <th className="px-4 py-3">Contacto</th>
                  <th className="px-4 py-3">Empresa</th>
                  <th className="px-4 py-3">Monto</th>
                  <th className="px-4 py-3">Cierre</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deals.map((deal) => {
                  const stage = getStage(deal.stage);
                  return (
                    <tr
                      key={deal.id}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => setSelectedDealId(deal.id)}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">{deal.title}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {deal.contact_name
                          ? `${deal.contact_name}${deal.contact_lastname ? ` ${deal.contact_lastname}` : ''}`
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {deal.contact_company || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">
                        {formatAmount(deal.amount) || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {deal.expected_close_date
                          ? new Date(deal.expected_close_date).toLocaleDateString('es-VE')
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${stage.bgColor} ${stage.textColor}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${stage.dotColor}`} />
                          {stage.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap text-slate-500">
                        {new Date(deal.created_at).toLocaleDateString('es-VE')}
                      </td>
                      <td className="px-4 py-3">
                        <button className="hover:text-brand-orange text-slate-400">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Deal Detail Panel */}
      {selectedDealId && (
        <DealDetailPanel
          dealId={selectedDealId}
          onClose={() => setSelectedDealId(null)}
          onUpdate={fetchDeals}
        />
      )}
    </div>
  );
}
