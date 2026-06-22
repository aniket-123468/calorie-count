import React from 'react';

const MACROS = [
  { label: 'Protein', key: 'protein', from: '#06B6D4', to: '#0891b2' },
  { label: 'Carbs',   key: 'carbs',   from: '#EC4899', to: '#db2777' },
  { label: 'Fat',     key: 'fat',     from: '#10B981', to: '#059669' },
];

export default function MacroBreakdown({ macros = {}, goals = {} }) {
  return (
    <div className="space-y-4">
      {MACROS.map(({ label, key, from, to }) => {
        const current = macros[key] || 0;
        const target = goals[key] || 0;
        const pct = target ? Math.min(100, Math.round((current / target) * 100)) : 0;
        return (
          <div key={key}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-semibold text-white">{label}</span>
              <span className="text-slate-400">
                <span style={{ color: from }} className="font-bold">{current}g</span>
                &nbsp;/ {target}g
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full macro-bar"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${from}, ${to})`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
