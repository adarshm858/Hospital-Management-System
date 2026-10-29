import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const toast = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error: (msg, dur) => addToast(msg, 'error', dur),
    warning: (msg, dur) => addToast(msg, 'warning', dur),
    info: (msg, dur) => addToast(msg, 'info', dur)
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((t) => {
          const config = {
            success: {
              icon: CheckCircle2,
              bg: 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100',
              iconColor: 'text-emerald-600 dark:text-emerald-400'
            },
            error: {
              icon: AlertCircle,
              bg: 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100',
              iconColor: 'text-rose-600 dark:text-rose-400'
            },
            warning: {
              icon: AlertTriangle,
              bg: 'bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100',
              iconColor: 'text-amber-600 dark:text-amber-400'
            },
            info: {
              icon: Info,
              bg: 'bg-teal-50 dark:bg-teal-950/80 border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-100',
              iconColor: 'text-teal-600 dark:text-teal-400'
            }
          }[t.type] || {
            icon: Info,
            bg: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100',
            iconColor: 'text-slate-600 dark:text-slate-400'
          };

          const IconComponent = config.icon;

          return (
            <div
              key={t.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm animate-toast-in transition-all ${config.bg}`}
            >
              <IconComponent className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
              <div className="flex-1 text-sm font-medium leading-relaxed">{t.message}</div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded transition"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
