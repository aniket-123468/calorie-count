// src/pages/TrackerPage.jsx
import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import CircularProgress from '../components/CircularProgress';
import MacroBreakdown from '../components/MacroBreakdown';
import MealList from '../components/MealList';
import EmptyState from '../components/EmptyState';
import QuickAdd from '../components/QuickAdd';
import MealForm from '../components/MealForm';
import { useCalories } from '../hooks/useCalories';

// Build last-7-days chart data from meals in localStorage
function buildWeekData(meals) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString('en-US', { weekday: 'short' });
    days.push({ day: key, calories: 0 });
  }
  // today is last slot
  const today = days[days.length - 1];
  today.calories = meals.reduce((s, m) => s + (Number(m.calories) || 0), 0);
  return days;
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass px-3 py-2 text-sm text-white">
        <span className="font-bold gradient-text">{payload[0].value}</span> kcal
      </div>
    );
  }
  return null;
};

export default function TrackerPage() {
  const { profile, meals, totals, deleteMeal, addMeal } = useCalories();
  const [isFormOpen, setFormOpen] = useState(false);

  const handleAddSimilar = (meal) => {
    addMeal({
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein || 0,
      carbs: meal.carbs || 0,
      fat: meal.fat || 0,
      category: meal.category || 'Meal',
    });
  };

  const { tdee = 2000, macroGoals = { protein: 150, carbs: 250, fat: 65 } } = profile;
  const weekData = buildWeekData(meals);
  const pct = Math.min(100, Math.round((totals.calories / tdee) * 100));

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h2 className="text-4xl font-extrabold gradient-text mb-1">Today's Tracker</h2>
        <p className="text-slate-400 text-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Progress ring + macro bars */}
      <div className="glass p-6 flex flex-col sm:flex-row gap-6 items-center">
        <div className="flex flex-col items-center shrink-0">
          <CircularProgress calories={totals.calories} goal={tdee} size={160} />
          <div className="mt-3 text-xs text-slate-400">{pct}% of daily goal</div>
        </div>
        <div className="flex-1 w-full">
          <MacroBreakdown macros={totals} goals={macroGoals} />
        </div>
      </div>

      {/* Weekly bar chart (Recharts) */}
      <div className="glass p-5">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Weekly Overview</h3>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={weekData} barCategoryGap="30%">
            <XAxis
              dataKey="day"
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar dataKey="calories" radius={[6, 6, 0, 0]}>
              {weekData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    index === weekData.length - 1
                      ? 'url(#barGradient)'
                      : 'rgba(255,255,255,0.1)'
                  }
                />
              ))}
            </Bar>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick add */}
      <div className="glass p-5">
        <QuickAdd />
      </div>

      {/* Add custom meal */}
      <button
        type="button"
        onClick={() => setFormOpen(true)}
        className="btn-gradient w-full py-3.5 text-base rounded-xl"
      >
        + Add Custom Meal
      </button>

      {isFormOpen && <MealForm isOpen={true} onClose={() => setFormOpen(false)} />}

      {/* Meal list */}
      {meals && meals.length > 0 ? (
        <div className="glass overflow-hidden">
          <MealList meals={meals} onDelete={deleteMeal} onAddSimilar={handleAddSimilar} />
        </div>
      ) : (
        <EmptyState message="No meals logged yet. Use Quick Add or add a custom meal!" />
      )}
    </div>
  );
}
