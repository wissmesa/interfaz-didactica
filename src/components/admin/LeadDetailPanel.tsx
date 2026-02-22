'use client';

import { useState, useEffect, useCallback } from 'react';
import { LEAD_STAGES, getStage } from '@/lib/lead-stages';

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
  created_at: string;
  updated_at: string;
};

type Activity = {
  id: number;
  lead_id: number;
  from_status: string | null;
  to_status: string;
  note: string | null;
  created_at: string;
};

type Props = {
  leadId: number;
  onClose: () => void;
  onUpdate: () => void;
};

export default function LeadDetailPanel({ leadId, onClose, onUpdate }: Props) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState('');
  const [newNote, setNewNote] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const fetchLead = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`);
      const data = await res.json();
      setLead(data.lead);
      setActivities(data.activities || []);
      setNotes(data.lead.notes || '');
    } catch {
      console.error('Error fetching lead detail');
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  const handleStatusChange = async (newStatus: string) => {
    if (!lead || lead.status === newStatus) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchLead();
      onUpdate();
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!lead) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      await fetchLead();
      onUpdate();
    } finally {
      setSaving(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      await fetch(`/api/admin/leads/${leadId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newNote }),
      });
      setNewNote('');
      await fetchLead();
    } catch {
      console.error('Error adding note');
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`/api/admin/leads/${leadId}`, { method: 'DELETE' });
      onUpdate();
      onClose();
    } catch {
      console.error('Error deleting lead');
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

  if (!lead) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        <div className="absolute inset-0 bg-black/30" onClick={onClose} />
        <div className="relative w-full max-w-lg bg-white shadow-2xl p-8 text-center text-slate-500">
          Lead no encontrado.
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden animate-slide-in-right">
        {/* Panel Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Detalle del Lead</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Contact Info */}
          <div className="px-6 py-5 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              {lead.name}{lead.lastname ? ` ${lead.lastname}` : ''}
            </h3>
            <div className="space-y-2 mt-3">
              <InfoRow icon="email" label="Email" value={lead.email} />
              {lead.company && <InfoRow icon="company" label="Empresa" value={lead.company} />}
              {lead.phone && <InfoRow icon="phone" label="Teléfono" value={lead.phone} />}
              {lead.interest && <InfoRow icon="interest" label="Interés" value={lead.interest} />}
              {lead.source && <InfoRow icon="source" label="Origen" value={lead.source} />}
              <InfoRow
                icon="date"
                label="Creado"
                value={new Date(lead.created_at).toLocaleDateString('es-VE', {
                  day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              />
            </div>
            {lead.message && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-medium text-slate-500 mb-1">Mensaje</p>
                <p className="text-sm text-slate-700">{lead.message}</p>
              </div>
            )}
          </div>

          {/* Status Selector */}
          <div className="px-6 py-5 border-b border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Estado del lead</p>
            <div className="flex flex-wrap gap-2">
              {LEAD_STAGES.map((s) => (
                <button
                  key={s.key}
                  onClick={() => handleStatusChange(s.key)}
                  disabled={saving}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    lead.status === s.key
                      ? `${s.bgColor} ${s.textColor} border-current ring-2 ring-current/20`
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${lead.status === s.key ? s.dotColor : 'bg-slate-300'}`} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="px-6 py-5 border-b border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Notas internas</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Agregar notas sobre este lead…"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 resize-none"
            />
            <button
              onClick={handleSaveNotes}
              disabled={saving || notes === (lead.notes || '')}
              className="mt-2 px-4 py-1.5 text-sm font-medium bg-brand-orange text-white rounded-lg hover:bg-brand-orange-hover disabled:opacity-40 transition-colors"
            >
              {saving ? 'Guardando…' : 'Guardar notas'}
            </button>
          </div>

          {/* Activity Timeline */}
          <div className="px-6 py-5">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">Historial de actividad</p>

            {/* Add manual note */}
            <div className="flex gap-2 mb-5">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                placeholder="Agregar comentario…"
                className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
              />
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="px-3 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors"
              >
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
                    const isStatusChange = activity.from_status !== activity.to_status;
                    const toStage = getStage(activity.to_status);
                    return (
                      <div key={activity.id} className="relative pl-8">
                        <div className={`absolute left-1.5 top-1 w-3 h-3 rounded-full border-2 border-white ${
                          isStatusChange ? toStage.dotColor : 'bg-slate-300'
                        }`} />
                        <div className="text-sm">
                          {isStatusChange ? (
                            <p className="text-slate-700">
                              <span className="font-medium">Estado cambiado</span>
                              {activity.from_status && (
                                <>
                                  {' de '}
                                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getStage(activity.from_status).bgColor} ${getStage(activity.from_status).textColor}`}>
                                    {getStage(activity.from_status).label}
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
                          {isStatusChange && activity.note && (
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
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Sí, eliminar
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-1.5 text-sm font-medium bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-sm text-red-500 hover:text-red-700 font-medium"
            >
              Eliminar lead
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm font-medium bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  const icons: Record<string, React.ReactNode> = {
    email: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    company: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    phone: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    interest: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    source: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    date: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  };

  return (
    <div className="flex items-center gap-2.5 text-sm">
      <span className="text-slate-400">{icons[icon]}</span>
      <span className="text-slate-500 min-w-[70px]">{label}</span>
      <span className="text-slate-800 font-medium">{value}</span>
    </div>
  );
}
