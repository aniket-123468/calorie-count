// src/utils/calculations.js
/**
 * Compute BMR using Mifflin‑St Jeor.
 */
export function calculateBMR({ gender, weight, height, age }) {
  if (!gender || !weight || !height || !age) return 0;
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
}

/** Activity factor lookup */
export const activityFactors = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  veryActive: 1.725,
};

/**
 * Compute TDEE from BMR and activity factor key.
 */
export function calculateTDEE(bmr, activityLevel = 'sedentary') {
  const factor = activityFactors[activityLevel] || 1.2;
  return Math.round(bmr * factor);
}

/**
 * Compute macro gram targets from TDEE.
 * Returns { protein, carbs, fat } in grams.
 */
export function calculateMacroGoals(tdee) {
  if (!tdee) return { protein: 0, carbs: 0, fat: 0 };
  const protein = Math.round((0.30 * tdee) / 4);
  const carbs = Math.round((0.50 * tdee) / 4);
  const fat = Math.round((0.20 * tdee) / 9);
  return { protein, carbs, fat };
}

/**
 * Sum meals to totals.
 * meals: array of { calories, protein?, carbs?, fat? }
 */
export function sumMeals(meals) {
  return meals.reduce(
    (acc, m) => {
      acc.calories += Number(m.calories) || 0;
      acc.protein += Number(m.protein) || 0;
      acc.carbs += Number(m.carbs) || 0;
      acc.fat += Number(m.fat) || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}
