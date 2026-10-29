import {
  FolderSearch,
  AlertTriangle,
  WifiOff,
  ShieldAlert,
  RotateCcw,
  Plus
} from 'lucide-react';

/**
 * Empty state component with action button
 */
export function EmptyState({
  icon: Icon = FolderSearch,
  title = 'No records found',
  description = 'There are no active records in this clinical registry yet.',
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <div className={`text-center py-12 px-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 ${className}`}>
      <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">{title}</h4>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}

/**
 * Error state component with retry action
 */
export function ErrorState({
  title = 'Failed to load clinical data',
  message = 'An unexpected error occurred while communicating with the hospital database.',
  onRetry,
  className = ''
}) {
  return (
    <div className={`text-center py-10 px-4 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 ${className}`}>
      <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-rose-900 dark:text-rose-200">{title}</h4>
      <p className="mt-1 text-xs text-rose-700/80 dark:text-rose-400 max-w-sm mx-auto">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry Request</span>
        </button>
      )}
    </div>
  );
}

/**
 * Offline / Server Unavailable State
 */
export function OfflineState({
  title = 'Hospital Server Disconnected',
  message = 'Unable to reach the Spring Boot backend server. Please verify network connectivity.',
  onReconnect
}) {
  return (
    <div className="text-center py-12 px-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20">
      <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
        <WifiOff className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-amber-900 dark:text-amber-200">{title}</h4>
      <p className="mt-1 text-xs text-amber-700/80 dark:text-amber-400 max-w-md mx-auto">
        {message}
      </p>
      {onReconnect && (
        <button
          type="button"
          onClick={onReconnect}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reconnect</span>
        </button>
      )}
    </div>
  );
}

/**
 * Permission Denied State
 */
export function PermissionState({
  title = 'Access Restricted',
  message = 'Your current hospital role does not possess authorization to view or modify this clinical registry.',
  requiredRole = 'ADMIN'
}) {
  return (
    <div className="text-center py-12 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center mb-3">
        <ShieldAlert className="w-6 h-6 text-rose-500" />
      </div>
      <h4 className="text-base font-bold text-slate-900 dark:text-white">{title}</h4>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
        {message} (Requires: <span className="font-semibold text-teal-600">{requiredRole}</span>)
      </p>
    </div>
  );
}
