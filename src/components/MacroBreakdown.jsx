import React from 'react';

/**
 * MacroBreakdown displays protein, carbs, and fat progress bars.
 * Props:
 *   - macros: { protein, carbs, fat } current totals in grams
 *   - goals: { protein, carbs, fat } target grams for the day
 */
export default function MacroBreakdown({ macros, goals }) {
  const items = [
    { label: 'Protein', key: 'protein', color: 'bg-cyan' },
    { label: 'Carbs', key: 'carbs', color: 'bg-pink' },
    { label: 'Fat', key: 'fat', color: 'bg-green' },
  ];

  return (
    <div className="space-y-4">
      {items.map(({ label, key, color }) => {
        const current = macros[key] || 0;
        const target = goals[key] || 0;
        const percent = target ? Math.min(100, Math.round((current / target) * 100)) : 0;
        const over = current - target;
        const helperText = over > 0 ? `${over}g over` : 'On track';
        return (
          <div key={key}>
            <div className="flex justify-between text-sm font-medium text-darktext mb-1">
              <span>{label}</span>
              <span>{current} / {target}g ({percent}%)</span>
            </div>
            <div className="w-full bg-lightgray rounded h-4 overflow-hidden">
              <div
                className={`${color} h-4`}
                style={{ width: `${percent}%`, transition: 'width 0.3s ease-out' }}
              />
            </div>
            <div className="text-xs text-graytext mt-0.5">{helperText}</div>
          </div>
        );
      })}
    </div>
  );
}
