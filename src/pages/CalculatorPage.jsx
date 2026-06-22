// src/pages/CalculatorPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calcBMR } from '../utils/bmrCalculator';
import { useCalories } from '../hooks/useCalories';

export default function CalculatorPage() {
  const navigate = useNavigate();
  const { updateProfile } = useCalories();
  const [form, setForm] = useState({
    gender: 'male',
    age: '',
    height: '',
    weight: '',
    activityLevel: 'sedentary',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    ['age', 'height', 'weight'].forEach((field) => {
      if (!form[field] || isNaN(Number(form[field]))) newErrors[field] = 'Enter a valid number';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const profile = {
      gender: form.gender,
      age: Number(form.age),
      height: Number(form.height),
      weight: Number(form.weight),
      activityLevel: form.activityLevel,
    };
    const { tdee, macroGoals } = calcBMR(profile);
    updateProfile({ ...profile, tdee, macroGoals });
    navigate('/tracker');
  };

  return (
    <main className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-darktext">Daily Calorie Calculator</h2>
      <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-2xl shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <label className="block">
            <span className="text-graytext font-medium">Gender</span>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>

          <label className="block">
            <span className="text-graytext font-medium">Age (years)</span>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${errors.age ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
          </label>

          <label className="block">
            <span className="text-graytext font-medium">Height (cm)</span>
            <input
              type="number"
              name="height"
              value={form.height}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${errors.height ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
          </label>

          <label className="block">
            <span className="text-graytext font-medium">Weight (kg)</span>
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${errors.weight ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
          </label>
        </div>

        <label className="block">
          <span className="text-graytext font-medium">Activity Level</span>
          <select
            name="activityLevel"
            value={form.activityLevel}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="sedentary">Sedentary (little or no exercise)</option>
            <option value="light">Light (1-3 days/week)</option>
            <option value="moderate">Moderate (3-5 days/week)</option>
            <option value="veryActive">Very Active (6-7 days/week)</option>
          </select>
        </label>

        <button
          type="submit"
          className="w-full bg-cyan-500 text-white font-semibold py-3 rounded-lg hover:bg-cyan-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          Calculate &amp; Go to Tracker →
        </button>
      </form>
    </main>
  );
}
