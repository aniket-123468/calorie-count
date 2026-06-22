import React from 'react';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/solid'; // assuming heroicons installed, otherwise use emojis

/**
 * MealCard displays a single meal entry.
 * Props:
 *   - meal: { id, name, calories, protein?, carbs?, fat?, time, category }
 *   - onDelete: (id) => void
 *   - onAddSimilar: (meal) => void
 */
export default function MealCard({ meal, onDelete, onAddSimilar }) {
  const { id, name, calories, time, category } = meal;
  return (
    <div className="flex justify-between items-center p-3 border-b border-border hover:bg-lightgray transition-colors duration-100">
      <div className="flex-1">
        <div className="font-mono font-bold text-darktext">{name}</div>
        <div className="text-sm text-graytext">{calories} kcal • {category || 'Meal'} • {time}</div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => onAddSimilar(meal)}
          className="text-cyan hover:text-cyan-700 transition-colors duration-100"
          title="Add similar"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(id)}
          className="text-red-600 hover:text-red-800 transition-colors duration-100"
          title="Delete"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
