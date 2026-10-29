import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  LayoutGrid,
  List,
  Eye
} from 'lucide-react';
import { usePrivacy } from '../../context/PrivacyContext';
import Badge from '../../components/common/Badge';
import { formatDate } from '../../utils/formatters';

const LAB_STAGES = [
  { id: 'REQUESTED', title: 'Requested', badge: 'neutral' },
  { id: 'SAMPLE_COLLECTED', title: 'Sample Collected', badge: 'info' },
  { id: 'PROCESSING', title: 'Processing', badge: 'warning' },
  { id: 'RESULT_READY', title: 'Result Ready', badge: 'info' },
  { id: 'DOCTOR_REVIEW', title: 'Doctor Review', badge: 'warning' },
  { id: 'COMPLETED', title: 'Completed', badge: 'success' }
];

export default function LabDashboardView({ labTests: _labTests = [], labReports = [] }) {
  const { mask } = usePrivacy();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'

  // Map reports into stages (assign default status if missing)
  const stagedReports = useMemo(() => {
    return labReports.map((r, idx) => {
      let stage = r.status || (idx % 5 === 0 ? 'COMPLETED' : idx % 4 === 0 ? 'PROCESSING' : idx % 3 === 0 ? 'SAMPLE_COLLECTED' : 'RESULT_READY');
      if (stage === 'PENDING') stage = 'PROCESSING';
      return { ...r, stage };
    });
  }, [labReports]);

  return (
    <div className="space-y-6">
      {/* Laboratory Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300">
              PATHOLOGY & DIAGNOSTICS
            </span>
            <span className="text-xs text-slate-500">Clinical Laboratory Workflow</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Diagnostic Investigation Pipeline
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Specimen tracking: Requested → Sample Collected → Processing → Result Ready → Doctor Review → Completed.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate('/lab-reports/add')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Test Findings</span>
          </button>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {LAB_STAGES.map((stage) => {
            const items = stagedReports.filter((r) => r.stage === stage.id);
            return (
              <div
                key={stage.id}
                className="bg-slate-50/80 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 flex flex-col min-w-[220px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {stage.title}
                  </span>
                  <span className="w-5 h-5 rounded-full bg-white dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                    {items.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[550px]">
                  {items.length > 0 ? (
                    items.map((report) => (
                      <div
                        key={report.id}
                        className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs hover:border-teal-500 transition"
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-mono font-semibold">#{report.id}</span>
                          <span>{formatDate(report.createdAt)}</span>
                        </div>
                        <h4 className="mt-1 font-bold text-xs text-slate-900 dark:text-white">
                          {report.testName || 'Complete Diagnostic Panel'}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Patient: {mask(report.patientName || `Patient #${report.patientId}`, 'name')}
                        </p>
                        {report.result && (
                          <div className="mt-2 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 text-[10px] font-mono text-slate-600 dark:text-slate-300">
                            Finding: {report.result.slice(0, 35)}...
                          </div>
                        )}
                        <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                          <Badge variant={stage.badge}>{stage.title}</Badge>
                          <Link
                            to="/lab-reports"
                            className="p-1 text-slate-400 hover:text-teal-600 transition"
                            title="View Report"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-[11px] text-slate-400">
                      No specimens in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold uppercase text-slate-400">
                  <th className="pb-3">Sample ID</th>
                  <th className="pb-3">Patient</th>
                  <th className="pb-3">Investigation</th>
                  <th className="pb-3">Consultant</th>
                  <th className="pb-3">Stage</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {stagedReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-mono text-xs text-slate-400">#{report.id}</td>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      {mask(report.patientName || `Patient #${report.patientId}`, 'name')}
                    </td>
                    <td className="py-3 text-xs text-slate-600 dark:text-slate-300">
                      {report.testName || 'Diagnostic Test'}
                    </td>
                    <td className="py-3 text-xs text-slate-500">
                      {report.doctorName || 'Dr. Assigned'}
                    </td>
                    <td className="py-3">
                      <Badge>{report.stage}</Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to="/lab-reports"
                        className="px-2.5 py-1 text-xs font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 rounded-lg hover:bg-teal-100 transition"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
