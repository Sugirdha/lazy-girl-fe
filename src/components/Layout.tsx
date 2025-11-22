import { NavLink, Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-4xl flex items-center justify-between px-4 py-3">
          <div className="font-bold">Lazy Girl</div>
          <nav className="flex gap-4 text-sm">
            <NavLink
              to="/planner"
              className={({ isActive }) =>
                isActive ? 'font-semibold underline' : ''
              }>
              Planner
            </NavLink>
            <NavLink
              to="/recipes"
              className={({ isActive }) =>
                isActive ? 'font-semibold underline' : ''
              }>
              Recipes
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
