import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  TrendingUp,
  Droplets,
  Plus,
  Search,
  Bell,
  ChevronRight,
  Flame,
  Zap,
  Beef,
  Wheat,
  Check,
  X,
  LogOut,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { authAPI, mealsAPI } from "../services/api";
import { useCalories } from "../hooks/useCalories";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: UtensilsCrossed, label: "Food Log", active: false },
  { icon: TrendingUp, label: "Progress", active: false },
  { icon: Droplets, label: "Hydration", active: false },
];

const recentFoods = [
  { name: "Greek Yogurt", cal: 100, protein: "17g" },
  { name: "Chicken Breast", cal: 165, protein: "31g" },
  { name: "Brown Rice", cal: 215, protein: "5g" },
  { name: "Avocado", cal: 160, protein: "2g" },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { profile, meals, totals, addMeal, deleteMeal, isAuthenticated } = useCalories();
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [waterGlasses, setWaterGlasses] = useState(5);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const waterGoal = 8;
  const todayCalories = profile.tdee || 2000;
  const consumed = totals.calories;
  const remaining = todayCalories - consumed;
  const burnedExercise = 320;
  const netCalories = consumed - burnedExercise;
  const percentage = Math.round((consumed / todayCalories) * 100);

  const ringData = [
    { name: "consumed", value: consumed, fill: "#2D4A3E" },
    { name: "remaining", value: remaining > 0 ? remaining : 0, fill: "#EDE7DE" },
  ];

  const macroData = [
    { name: "Protein", value: totals.protein, goal: profile.macroGoals?.protein || 160, color: "#2D4A3E" },
    { name: "Carbs", value: totals.carbs, goal: profile.macroGoals?.carbs || 250, color: "#D4845A" },
    { name: "Fat", value: totals.fat, goal: profile.macroGoals?.fat || 70, color: "#7FB5A0" },
  ];

  const weeklyData = [
    { day: "Mon", calories: 1820, goal: todayCalories },
    { day: "Tue", calories: 2100, goal: todayCalories },
    { day: "Wed", calories: 1750, goal: todayCalories },
    { day: "Thu", calories: 1980, goal: todayCalories },
    { day: "Fri", calories: 2240, goal: todayCalories },
    { day: "Sat", calories: 1650, goal: todayCalories },
    { day: "Sun", calories: consumed, goal: todayCalories },
  ];

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  const handleAddMeal = async (foodName) => {
    const food = recentFoods.find(f => f.name === foodName);
    if (food) {
      await addMeal({
        name: food.name,
        calories: food.cal,
        protein: parseInt(food.protein),
        carbs: 0,
        fat: 0,
        category: 'Snack',
      });
      setShowAddModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Add Food Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2
                className="text-xl text-foreground"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
              >
                Add Food
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
              <input
                className="w-full bg-muted rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Search foods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
              Recent
            </p>
            <div className="space-y-2">
              {recentFoods.map((food) => (
                <div
                  key={food.name}
                  onClick={() => handleAddMeal(food.name)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-muted cursor-pointer transition-colors group"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{food.name}</p>
                    <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                      {food.cal} kcal · {food.protein} protein
                    </p>
                  </div>
                  <button className="p-1.5 rounded-lg bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowAddModal(false)}
              className="w-full mt-5 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Browse All Foods
            </button>
          </div>
        </div>
      )}

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0 bg-card border-r border-border flex flex-col py-8 px-4 hidden md:flex">
          <div className="mb-10 px-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <Flame size={14} className="text-primary-foreground" />
              </div>
              <span
                className="text-lg text-foreground"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
              >
                Nourish
              </span>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={() => setActiveNav(label)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  activeNav === label
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          {/* Top bar */}
          <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <h1
                className="text-xl text-foreground mt-0.5"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
              >
                Good morning, {profile.name || 'there'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-xl bg-card border border-border hover:bg-muted transition-colors relative">
                <Bell size={16} className="text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent rounded-full" />
              </button>
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                A
              </div>
            </div>
          </header>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Calorie summary card */}
            <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>
                    Today's calories
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-4xl text-foreground"
                      style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                    >
                      {consumed.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground text-sm">/ {todayCalories.toLocaleString()} kcal</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm hover:bg-primary/90 transition-colors"
                >
                  <Plus size={14} />
                  Add food
                </button>
              </div>

              <div className="flex items-center gap-8">
                {/* Ring */}
                <div className="relative flex-shrink-0">
                  <PieChart width={140} height={140}>
                    <Pie
                      data={ringData}
                      cx={65}
                      cy={65}
                      innerRadius={48}
                      outerRadius={65}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {ringData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className="text-2xl text-foreground"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      {percentage}%
                    </span>
                    <span className="text-xs text-muted-foreground">goal</span>
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex-1 grid grid-cols-3 gap-4">
                  {[
                    { label: "Consumed", value: consumed, unit: "kcal", icon: UtensilsCrossed, color: "text-foreground" },
                    { label: "Burned", value: burnedExercise, unit: "kcal", icon: Flame, color: "text-accent" },
                    { label: "Remaining", value: remaining, unit: "kcal", icon: Zap, color: "text-primary" },
                  ].map(({ label, value, unit, icon: Icon, color }) => (
                    <div key={label} className="bg-muted rounded-xl p-3.5">
                      <Icon size={14} className={`${color} mb-2`} />
                      <p
                        className={`text-xl ${color}`}
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        {value.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{label} · {unit}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-6">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Macros card */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-5" style={{ fontFamily: "'DM Mono', monospace" }}>
                Macronutrients
              </p>
              <div className="space-y-5">
                {macroData.map(({ name, value, goal, color }) => {
                  const pct = Math.round((value / goal) * 100);
                  const icons = {
                    Protein: <Beef size={14} />,
                    Carbs: <Wheat size={14} />,
                    Fat: <Droplets size={14} />,
                  };
                  return (
                    <div key={name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5" style={{ color }}>
                          {icons[name]}
                          <span className="text-sm font-medium text-foreground">{name}</span>
                        </div>
                        <span
                          className="text-sm text-foreground"
                          style={{ fontFamily: "'DM Mono', monospace" }}
                        >
                          {value}g
                          <span className="text-muted-foreground">/{goal}g</span>
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Net summary */}
              <div className="mt-6 pt-5 border-t border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Net intake
                </p>
                <p
                  className="text-3xl text-foreground"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                >
                  {netCalories.toLocaleString()}
                  <span className="text-base text-muted-foreground ml-1">kcal</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {todayCalories - netCalories} under your goal — great work
                </p>
              </div>
            </div>

            {/* Meal log */}
            <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="text-xs text-muted-foreground uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Today's meals
                </p>
                <button className="text-xs text-primary flex items-center gap-1 hover:underline">
                  View all <ChevronRight size={12} />
                </button>
              </div>
              <div className="space-y-3">
                {meals.length > 0 ? (
                  meals.map((meal) => (
                    <div
                      key={meal._id || meal.id}
                      className="group flex items-start gap-4 p-4 rounded-xl hover:bg-muted transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-muted group-hover:bg-card flex items-center justify-center flex-shrink-0 transition-colors">
                        <UtensilsCrossed size={16} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground">{meal.name}</p>
                          <p
                            className="text-sm text-foreground"
                            style={{ fontFamily: "'DM Mono', monospace" }}
                          >
                            {meal.calories} kcal
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {meal.protein || 0}g protein · {meal.carbs || 0}g carbs · {meal.fat || 0}g fat
                        </p>
                      </div>
                      <button
                        onClick={() => deleteMeal(meal._id || meal.id)}
                        className="text-xs text-destructive hover:text-destructive/80 flex-shrink-0 mt-0.5"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-4">No meals logged today</p>
                )}
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="w-full mt-3 py-2.5 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={14} />
                Log a meal
              </button>
            </div>

            {/* Water tracker */}
            <div className="bg-card rounded-2xl border border-border p-6 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <p className="text-xs text-muted-foreground uppercase tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Hydration
                </p>
                <Droplets size={14} className="text-blue-400" />
              </div>

              <div className="flex-1">
                <div className="flex items-baseline gap-1 mb-1">
                  <span
                    className="text-4xl text-foreground"
                    style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                  >
                    {waterGlasses}
                  </span>
                  <span className="text-muted-foreground text-sm">/ {waterGoal} glasses</span>
                </div>
                <p className="text-xs text-muted-foreground mb-5">
                  {waterGoal - waterGlasses > 0
                    ? `${waterGoal - waterGlasses} more to reach your goal`
                    : "Daily goal reached!"}
                </p>

                <div className="grid grid-cols-4 gap-2 mb-5">
                  {Array.from({ length: waterGoal }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setWaterGlasses(i < waterGlasses ? i : i + 1)}
                      className={`h-10 rounded-xl flex items-center justify-center transition-all ${
                        i < waterGlasses
                          ? "bg-blue-100 text-blue-500"
                          : "bg-muted text-muted-foreground hover:bg-blue-50"
                      }`}
                    >
                      <Droplets size={16} />
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setWaterGlasses((p) => Math.min(p + 1, waterGoal))}
                className="w-full py-2.5 rounded-xl bg-blue-50 text-blue-500 text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={14} />
                Add glass
              </button>
            </div>

            {/* Weekly chart */}
            <div className="lg:col-span-3 bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>
                    Weekly overview
                  </p>
                  <h3
                    className="text-lg text-foreground"
                    style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
                  >
                    Calorie history
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-primary inline-block" />
                    Calories
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-accent inline-block rounded-full" />
                    Goal
                  </span>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={weeklyData} margin={{ top: 4, right: 0, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2D4A3E" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2D4A3E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(45,74,62,0.08)" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fontFamily: "'DM Mono', monospace", fill: "#7A6E65" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fontFamily: "'DM Mono', monospace", fill: "#7A6E65" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[1000, 2500]}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#FEFCF9",
                      border: "1px solid rgba(45,74,62,0.12)",
                      borderRadius: "12px",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 12,
                    }}
                    formatter={(value) => [`${value} kcal`, "Calories"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="goal"
                    stroke="#D4845A"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fill="none"
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="calories"
                    stroke="#2D4A3E"
                    strokeWidth={2}
                    fill="url(#calGrad)"
                    dot={{ fill: "#2D4A3E", r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: "#2D4A3E" }}
                  />
                </AreaChart>
              </ResponsiveContainer>

              {/* Day summaries */}
              <div className="mt-4 grid grid-cols-7 gap-2">
                {weeklyData.map((d) => {
                  const under = d.calories <= d.goal;
                  return (
                    <div key={d.day} className="text-center">
                      <div
                        className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center ${
                          under ? "bg-primary/10" : "bg-accent/10"
                        }`}
                      >
                        {under ? (
                          <Check size={10} className="text-primary" />
                        ) : (
                          <X size={10} className="text-accent" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                        {d.day}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
