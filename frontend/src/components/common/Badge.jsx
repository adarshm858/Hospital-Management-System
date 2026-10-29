export default function Badge({
  children,
  variant = 'default',
  color,
  size = 'sm',
  dot = false,
  className = ''
}) {
  const normalize = (typeof children === 'string' ? children.toUpperCase().trim() : '');

  // Determine color scheme based on status or color prop
  let colorScheme = color;

  if (!colorScheme) {
    switch (normalize) {
      case 'CONFIRMED':
      case 'COMPLETED':
      case 'PAID':
      case 'ACTIVE':
      case 'IN STOCK':
      case 'AVAILABLE':
      case 'SUCCESS':
        colorScheme = 'green';
        break;
      case 'PENDING':
      case 'WAITING':
      case 'PROCESSING':
      case 'LOW STOCK':
      case 'REQUESTED':
        colorScheme = 'amber';
        break;
      case 'CANCELLED':
      case 'OUT OF STOCK':
      case 'EXPIRED':
      case 'OVERDUE':
      case 'CRITICAL':
      case 'FAILED':
      case 'NO SHOW':
        colorScheme = 'red';
        break;
      case 'SCHEDULED':
      case 'IN PROGRESS':
      case 'SAMPLE COLLECTED':
      case 'PARTIALLY PAID':
      case 'DOCTOR':
        colorScheme = 'blue';
        break;
      case 'ADMIN':
        colorScheme = 'purple';
        break;
      case 'RECEPTIONIST':
      case 'PHARMACIST':
        colorScheme = 'teal';
        break;
      case 'MALE':
        colorScheme = 'blue';
        break;
      case 'FEMALE':
        colorScheme = 'pink';
        break;
      default:
        colorScheme = 'slate';
        break;
    }
  }

  const styles = {
    green:
      'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    amber:
      'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    red:
      'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    blue:
      'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    teal:
      'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    purple:
      'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    pink:
      'bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800',
    slate:
      'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
  }[colorScheme] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

  const dotColors = {
    green: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-rose-500',
    blue: 'bg-sky-500',
    teal: 'bg-teal-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    slate: 'bg-slate-400'
  }[colorScheme] || 'bg-slate-400';

  const sizeClasses = {
    xs: 'text-[11px] px-2 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-0.5 gap-1.5',
    md: 'text-sm px-3 py-1 gap-2'
  }[size] || 'text-xs px-2.5 py-0.5 gap-1.5';

  if (variant === 'bloodGroup') {
    return (
      <span
        className={`inline-flex items-center font-bold font-mono px-2 py-0.5 rounded-md border text-xs bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900 shadow-2xs ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 animate-pulse" />
        {children}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border shadow-2xs transition-colors ${styles} ${sizeClasses} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors}`} />}
      {children}
    </span>
  );
}
