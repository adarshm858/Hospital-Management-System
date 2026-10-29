import { Activity } from 'lucide-react';

export default function PageLoader({ message = 'Loading clinical data...' }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-16 h-16 rounded-full border-4 border-teal-100 dark:border-teal-950 border-t-teal-600 dark:border-t-teal-400 animate-spin" />
        <Activity className="w-7 h-7 text-teal-600 dark:text-teal-400 absolute animate-pulse" />
      </div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 animate-pulse">
        {message}
      </p>
    </div>
  );
}
