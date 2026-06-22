// src/components/MealList.jsx
import React from 'react';
import MealCard from './MealCard';

/**
 * MealList renders a list of meals or an EmptyState when none exist.
 */
export default function MealList({ meals, onDelete, onAddSimilar }) {
  if (!meals || meals.length === 0) {
    return null; // EmptyState will be rendered by parent if needed
  }
  return (
    <div className="divide-y divide-border">
      {meals.map((meal) => (
        <MealCard
          key={meal.id}
          meal={meal}
          onDelete={onDelete}
          onAddSimilar={onAddSimilar}
        />
      ))}
    </div>
  );
}
