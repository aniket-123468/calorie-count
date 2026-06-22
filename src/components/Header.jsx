import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header
      style={{
        background: 'rgba(15,23,42,0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}
      className="sticky top-0 z-50 py-4"
    >
      <div className="max-w-3xl mx-auto flex justify-between items-center px-6">
        <h1 className="text-2xl font-extrabold gradient-text tracking-tight">
          CalorieFlow
        </h1>
        <nav className="flex gap-2">
          {[
            { to: '/calculator', label: 'Calculator' },
            { to: '/tracker', label: 'Tracker' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive
                  ? 'px-4 py-2 rounded-xl text-sm font-semibold btn-gradient'
                  : 'px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200'
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
