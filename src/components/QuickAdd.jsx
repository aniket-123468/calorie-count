import React from 'react';
import { useCalories } from '../hooks/useCalories';
import { foodDatabase } from '../data/foodDatabase';

// Take first 8 foods for quick add
const QUICK_FOODS = foodDatabase.slice(0, 8);

export default function QuickAdd() {
  const { addMeal } = useCalories();

  const handleAdd = (food) => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    addMeal({
      name: food.name,
      calories: food.calories,
      protein: food.protein || 0,
      carbs: food.carbs || 0,
      fat: food.fat || 0,
      category: 'QuickAdd',
      time,
    });
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium text-graytext mb-4">Quick Add</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {QUICK_FOODS.map((food) => (
          <button
            key={food.name}
            onClick={() => handleAdd(food)}
            className="flex flex-col items-center p-3 border border-border rounded-lg hover:bg-lightgray transition-colors"
          >
            {/* Placeholder icon – you can replace with Heroicons if desired */}
            <div className="w-8 h-8 mb-2 bg-cyan rounded-full" />
            <span className="text-sm font-medium text-darktext">{food.name}</span>
            <span className="text-xs text-graytext">{food.calories} cal</span>
          </button>
        ))}
      </div>
    </div>
  );
}
