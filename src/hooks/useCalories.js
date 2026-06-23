// src/hooks/useCalories.js
import { useState, useEffect, useCallback } from 'react';
import { profileAPI, mealsAPI, getToken } from '../services/api';

const PROFILE_KEY = 'calorieflow_userProfile';
const MEALS_KEY = 'calorieflow_todaysMeals';
const UPDATED_KEY = 'calorieflow_lastUpdated';

/**
 * Hook to manage user profile and meals with API integration.
 * Falls back to localStorage if no token is present.
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = !!getToken();

  // Load profile from API on mount if authenticated
  useEffect(() => {
    const loadProfile = async () => {
      if (isAuthenticated) {
        try {
          setLoading(true);
          const data = await profileAPI.getProfile();
          setProfile(data);
        } catch (err) {
          console.error('Failed to load profile:', err);
          // Fall back to localStorage
        } finally {
          setLoading(false);
        }
      }
    };
    loadProfile();
  }, [isAuthenticated]);

  // Load meals from API on mount if authenticated
  useEffect(() => {
    const loadMeals = async () => {
      if (isAuthenticated) {
        try {
          setLoading(true);
          const data = await mealsAPI.getToday();
          setMeals(data);
        } catch (err) {
          console.error('Failed to load meals:', err);
          // Fall back to localStorage
        } finally {
          setLoading(false);
        }
      }
    };
    loadMeals();
  }, [isAuthenticated]);

  // sync profile to localStorage (fallback)
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      localStorage.setItem(UPDATED_KEY, new Date().toISOString());
    }
  }, [profile, isAuthenticated]);

  // sync meals to localStorage (fallback)
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
      localStorage.setItem(UPDATED_KEY, new Date().toISOString());
    }
  }, [meals, isAuthenticated]);

  const addMeal = useCallback(async (meal) => {
    if (isAuthenticated) {
      try {
        const newMeal = await mealsAPI.create(meal);
        setMeals((prev) => [...prev, newMeal]);
      } catch (err) {
        console.error('Failed to add meal:', err);
        // Fall back to localStorage
        setMeals((prev) => [
          ...prev,
          {
            _id: Date.now().toString(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            ...meal,
          },
        ]);
      }
    } else {
      setMeals((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          ...meal,
        },
      ]);
    }
  }, [isAuthenticated]);

  const deleteMeal = useCallback(async (id) => {
    if (isAuthenticated) {
      try {
        await mealsAPI.delete(id);
        setMeals((prev) => prev.filter((m) => m._id !== id));
      } catch (err) {
        console.error('Failed to delete meal:', err);
        // Fall back to localStorage
        setMeals((prev) => prev.filter((m) => m.id !== id || m._id !== id));
      }
    } else {
      setMeals((prev) => prev.filter((m) => m.id !== id));
    }
  }, [isAuthenticated]);

  const updateProfile = useCallback(async (newProfile) => {
    if (isAuthenticated) {
      try {
        const updated = await profileAPI.updateProfile(newProfile);
        setProfile(updated);
      } catch (err) {
        console.error('Failed to update profile:', err);
        // Fall back to localStorage
        setProfile((prev) => ({ ...prev, ...newProfile }));
      }
    } else {
      setProfile((prev) => ({ ...prev, ...newProfile }));
    }
  }, [isAuthenticated]);

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
    loading,
    error,
    isAuthenticated,
  };
}
