export type LeadStage = {
  key: string;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  dotColor: string;
};

export const LEAD_STAGES: LeadStage[] = [
  {
    key: 'pendiente',
    label: 'Pendiente',
    color: 'blue',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    dotColor: 'bg-blue-400',
  },
  {
    key: 'contactado',
    label: 'Contactado',
    color: 'amber',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    dotColor: 'bg-amber-400',
  },
  {
    key: 'pendiente_presupuesto',
    label: 'Pend. Presupuesto',
    color: 'indigo',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    dotColor: 'bg-indigo-400',
  },
  {
    key: 'presupuesto_enviado',
    label: 'Presup. Enviado',
    color: 'cyan',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    dotColor: 'bg-cyan-400',
  },
  {
    key: 'pendiente_respuesta',
    label: 'Pend. Respuesta',
    color: 'violet',
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-700',
    dotColor: 'bg-violet-400',
  },
  {
    key: 'ganada',
    label: 'Ganada',
    color: 'green',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    dotColor: 'bg-green-400',
  },
  {
    key: 'perdida',
    label: 'Perdida',
    color: 'red',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    dotColor: 'bg-red-400',
  },
];

export const STAGE_MAP = Object.fromEntries(
  LEAD_STAGES.map((s) => [s.key, s])
);

export function getStage(key: string): LeadStage {
  return STAGE_MAP[key] || LEAD_STAGES[0];
}
