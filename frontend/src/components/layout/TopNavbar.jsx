import { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Sun,
  Moon,
  Search,
  Settings,
  LogOut,
  ChevronRight,
  Check,
  Calendar,
  AlertCircle,
  FileCheck,
  CreditCard,
  Eye,
  EyeOff,
  ShieldCheck,
  Activity,
  Sliders,
  History
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { usePrivacy } from '../../context/PrivacyContext';
import CommandPalette from '../common/CommandPalette';
import Badge from '../common/Badge';

export default function TopNavbar({ onMobileMenuToggle }) {
  const { user, activeRole, setActiveRole, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { isPrivacyMode, togglePrivacyMode } = usePrivacy();
  const location = useLocation();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState('ALL');

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const roleRef = useRef(null);

  // Initial clinical sample notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Emergency Admission',
      desc: 'Patient Rajesh Kumar admitted to ICU Ward 4',
      time: '10m ago',
      unread: true,
      category: 'CRITICAL',
      icon: AlertCircle
    },
    {
      id: 2,
      title: 'Lab Report Ready',
      desc: 'Complete Blood Count (CBC) verified for Anita Sharma',
      time: '25m ago',
      unread: true,
      category: 'CLINICAL',
      icon: FileCheck
    },
    {
      id: 3,
      title: 'Appointment Rescheduled',
      desc: 'Dr. Priya Nair updated slot for Cardiology follow-up',
      time: '1h ago',
      unread: false,
      category: 'APPOINTMENTS',
      icon: Calendar
    },
    {
      id: 4,
      title: 'Invoice Settled',
      desc: 'Invoice #1002 settled via Insurance Cashless Desk',
      time: '2h ago',
      unread: false,
      category: 'BILLING',
      icon: CreditCard
    }
  ]);

  // Global Keyboard Shortcuts (CMD/CTRL + K, P, A, B)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCmd = e.metaKey || e.ctrlKey;
      if (isCmd && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (isCmd && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        navigate('/patients/add');
      } else if (isCmd && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        navigate('/appointments/add');
      } else if (isCmd && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        navigate('/bills/add');
      } else if (e.key === 'Escape') {
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
        setIsRoleDropdownOpen(false);
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotificationsOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const clearAllNotifs = () => {
    setNotifications([]);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Filtered notifications
  const filteredNotifs = notifications.filter((n) => {
    if (notifFilter === 'ALL') return true;
    if (notifFilter === 'CRITICAL') return n.category === 'CRITICAL';
    if (notifFilter === 'CLINICAL') return n.category === 'CLINICAL' || n.category === 'APPOINTMENTS';
    if (notifFilter === 'BILLING') return n.category === 'BILLING';
    return true;
  });

  // Breadcrumbs generator
  const pathnames = location.pathname.split('/').filter((x) => x);
  const breadcrumbMap = {
    dashboard: 'Dashboard',
    'command-center': 'Command Center',
    patients: 'Patients',
    add: 'Add Record',
    edit: 'Edit Record',
    profile: 'EMR Profile',
    doctors: 'Doctors Directory',
    appointments: 'Appointments',
    prescriptions: 'Prescriptions',
    medicines: 'Pharmacy Formulary',
    'lab-tests': 'Laboratory Tests',
    'lab-reports': 'Diagnostic Reports',
    bills: 'Billing & Ledgers',
    settings: 'Settings',
    roles: 'Roles & Permissions',
    'audit-logs': 'Audit Logs'
  };

  const availableRoles = [
    { id: 'ADMIN', label: 'Hospital Administrator' },
    { id: 'DOCTOR', label: 'Attending Physician' },
    { id: 'RECEPTIONIST', label: 'Desk Receptionist' },
    { id: 'PHARMACIST', label: 'Clinical Pharmacist' },
    { id: 'LAB_TECHNICIAN', label: 'Pathology Lab Tech' }
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between px-4 sm:px-6 h-16">
          {/* Left: Mobile Menu & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Dynamic Breadcrumbs */}
            <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
              <Link to="/dashboard" className="hover:text-teal-700 dark:hover:text-teal-400 font-medium transition">
                MediCare HMS
              </Link>
              {pathnames.length === 0 || (pathnames.length === 1 && pathnames[0] === 'dashboard') ? (
                <>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Dashboard</span>
                </>
              ) : (
                pathnames.map((name, index) => {
                  const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                  const isLast = index === pathnames.length - 1;
                  const displayName = breadcrumbMap[name] || name;

                  return (
                    <span key={name} className="flex items-center gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                      {isLast ? (
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {displayName}
                        </span>
                      ) : (
                        <Link to={routeTo} className="hover:text-teal-700 dark:hover:text-teal-400 transition">
                          {displayName}
                        </Link>
                      )}
                    </span>
                  );
                })
              )}
            </nav>
          </div>

          {/* Center: Command Palette Trigger Button */}
          <div className="flex-1 max-w-sm mx-4 hidden md:block">
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Search patients, commands...</span>
              </span>
              <kbd className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-400">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="md:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Open command palette"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Privacy Mode Toggle */}
            <button
              type="button"
              onClick={togglePrivacyMode}
              className={`p-2 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold ${
                isPrivacyMode
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isPrivacyMode ? 'HIPAA Privacy Mode: ON (Patient Data Masked)' : 'Turn On HIPAA Privacy Mode'}
            >
              {isPrivacyMode ? <EyeOff className="w-4 h-4 text-emerald-600" /> : <Eye className="w-4 h-4" />}
              <span className="hidden xl:inline text-[11px]">
                {isPrivacyMode ? 'Privacy Active' : 'Privacy'}
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in duration-150">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Notification Center
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {unreadCount} unread alert{unreadCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllRead}
                          className="text-xs text-teal-700 dark:text-teal-400 hover:underline font-semibold"
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={clearAllNotifs}
                        className="text-xs text-slate-400 hover:text-rose-600 transition"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* Notification Categories */}
                  <div className="flex border-b border-slate-100 dark:border-slate-800 px-3 py-1.5 gap-1 bg-slate-50/50 dark:bg-slate-800/40 text-[11px]">
                    {['ALL', 'CRITICAL', 'CLINICAL', 'BILLING'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setNotifFilter(cat)}
                        className={`px-2 py-0.5 rounded-md font-semibold transition ${
                          notifFilter === cat
                            ? 'bg-teal-700 text-white'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredNotifs.length > 0 ? (
                      filteredNotifs.map((n) => {
                        const Icon = n.icon;
                        return (
                          <div
                            key={n.id}
                            className={`p-3.5 flex items-start gap-3 transition-colors ${
                              n.unread
                                ? 'bg-teal-50/30 dark:bg-teal-950/20'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 text-teal-600 dark:text-teal-400">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                  {n.title}
                                </h5>
                                <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                                {n.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-8 text-center text-xs text-slate-400">
                        No notifications in this category.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Active Role Quick Switcher Pill */}
            <div className="relative hidden md:block" ref={roleRef}>
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-900 text-teal-800 dark:text-teal-300 text-xs font-bold hover:bg-teal-100 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>{activeRole || 'ADMIN'}</span>
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 z-50 animate-in fade-in duration-100">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Hospital Role
                  </div>
                  {availableRoles.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setActiveRole(r.id);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold text-left transition ${
                        activeRole === r.id
                          ? 'bg-teal-700 text-white'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{r.label}</span>
                      {activeRole === r.id && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-expanded={isProfileOpen}
                aria-label="User profile menu"
              >
                <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-teal-700 to-teal-500 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                    {user?.fullName || 'Dr. Administrator'}
                  </span>
                  <span className="text-[10px] text-teal-700 dark:text-teal-400 font-medium">
                    {activeRole || user?.role || 'ADMIN'}
                  </span>
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in duration-150">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                      {user?.fullName || 'Hospital Administrator'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {user?.email || 'admin@medicare.hms'}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <Badge variant="teal">{activeRole || user?.role || 'ADMIN'}</Badge>
                      {isPrivacyMode && <Badge variant="success">HIPAA MASKED</Badge>}
                    </div>
                  </div>

                  <div className="p-1.5 space-y-0.5">
                    <Link
                      to="/command-center"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                    >
                      <Activity className="w-4 h-4 text-emerald-500" />
                      <span>Live Command Center</span>
                    </Link>

                    <Link
                      to="/audit-logs"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                    >
                      <History className="w-4 h-4 text-slate-400" />
                      <span>System Audit Trail</span>
                    </Link>

                    <Link
                      to="/settings/roles"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                    >
                      <Sliders className="w-4 h-4 text-slate-400" />
                      <span>Roles & Permissions</span>
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Account Settings</span>
                    </Link>
                  </div>

                  <div className="p-1.5 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Global Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </>
  );
}
