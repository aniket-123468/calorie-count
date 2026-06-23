// src/pages/CalculatorPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calcBMR } from '../utils/bmrCalculator';
import { useCalories } from '../hooks/useCalories';
import { ArrowLeft, Beef, Wheat, Droplets } from 'lucide-react';

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
  const goToDashboard = () => navigate('/dashboard');

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={goToDashboard}
            className="p-2 rounded-xl bg-card border border-border hover:bg-muted transition-colors"
          >
            <ArrowLeft size={16} className="text-foreground" />
          </button>
          <div>
            <h2
              className="text-2xl text-foreground"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
            >
              Calorie Calculator
            </h2>
            <p className="text-muted-foreground text-sm">Enter your details to get your daily calorie & macro targets.</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Gender */}
            <div>
              <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-2" style={{ fontFamily: "'DM Mono', monospace" }}>Gender</label>
              <div className="flex gap-3">
                {['male', 'female'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, gender: g }))}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all duration-200 ${
                      form.gender === g ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'
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
                  <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-2" style={{ fontFamily: "'DM Mono', monospace" }}>
                    {label} <span className="normal-case">({unit})</span>
                  </label>
                  <input
                    type="number"
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder="0"
                    className={`input-dark ${errors[name] ? 'border-destructive' : ''}`}
                  />
                  {errors[name] && <p className="text-destructive text-xs mt-1">{errors[name]}</p>}
                </div>
              ))}
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-2" style={{ fontFamily: "'DM Mono', monospace" }}>Activity Level</label>
              <div className="grid grid-cols-2 gap-2">
                {ACTIVITY_LEVELS.map(({ value, label, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, activityLevel: value }))}
                    className={`text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                      form.activityLevel === value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    <div className="font-medium">{label}</div>
                    <div className={`text-xs mt-0.5 ${form.activityLevel === value ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{desc}</div>
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
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3
              className="text-lg text-foreground mb-4"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
            >
              Your Daily Targets
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-muted rounded-xl p-4 text-center">
                <div
                  className="text-3xl text-foreground"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                >
                  {result.tdee}
                </div>
                <div className="text-muted-foreground text-xs mt-1">kcal / day (TDEE)</div>
              </div>
              <div className="bg-muted rounded-xl p-4 text-center">
                <div
                  className="text-3xl text-accent"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                >
                  {result.bmr}
                </div>
                <div className="text-muted-foreground text-xs mt-1">kcal / day (BMR)</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Protein', value: result.macroGoals.protein, color: '#2D4A3E', icon: Beef },
                { label: 'Carbs', value: result.macroGoals.carbs, color: '#D4845A', icon: Wheat },
                { label: 'Fat', value: result.macroGoals.fat, color: '#7FB5A0', icon: Droplets },
              ].map(({ label, value, color, icon: Icon }) => (
                <div key={label} className="bg-muted rounded-xl p-3 text-center">
                  <Icon size={16} className="mx-auto mb-1" style={{ color }} />
                  <div className="text-xl font-bold text-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>{value}g</div>
                  <div className="text-muted-foreground text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>
            <button onClick={goToTracker} className="btn-gradient w-full py-3 rounded-xl text-sm">
              Start Tracking →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
