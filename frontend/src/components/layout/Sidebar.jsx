import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarCheck,
  FileText,
  Pill,
  FlaskConical,
  ClipboardCheck,
  Receipt,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  Radio,
  History,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}) {
  const { logout, user, activeRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navSections = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Command Center', path: '/command-center', icon: Radio, badge: 'LIVE' }
      ]
    },
    {
      title: 'Clinical Operations',
      items: [
        { name: 'Patients', path: '/patients', icon: Users },
        { name: 'Doctors', path: '/doctors', icon: Stethoscope },
        { name: 'Appointments', path: '/appointments', icon: CalendarCheck },
        { name: 'Prescriptions', path: '/prescriptions', icon: FileText }
      ]
    },
    {
      title: 'Pharmacy',
      items: [
        { name: 'Medicines', path: '/medicines', icon: Pill }
      ]
    },
    {
      title: 'Laboratory',
      items: [
        { name: 'Lab Tests', path: '/lab-tests', icon: FlaskConical },
        { name: 'Lab Reports', path: '/lab-reports', icon: ClipboardCheck }
      ]
    },
    {
      title: 'Finance & Billing',
      items: [
        { name: 'Billing', path: '/bills', icon: Receipt }
      ]
    },
    {
      title: 'Governance & Security',
      items: [
        { name: 'Audit Logs', path: '/audit-logs', icon: History },
        { name: 'Roles & Matrix', path: '/settings/roles', icon: Shield },
        { name: 'Settings', path: '/settings', icon: Settings }
      ]
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-teal-900/30 shrink-0">
            <HeartPulse className="w-5 h-5 animate-pulse" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-bold tracking-tight text-white font-sans text-base leading-tight">
                MediCare <span className="text-teal-400 font-semibold">HMS</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                Clinical Enterprise
              </span>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {section.title}
              </div>
            )}
            {section.items.map((item, iIdx) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={iIdx}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  title={isCollapsed ? item.name : undefined}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-teal-700 text-white shadow-md shadow-teal-950/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    } ${isCollapsed ? 'justify-center px-2' : ''}`
                  }
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      isCollapsed ? '' : ''
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                  {!isCollapsed && item.badge && (
                    <span className="ml-auto inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold rounded tracking-wider uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                      {item.badge}
                    </span>
                  )}
                  {isCollapsed && item.badge && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                  )}

                  {/* Tooltip on collapsed desktop */}
                  {isCollapsed && (
                    <div className="hidden lg:group-hover:block absolute left-full ml-3 px-2.5 py-1 bg-slate-800 text-white text-xs font-medium rounded-lg shadow-xl border border-slate-700 whitespace-nowrap z-50 pointer-events-none">
                      {item.name}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* User info & Logout at footer */}
      <div className="p-3 border-t border-slate-800 shrink-0">
        {!isCollapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl bg-slate-800/50 border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-teal-800/80 text-teal-300 flex items-center justify-center font-bold text-xs shrink-0">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {user.fullName || 'Admin User'}
              </p>
              <div className="text-[10px] text-teal-400 truncate uppercase font-medium flex items-center gap-1.5">
                <span>{activeRole || user.role || 'ADMIN'}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 text-[9px] font-normal lowercase">perspective</span>
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          title={isCollapsed ? 'Logout' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-300 hover:text-white hover:bg-rose-950/40 border border-transparent hover:border-rose-900/50 transition ${
            isCollapsed ? 'justify-center px-2' : ''
          }`}
        >
          <LogOut className="w-5 h-5 shrink-0 text-rose-400" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:block fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-slate-900/60 backdrop-blur-xs transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
