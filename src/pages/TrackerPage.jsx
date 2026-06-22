// src/pages/TrackerPage.jsx
import React, { useState } from 'react';
import CircularProgress from '../components/CircularProgress';
import MacroBreakdown from '../components/MacroBreakdown';
import MealList from '../components/MealList';
import EmptyState from '../components/EmptyState';
import QuickAdd from '../components/QuickAdd';
import MealForm from '../components/MealForm';
import { useCalories } from '../hooks/useCalories';

export default function TrackerPage() {
  const { profile, meals, totals, deleteMeal, addMeal } = useCalories();
  const [isFormOpen, setFormOpen] = useState(false);

  const handleAddSimilar = (meal) => {
    const similar = {
      ...meal,
      id: undefined,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    addMeal(similar);
  };

  const { tdee = 2000, macroGoals = { protein: 150, carbs: 250, fat: 65 } } = profile;

  return (
    <main className="w-full max-w-2xl mx-auto p-4 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-darktext self-start">Today's Tracker</h2>

      <CircularProgress calories={totals.calories} goal={tdee} size={160} />

      <div className="w-full mt-6">
        <MacroBreakdown macros={totals} goals={macroGoals} />
      </div>

      <QuickAdd />

      <button
        type="button"
        onClick={() => setFormOpen(true)}
        className="mt-4 w-full bg-cyan-500 text-white font-semibold py-3 rounded-lg hover:bg-cyan-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
      >
        + Add Custom Meal
      </button>

      {isFormOpen && <MealForm isOpen={true} onClose={() => setFormOpen(false)} />}

      {meals && meals.length > 0 ? (
        <MealList meals={meals} onDelete={deleteMeal} onAddSimilar={handleAddSimilar} />
      ) : (
        <EmptyState message="No meals logged yet. Add some!" />
      )}
    </main>
  );
}
