import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  Mail,
  Lock,
  User,
  ShieldCheck,
  ArrowRight,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ButtonLoader from '../../components/common/ButtonLoader';
import { ROLES, GENDERS } from '../../constants';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'MALE',
    role: 'ADMIN'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    try {
      setIsLoading(true);
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        role: formData.role
      });
      toast.success('Registration completed successfully! Welcome to MediCare HMS.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.message || 'Registration failed. Please check the information provided.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Left Branding Showcase */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 p-12 flex-col justify-between relative overflow-hidden text-white">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shadow-lg">
            <HeartPulse className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white font-sans">
              MediCare <span className="text-teal-300 font-semibold">HMS</span>
            </h1>
            <p className="text-xs text-teal-200/80 font-medium tracking-wide uppercase">
              Staff Portal Onboarding
            </p>
          </div>
        </div>

        <div className="my-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-teal-300" />
            <span>Role-Based Healthcare Security</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white leading-snug">
            Equipping healthcare providers with modern clinical intelligence.
          </h2>

          <div className="space-y-3 text-sm text-teal-100/80">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>End-to-end encrypted electronic health records</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>Digital prescriptions with PDF generation</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>Multi-department clinical billing and lab reporting</span>
            </div>
          </div>
        </div>

        <div className="border-t border-teal-700/50 pt-6 text-xs text-teal-200/70">
          Authorized personnel only. HIPAA / GDPR Compliant Infrastructure.
        </div>
      </div>

      {/* Right Registration Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-lg space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Register Clinical Account
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Create credentials for doctor, administrator, or receptionist roles.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-start gap-3">
              <div className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                !
              </div>
              <div className="flex-1">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Rajesh Sharma"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="staff@hospital.org"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full py-2.5 px-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                >
                  {GENDERS.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Assigned Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full py-2.5 px-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                >
                  <option value={ROLES.ADMIN}>Administrator</option>
                  <option value={ROLES.DOCTOR}>Doctor / Physician</option>
                  <option value={ROLES.RECEPTIONIST}>Receptionist / Desk</option>
                  <option value={ROLES.PATIENT}>Patient Portal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1 h-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`flex-1 rounded-full transition-all ${
                          strength >= step
                            ? step === 1
                              ? 'bg-rose-500'
                              : step === 2
                              ? 'bg-amber-500'
                              : step === 3
                              ? 'bg-sky-500'
                              : 'bg-emerald-500'
                            : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Strength:{' '}
                    {strength <= 1
                      ? 'Weak'
                      : strength === 2
                      ? 'Moderate'
                      : strength === 3
                      ? 'Good'
                      : 'Strong (Clinical grade)'}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white font-medium text-sm rounded-xl shadow-md shadow-teal-700/20 transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer pt-3"
            >
              {isLoading ? (
                <>
                  <ButtonLoader size="sm" />
                  <span>Registering Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Staff Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 dark:text-slate-400">
            Already have hospital staff credentials?{' '}
            <Link
              to="/login"
              className="font-semibold text-teal-700 dark:text-teal-400 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}