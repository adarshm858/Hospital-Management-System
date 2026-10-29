import { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Download,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Database
} from 'lucide-react';
import { TableSkeleton } from './Skeletons';
import { exportToCSV } from '../../utils/formatters';

export default function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  error = null,
  onRetry = null,
  searchPlaceholder = 'Search records...',
  searchKeys = [],
  filters = [],
  actions = null,
  emptyTitle = 'No records found',
  emptyDescription = 'There are currently no items matching your criteria.',
  emptyAction = null,
  defaultPageSize = 10,
  exportFileName = 'export.csv',
  onRowClick = null
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Filter & Search
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // 1. Check search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matches =
          searchKeys.length > 0
            ? searchKeys.some((k) => {
                const val = item[k];
                return val !== null && val !== undefined && String(val).toLowerCase().includes(term);
              })
            : Object.values(item).some(
                (v) => v !== null && v !== undefined && String(v).toLowerCase().includes(term)
              );
        if (!matches) return false;
      }

      // 2. Check dropdown filters
      for (const [key, val] of Object.entries(filterValues)) {
        if (val && val !== 'ALL') {
          const itemVal = item[key];
          if (String(itemVal) !== String(val)) {
            return false;
          }
        }
      }

      return true;
    });
  }, [data, searchTerm, searchKeys, filterValues]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const strA = String(aVal).toLowerCase();
      const strB = String(bVal).toLowerCase();
      return sortConfig.direction === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
    return sorted;
  }, [filteredData, sortConfig]);

  // Pagination
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return { key: null, direction: null };
    });
  };

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterValues({});
    setSortConfig({ key: null, direction: null });
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || Object.values(filterValues).some((v) => v && v !== 'ALL');

  if (isLoading) {
    return <TableSkeleton cols={columns.length} rows={defaultPageSize} />;
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/50 p-8 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center mb-4">
          <Database className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Failed to load records
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          {error.message || 'A network error occurred while communicating with the hospital database.'}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition shadow-xs"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
      {/* Table Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px] max-w-sm flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-8 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dynamic Dropdown Filters */}
          {filters.map((f) => (
            <div key={f.key} className="flex items-center gap-1.5">
              <select
                value={filterValues[f.key] || 'ALL'}
                onChange={(e) => handleFilterChange(f.key, e.target.value)}
                className="text-xs font-medium py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition"
              >
                <option value="ALL">{f.label}: All</option>
                {f.options.map((opt, i) => {
                  const val = typeof opt === 'object' ? opt.value : opt;
                  const lbl = typeof opt === 'object' ? opt.label : opt;
                  return (
                    <option key={i} value={val}>
                      {lbl}
                    </option>
                  );
                })}
              </select>
            </div>
          ))}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-auto">
          {data.length > 0 && (
            <button
              type="button"
              onClick={() => exportToCSV(data, exportFileName)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs transition"
              title="Export table data to CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export</span>
            </button>
          )}
          {actions}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {columns.map((col, idx) => {
                const isSorted = sortConfig.key === col.accessor;
                return (
                  <th
                    key={idx}
                    onClick={() => col.sortable !== false && col.accessor && handleSort(col.accessor)}
                    className={`py-3.5 px-4 select-none ${
                      col.sortable !== false && col.accessor ? 'cursor-pointer hover:text-slate-900 dark:hover:text-white' : ''
                    } ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${
                      col.className || ''
                    }`}
                  >
                    <div
                      className={`inline-flex items-center gap-1.5 ${
                        col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'
                      }`}
                    >
                      <span>{col.header}</span>
                      {col.sortable !== false && col.accessor && (
                        <span className="text-slate-400">
                          {isSorted ? (
                            sortConfig.direction === 'asc' ? (
                              <ChevronUp className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-3 h-3 opacity-60" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rIdx) => (
                <tr
                  key={row.id || rIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`group transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-teal-50/40 dark:hover:bg-slate-800/60' : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {columns.map((col, cIdx) => (
                    <td
                      key={cIdx}
                      className={`py-3.5 px-4 text-slate-700 dark:text-slate-300 ${
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                      } ${col.cellClassName || ''}`}
                    >
                      {col.render ? col.render(row) : (row[col.accessor] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-12 px-4 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
                      <Filter className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {emptyTitle}
                    </h4>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {emptyDescription}
                    </p>
                    {emptyAction && <div className="mt-4">{emptyAction}</div>}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalItems > 0 && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              Showing <strong className="text-slate-800 dark:text-slate-200">{(currentPage - 1) * pageSize + 1}</strong> to{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                {Math.min(currentPage * pageSize, totalItems)}
              </strong>{' '}
              of <strong className="text-slate-800 dark:text-slate-200">{totalItems}</strong> entries
            </span>
            <div className="flex items-center gap-1.5">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-teal-600"
              >
                {[5, 10, 20, 50].map((sz) => (
                  <option key={sz} value={sz}>
                    {sz}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition text-slate-700 dark:text-slate-300"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 py-1 font-medium text-slate-700 dark:text-slate-300">
              Page {currentPage} of {totalPages}
            </div>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition text-slate-700 dark:text-slate-300"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
