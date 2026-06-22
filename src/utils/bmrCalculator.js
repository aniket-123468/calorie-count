// src/utils/bmrCalculator.js
export function calcBMR(profile) {
  const { gender, weight, height, age, activityLevel } = profile;
  if (!gender || !weight || !height || !age) {
    return { bmr: 0, tdee: 0, macroGoals: { protein: 0, carbs: 0, fat: 0 } };
  }

  const base = 10 * weight + 6.25 * height - 5 * age;
  const bmr = gender === 'male' ? base + 5 : base - 161;

  const activityFactor = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    veryActive: 1.725,
  }[activityLevel] || 1.2;

  const tdee = Math.round(bmr * activityFactor);
  const protein = Math.round((0.30 * tdee) / 4);
  const carbs = Math.round((0.50 * tdee) / 4);
  const fat = Math.round((0.20 * tdee) / 9);

  return { bmr: Math.round(bmr), tdee, macroGoals: { protein, carbs, fat } };
}
