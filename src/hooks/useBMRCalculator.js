// src/hooks/useBMRCalculator.js
import { useMemo } from 'react';

/**
 * Calculate Basal Metabolic Rate (BMR) using Mifflin‑St Jeor formula.
 * @param {Object} profile - { gender: 'male'|'female', weight (kg), height (cm), age, activityLevel }
 * @returns {{bmr: number, tdee: number, macroGoals: {protein: number, carbs: number, fat: number}}}
 */
export function useBMRCalculator(profile) {
  const { gender, weight, height, age, activityLevel } = profile;

  const bmr = useMemo(() => {
    if (!gender || !weight || !height || !age) return 0;
    const base = 10 * weight + 6.25 * height - 5 * age;
    return gender === 'male' ? base + 5 : base - 161;
  }, [gender, weight, height, age]);

  const activityFactor = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    veryActive: 1.725,
  }[activityLevel] || 1.2;

  const tdee = useMemo(() => Math.round(bmr * activityFactor), [bmr, activityFactor]);

  const macroGoals = useMemo(() => {
    if (!tdee) return { protein: 0, carbs: 0, fat: 0 };
    const protein = Math.round((0.30 * tdee) / 4); // 4 kcal per g protein
    const carbs = Math.round((0.50 * tdee) / 4);   // 4 kcal per g carbs
    const fat = Math.round((0.20 * tdee) / 9);     // 9 kcal per g fat
    return { protein, carbs, fat };
  }, [tdee]);

  return { bmr, tdee, macroGoals };
}
