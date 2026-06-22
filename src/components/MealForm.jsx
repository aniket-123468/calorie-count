import { useState } from 'react';
import { useCalories } from '../hooks/useCalories';
import { v4 as uuidv4 } from 'uuid';

export default function MealForm({ isOpen, onClose }) {
  const { addMeal } = useCalories();
  const [form, setForm] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    category: 'Meal',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name required';
    if (!form.calories || isNaN(Number(form.calories)) || Number(form.calories) <= 0)
      newErrors.calories = 'Enter a positive number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const now = new Date();
    const meal = {
      id: uuidv4(),
      name: form.name.trim(),
      calories: Number(form.calories),
      protein: form.protein ? Number(form.protein) : 0,
      carbs: form.carbs ? Number(form.carbs) : 0,
      fat: form.fat ? Number(form.fat) : 0,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: form.category,
    };
    addMeal(meal);
    setForm({ name: '', calories: '', protein: '', carbs: '', fat: '', category: 'Meal' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Add Custom Meal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" htmlFor="name">Meal Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" htmlFor="calories">Calories</label>
            <input
              id="calories"
              name="calories"
              type="number"
              min="0"
              value={form.calories}
              onChange={handleChange}
              className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${errors.calories ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.calories && <p className="text-sm text-red-600">{errors.calories}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" htmlFor="protein">Protein (g)</label>
              <input id="protein" name="protein" type="number" min="0" value={form.protein} onChange={handleChange} className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" htmlFor="carbs">Carbs (g)</label>
              <input id="carbs" name="carbs" type="number" min="0" value={form.carbs} onChange={handleChange} className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" htmlFor="fat">Fat (g)</label>
              <input id="fat" name="fat" type="number" min="0" value={form.fat} onChange={handleChange} className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300" htmlFor="category">Category</label>
              <select id="category" name="category" value={form.category} onChange={handleChange} className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 border-gray-300">
                <option>Meal</option>
                <option>Snack</option>
                <option>Beverage</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400">
              Add Meal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
