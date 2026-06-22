import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-lightgray py-4 shadow-md border-b border-border">
      <div className="max-w-700 mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-semibold text-darktext">Calorieflow</h1>
        <nav className="flex space-x-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? 'text-cyan font-medium underline'
                : 'text-graytext hover:text-cyan transition-colors duration-100'
            }
          >
            Calculator
          </NavLink>
          <NavLink
            to="/tracker"
            className={({ isActive }) =>
              isActive
                ? 'text-cyan font-medium underline'
                : 'text-graytext hover:text-cyan transition-colors duration-100'
            }
          >
            Tracker
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
