'use client';

import { useState } from 'react';

type ContentModule = {
  title: string;
  topics: string[];
  dynamic?: string;
};

export function ContentModulesAccordion({ modules }: { modules: ContentModule[] }) {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setOpenIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {modules.map((mod, i) => {
        const isOpen = openIndexes.has(i);
        return (
          <div
            key={i}
            className={`rounded-lg border transition-all duration-300 ${
              isOpen
                ? 'border-brand-navy/20 bg-white shadow-sm'
                : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(i)}
              className="flex w-full items-center gap-4 px-5 py-4 text-left"
            >
              <span className="text-sm font-medium text-slate-400">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="flex-1 text-[15px] font-semibold text-slate-800">{mod.title}</span>
              <svg
                className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              {(mod.topics.length > 0 || mod.dynamic) && (
                <div className="border-t border-slate-100 px-5 pt-3 pb-5 pl-14">
                  {mod.topics.length > 0 && (
                    <ul className="space-y-2">
                      {mod.topics.map((topic, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600"
                        >
                          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  )}
                  {mod.dynamic && (
                    <p className="mt-4 text-sm leading-relaxed text-slate-500 italic">
                      Dinámica: {mod.dynamic}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
