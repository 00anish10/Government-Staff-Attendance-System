import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { getTodayBs } from '../utils/nepaliDate';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/staff', label: 'Staff', icon: '👥' },
  { path: '/attendance', label: 'Attendance', icon: '📝' },
  { path: '/leaves', label: 'Leaves', icon: '🏖️' },
  { path: '/departments', label: 'Departments', icon: '🏛️' },
  { path: '/designations', label: 'Designations', icon: '📋' },
];

export default function Layout() {
  const location = useLocation();

  const getPageTitle = () => {
    const item = navItems.find(n => n.path === location.pathname);
    return item ? item.label : 'सरकारी हाजिरी प्रणाली';
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-nepali-blue text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-blue-700">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏛️</span>
            <div>
              <h1 className="text-sm font-bold leading-tight">सरकारी हाजिरी</h1>
              <p className="text-[10px] text-blue-200">Sarkaari Hajiri Pranali</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white font-medium'
                    : 'text-blue-200 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-700">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-blue-200">admin@gov.np</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">{getPageTitle()}</h2>
            <div className="text-right">
              {(() => {
                const bs = getTodayBs();
                return (
                  <>
                    <div className="text-sm text-gray-700 font-medium">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    {bs && (
                      <div className="text-xs text-gray-400">
                        {bs.dayName}, {bs.day} {bs.monthName} {bs.year} B.S.
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
