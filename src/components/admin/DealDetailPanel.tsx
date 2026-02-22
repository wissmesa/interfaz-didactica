'use client';

import { useState, useEffect, useCallback } from 'react';
import { LEAD_STAGES, getStage } from '@/lib/lead-stages';

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
  contact_phone: string | null;
  created_at: string;
  updated_at: string;
};

type Activity = {
  id: number;
  deal_id: number;
  from_stage: string | null;
  to_stage: string;
  note: string | null;
  created_at: string;
};

type Props = {
  dealId: number;
  onClose: () => void;
  onUpdate: () => void;
};

export default function DealDetailPanel({ dealId, onClose, onUpdate }: Props) {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState('');
  const [amount, setAmount] = useState('');
  const [closeDate, setCloseDate] = useState('');
  const [newNote, setNewNote] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const fetchDeal = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/deals/${dealId}`);
      const data = await res.json();
      setDeal(data.deal);
      setActivities(data.activities || []);
      setNotes(data.deal.notes || '');
      setAmount(data.deal.amount || '');
      setCloseDate(data.deal.expected_close_date || '');
    } catch {
      console.error('Error fetching deal detail');
    } finally {
      setLoading(false);
    }
  }, [dealId]);

  useEffect(() => { fetchDeal(); }, [fetchDeal]);

  const handleStageChange = async (newStage: string) => {
    if (!deal || deal.stage === newStage) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/deals/${dealId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });
      await fetchDeal();
      onUpdate();
    } finally { setSaving(false); }
  };

  const handleSaveDetails = async () => {
    if (!deal) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/deals/${dealId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes,
          amount: amount ? parseFloat(amount) : null,
          expected_close_date: closeDate || null,
        }),
      });
      await fetchDeal();
      onUpdate();
    } finally { setSaving(false); }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      await fetch(`/api/admin/deals/${dealId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newNote }),
      });
      setNewNote('');
      await fetchDeal();
    } catch {
      console.error('Error adding note');
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`/api/admin/deals/${dealId}`, { method: 'DELETE' });
      onUpdate();
      onClose();
    } catch {
      console.error('Error deleting deal');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        <div className="absolute inset-0 bg-black/30" onClick={onClose} />
        <div className="relative w-full max-w-lg bg-white shadow-2xl flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        <div className="absolute inset-0 bg-black/30" onClick={onClose} />
        <div className="relative w-full max-w-lg bg-white shadow-2xl p-8 text-center text-slate-500">Deal no encontrado.</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Detalle del Deal</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Deal Info */}
          <div className="px-6 py-5 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-3">{deal.title}</h3>
            {deal.contact_name && (
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm text-slate-700 font-medium">
                  {deal.contact_name}{deal.contact_lastname ? ` ${deal.contact_lastname}` : ''}
                </span>
                {deal.contact_company && <span className="text-sm text-slate-500">· {deal.contact_company}</span>}
              </div>
            )}
            {deal.contact_email && (
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-slate-600">{deal.contact_email}</span>
              </div>
            )}
            {deal.contact_phone && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm text-slate-600">{deal.contact_phone}</span>
              </div>
            )}
          </div>

          {/* Stage Selector */}
          <div className="px-6 py-5 border-b border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Etapa del deal</p>
            <div className="flex flex-wrap gap-2">
              {LEAD_STAGES.map((s) => (
                <button
                  key={s.key}
                  onClick={() => handleStageChange(s.key)}
                  disabled={saving}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    deal.stage === s.key
                      ? `${s.bgColor} ${s.textColor} border-current ring-2 ring-current/20`
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${deal.stage === s.key ? s.dotColor : 'bg-slate-300'}`} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount & Close Date */}
          <div className="px-6 py-5 border-b border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Detalles financieros</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Monto estimado ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Fecha esperada cierre</label>
                <input
                  type="date"
                  value={closeDate}
                  onChange={(e) => setCloseDate(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="px-6 py-5 border-b border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Notas internas</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Agregar notas sobre este deal…"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 resize-none"
            />
            <button
              onClick={handleSaveDetails}
              disabled={saving}
              className="mt-2 px-4 py-1.5 text-sm font-medium bg-brand-orange text-white rounded-lg hover:bg-brand-orange-hover disabled:opacity-40 transition-colors"
            >
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>

          {/* Activity Timeline */}
          <div className="px-6 py-5">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">Historial de actividad</p>
            <div className="flex gap-2 mb-5">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                placeholder="Agregar comentario…"
                className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
              />
              <button onClick={handleAddNote} disabled={!newNote.trim()} className="px-3 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors">
                Enviar
              </button>
            </div>
            {activities.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">Sin actividad registrada</p>
            ) : (
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-200" />
                <div className="space-y-4">
                  {activities.map((activity) => {
                    const isStageChange = activity.from_stage !== activity.to_stage;
                    const toStage = getStage(activity.to_stage);
                    return (
                      <div key={activity.id} className="relative pl-8">
                        <div className={`absolute left-1.5 top-1 w-3 h-3 rounded-full border-2 border-white ${isStageChange ? toStage.dotColor : 'bg-slate-300'}`} />
                        <div className="text-sm">
                          {isStageChange ? (
                            <p className="text-slate-700">
                              <span className="font-medium">Etapa cambiada</span>
                              {activity.from_stage && (
                                <>
                                  {' de '}
                                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getStage(activity.from_stage).bgColor} ${getStage(activity.from_stage).textColor}`}>
                                    {getStage(activity.from_stage).label}
                                  </span>
                                </>
                              )}
                              {' a '}
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${toStage.bgColor} ${toStage.textColor}`}>
                                {toStage.label}
                              </span>
                            </p>
                          ) : activity.note ? (
                            <p className="text-slate-700">{activity.note}</p>
                          ) : null}
                          {isStageChange && activity.note && (
                            <p className="text-slate-500 text-xs mt-0.5">{activity.note}</p>
                          )}
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(activity.created_at).toLocaleDateString('es-VE', {
                              day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-red-600 font-medium">¿Confirmar eliminación?</span>
              <button onClick={handleDelete} className="px-3 py-1.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700">Sí, eliminar</button>
              <button onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 text-sm font-medium bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancelar</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="text-sm text-red-500 hover:text-red-700 font-medium">Eliminar deal</button>
          )}
          <button onClick={onClose} className="px-4 py-1.5 text-sm font-medium bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cerrar</button>
        </div>
      </div>
    </div>
  );
}
