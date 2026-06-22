// src/pages/CalculatorPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calcBMR } from '../utils/bmrCalculator';
import { useCalories } from '../hooks/useCalories';

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
  { value: 'light', label: 'Light', desc: '1-3 days/week' },
  { value: 'moderate', label: 'Moderate', desc: '3-5 days/week' },
  { value: 'veryActive', label: 'Very Active', desc: '6-7 days/week' },
];

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
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const newErrors = {};
    ['age', 'height', 'weight'].forEach((field) => {
      if (!form[field] || isNaN(Number(form[field])) || Number(form[field]) <= 0)
        newErrors[field] = 'Enter a valid positive number';
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
    const { bmr, tdee, macroGoals } = calcBMR(profile);
    setResult({ bmr, tdee, macroGoals });
    updateProfile({ ...profile, tdee, macroGoals });
  };

  const goToTracker = () => navigate('/tracker');

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-4xl font-extrabold gradient-text mb-2">Calorie Calculator</h2>
        <p className="text-slate-400 text-sm">Enter your details to get your daily calorie & macro targets.</p>
      </div>

      <div className="glass p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Gender</label>
            <div className="flex gap-3">
              {['male', 'female'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, gender: g }))}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all duration-200 ${
                    form.gender === g ? 'btn-gradient' : 'bg-white/10 text-slate-300 hover:bg-white/15'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Age / Height / Weight */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: 'age', label: 'Age', unit: 'yrs' },
              { name: 'height', label: 'Height', unit: 'cm' },
              { name: 'weight', label: 'Weight', unit: 'kg' },
            ].map(({ name, label, unit }) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  {label} <span className="text-slate-500 normal-case">({unit})</span>
                </label>
                <input
                  type="number"
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder="0"
                  className={`input-dark ${errors[name] ? 'border-red-500' : ''}`}
                />
                {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
              </div>
            ))}
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Activity Level</label>
            <div className="grid grid-cols-2 gap-2">
              {ACTIVITY_LEVELS.map(({ value, label, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, activityLevel: value }))}
                  className={`text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                    form.activityLevel === value
                      ? 'btn-gradient'
                      : 'bg-white/10 text-slate-300 hover:bg-white/15'
                  }`}
                >
                  <div className="font-semibold">{label}</div>
                  <div className={`text-xs mt-0.5 ${form.activityLevel === value ? 'text-white/70' : 'text-slate-500'}`}>{desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-gradient w-full py-3.5 text-base rounded-xl">
            Calculate My Goals →
          </button>
        </form>
      </div>

      {/* Result card */}
      {result && (
        <div className="glass p-6 animate-pulse-once">
          <h3 className="text-lg font-bold text-white mb-4">Your Daily Targets</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-3xl font-extrabold gradient-text">{result.tdee}</div>
              <div className="text-slate-400 text-xs mt-1">kcal / day (TDEE)</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-3xl font-extrabold text-cyan-400">{result.bmr}</div>
              <div className="text-slate-400 text-xs mt-1">kcal / day (BMR)</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Protein', value: result.macroGoals.protein, color: '#06B6D4' },
              { label: 'Carbs', value: result.macroGoals.carbs, color: '#EC4899' },
              { label: 'Fat', value: result.macroGoals.fat, color: '#10B981' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white/5 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold" style={{ color }}>{value}g</div>
                <div className="text-slate-400 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
          <button onClick={goToTracker} className="btn-gradient w-full py-3 rounded-xl text-sm">
            Start Tracking →
          </button>
        </div>
      )}
    </div>
  );
}
