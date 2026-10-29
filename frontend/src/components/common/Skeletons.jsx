export function TableSkeleton({ rows = 5, cols = 6 }) {
  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center gap-4">
        <div className="h-9 w-64 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-9 w-28 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        <div className="bg-slate-50/70 dark:bg-slate-800/40 p-4 flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse flex-1"
            />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="p-4 flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <div
                key={cIdx}
                className={`h-4 bg-slate-100 dark:bg-slate-800 rounded-md animate-pulse ${
                  cIdx === 0 ? 'w-20' : cIdx === 1 ? 'w-36' : 'flex-1'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
              <div className="h-3.5 w-24 bg-slate-100 dark:bg-slate-800 rounded-md animate-pulse" />
              <div className="h-7 w-20 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          </div>
          <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800 rounded-md animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default { TableSkeleton, CardSkeleton };
