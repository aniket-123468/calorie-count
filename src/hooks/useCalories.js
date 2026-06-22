// src/hooks/useCalories.js
import { useState, useEffect, useCallback } from 'react';

const PROFILE_KEY = 'calorieflow_userProfile';
const MEALS_KEY = 'calorieflow_todaysMeals';
const UPDATED_KEY = 'calorieflow_lastUpdated';

/**
 * Hook to manage user profile and meals with localStorage persistence.
 * Returns the stored profile, meals array, totals, and CRUD functions.
 */
export function useCalories() {
  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [meals, setMeals] = useState(() => {
    try {
      const stored = localStorage.getItem(MEALS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // sync profile to localStorage
  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    localStorage.setItem(UPDATED_KEY, new Date().toISOString());
  }, [profile]);

  // sync meals to localStorage
  useEffect(() => {
    localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
    localStorage.setItem(UPDATED_KEY, new Date().toISOString());
  }, [meals]);

  const addMeal = useCallback((meal) => {
    setMeals((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ...meal,
      },
    ]);
  }, []);

  const deleteMeal = useCallback((id) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const updateProfile = useCallback((newProfile) => {
    setProfile((prev) => ({ ...prev, ...newProfile }));
  }, []);

  const totals = meals.reduce(
    (acc, m) => {
      acc.calories += Number(m.calories) || 0;
      acc.protein += Number(m.protein) || 0;
      acc.carbs += Number(m.carbs) || 0;
      acc.fat += Number(m.fat) || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return {
    profile,
    meals,
    totals,
    addMeal,
    deleteMeal,
    updateProfile,
  };
}
