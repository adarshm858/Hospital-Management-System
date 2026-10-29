import { useState } from 'react';
import {
  User,
  Shield,
  Bell,
  Palette,
  Sun,
  Moon,
  Laptop,
  Save,
  CheckCircle2,
  Key
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/common/Badge';
import { FormInput } from '../../components/common/FormControls';
import ButtonLoader from '../../components/common/ButtonLoader';

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('appearance');

  // Profile state
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || 'Dr. Administrator',
    email: user?.email || 'admin@medicare.hms',
    department: 'Hospital Administration & Clinical Informatics'
  });

  // Password state
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification toggles
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    appointmentReminders: true,
    labResultAlerts: true,
    billingDiscrepancies: false
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleProfileSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Clinical profile preferences saved.');
    }, 400);
  };

  const handleSecuritySave = (e) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast.warning('New passwords do not match.');
      return;
    }
    if (securityForm.newPassword.length < 6) {
      toast.warning('New password must be at least 6 characters.');
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Security password updated successfully.');
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          System & Account Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Configure clinical profile, interface visual theme, notifications, and security protocols.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2 sm:space-x-4 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('appearance')}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'appearance'
              ? 'border-teal-700 text-teal-700 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Appearance</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-teal-700 text-teal-700 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'security'
              ? 'border-teal-700 text-teal-700 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'notifications'
              ? 'border-teal-700 text-teal-700 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </button>
      </div>

      {/* Tab 1: Appearance */}
      {activeTab === 'appearance' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Interface Color Theme
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select your preferred visual style for night shifts and low-light hospital environments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between h-32 ${
                theme === 'light'
                  ? 'border-teal-600 bg-teal-50/40 dark:bg-teal-950/20 ring-2 ring-teal-600/20'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <Sun className="w-5 h-5 text-amber-500" />
                {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-teal-700" />}
              </div>
              <div>
                <span className="font-semibold text-sm text-slate-900 dark:text-white block">
                  Light Theme
                </span>
                <span className="text-[11px] text-slate-500">Daytime clinical high-contrast</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between h-32 ${
                theme === 'dark'
                  ? 'border-teal-600 bg-teal-50/40 dark:bg-teal-950/20 ring-2 ring-teal-600/20'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <Moon className="w-5 h-5 text-indigo-400" />
                {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
              </div>
              <div>
                <span className="font-semibold text-sm text-slate-900 dark:text-white block">
                  Dark Theme
                </span>
                <span className="text-[11px] text-slate-500">Night shift & eye comfort</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between h-32 ${
                theme === 'system'
                  ? 'border-teal-600 bg-teal-50/40 dark:bg-teal-950/20 ring-2 ring-teal-600/20'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <Laptop className="w-5 h-5 text-slate-400" />
                {theme === 'system' && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
              </div>
              <div>
                <span className="font-semibold text-sm text-slate-900 dark:text-white block">
                  System Synchronized
                </span>
                <span className="text-[11px] text-slate-500">Matches device OS mode</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSave} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Clinical Operator Profile
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Staff demographic records and role credentials.
              </p>
            </div>
            <Badge color="teal" size="sm">
              {user?.role || 'ADMIN'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Staff Display Name"
              value={profileForm.fullName}
              onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
            />
            <FormInput
              label="Staff Email"
              type="email"
              value={profileForm.email}
              disabled
              helperText="Staff emails are linked to hospital directory authentication"
            />
            <div className="sm:col-span-2">
              <FormInput
                label="Clinical Department"
                value={profileForm.department}
                onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition flex items-center gap-2"
            >
              {isSaving ? <ButtonLoader size="sm" /> : <Save className="w-4 h-4" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Security */}
      {activeTab === 'security' && (
        <form onSubmit={handleSecuritySave} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Password & Clinical Security
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Maintain healthcare data integrity with secure authentication passwords.
            </p>
          </div>

          <div className="space-y-4 max-w-md">
            <FormInput
              label="Current Password"
              type="password"
              required
              value={securityForm.currentPassword}
              onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
              placeholder="••••••••••••"
            />

            <FormInput
              label="New Password"
              type="password"
              required
              value={securityForm.newPassword}
              onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
              placeholder="Minimum 6 characters"
            />

            <FormInput
              label="Confirm New Password"
              type="password"
              required
              value={securityForm.confirmPassword}
              onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
              placeholder="Re-enter new password"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition flex items-center gap-2"
            >
              {isSaving ? <ButtonLoader size="sm" /> : <Key className="w-4 h-4" />}
              <span>Update Password</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Notification & Alert Channels
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize real-time alerts for critical lab results and appointment bookings.
            </p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <div className="py-3.5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Critical Lab Results Alert
                </p>
                <p className="text-xs text-slate-500">
                  Instant push notification when urgent lab findings are submitted
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.labResultAlerts}
                onChange={(e) => setNotifications({ ...notifications, labResultAlerts: e.target.checked })}
                className="w-4 h-4 text-teal-700 rounded"
              />
            </div>

            <div className="py-3.5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Appointment Schedule Reminders
                </p>
                <p className="text-xs text-slate-500">
                  Daily digest of upcoming patient consultations
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.appointmentReminders}
                onChange={(e) => setNotifications({ ...notifications, appointmentReminders: e.target.checked })}
                className="w-4 h-4 text-teal-700 rounded"
              />
            </div>

            <div className="py-3.5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Billing Reconciliation Alerts
                </p>
                <p className="text-xs text-slate-500">
                  Notifies when high-value patient bills remain unpaid for &gt; 7 days
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.billingDiscrepancies}
                onChange={(e) => setNotifications({ ...notifications, billingDiscrepancies: e.target.checked })}
                className="w-4 h-4 text-teal-700 rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
