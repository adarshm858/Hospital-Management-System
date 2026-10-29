import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HeartPulse,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Activity,
  Stethoscope,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ButtonLoader from '../../components/common/ButtonLoader';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both your registered email and password.');
      return;
    }

    try {
      setIsLoading(true);
      await login({ email, password });
      toast.success('Authentication successful. Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.message || 'Invalid credentials. Please verify your email and password.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login credentials autofill helper
  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Left Branding Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 p-12 flex-col justify-between relative overflow-hidden text-white">
        {/* Subtle decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-300/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Top */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shadow-lg">
            <HeartPulse className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white font-sans">
              MediCare <span className="text-teal-300 font-semibold">HMS</span>
            </h1>
            <p className="text-xs text-teal-200/80 font-medium tracking-wide uppercase">
              Hospital Information System
            </p>
          </div>
        </div>

        {/* Hero Content */}
        <div className="my-auto space-y-6 relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-teal-300" />
            <span>Enterprise-Grade Medical Platform</span>
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight leading-tight text-white">
            Precision clinical workflows & patient-centric care.
          </h2>

          <p className="text-teal-100/80 text-sm leading-relaxed">
            Integrated electronic medical records, real-time doctor scheduling, pharmacy inventory,
            diagnostic laboratory reporting, and multi-currency healthcare billing.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <Activity className="w-5 h-5 text-teal-300 mb-2" />
              <div className="text-xl font-bold">99.98%</div>
              <div className="text-xs text-teal-200/70">Clinical System Uptime</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <Stethoscope className="w-5 h-5 text-teal-300 mb-2" />
              <div className="text-xl font-bold">EMR & EHR</div>
              <div className="text-xs text-teal-200/70">HIPAA Compliant Records</div>
            </div>
          </div>
        </div>

        {/* Footer Trust Quote */}
        <div className="border-t border-teal-700/50 pt-6 flex items-center justify-between text-xs text-teal-200/70 relative z-10">
          <span>MediCare Healthcare Operations v2.4</span>
          <span>Security Certified TLS 1.3</span>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Brand Header */}
          <div className="lg:hidden flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-md">
              <HeartPulse className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                MediCare <span className="text-teal-600 font-semibold">HMS</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Hospital Portal</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Hospital Staff Sign In
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Access clinical records, appointments, and hospital administration.
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Staff Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@hospital.org or admin@hospital.org"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info('Please contact your Hospital IT Administrator to reset clinical passwords.');
                  }}
                  className="text-xs text-teal-700 dark:text-teal-400 hover:underline font-medium"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-teal-700 focus:ring-teal-600 w-4 h-4"
                />
                <span>Remember this terminal</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white font-medium text-sm rounded-xl shadow-md shadow-teal-700/20 transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <ButtonLoader size="sm" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials helper */}
          <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Registered Database Staff:</span>
            </div>
            <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="font-mono text-slate-800 dark:text-slate-200">user@example.com</span>
              <button
                type="button"
                onClick={() => handleQuickLogin('user@example.com', 'password')}
                className="text-teal-700 dark:text-teal-400 font-semibold hover:underline text-[11px]"
              >
                Use Admin
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 dark:text-slate-400">
            Need to register a new clinical staff account?{' '}
            <Link
              to="/register"
              className="font-semibold text-teal-700 dark:text-teal-400 hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}