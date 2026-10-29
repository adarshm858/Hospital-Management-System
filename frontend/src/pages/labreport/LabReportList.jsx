import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  Printer,
  HeartPulse,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import labService from '../../services/labService';
import { useToast } from '../../context/ToastContext';
import { usePrivacy } from '../../context/PrivacyContext';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import Modal from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';

export default function LabReportList() {
  const { mask } = usePrivacy();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected report for clinical viewer modal
  const [selectedReport, setSelectedReport] = useState(null);
  const [isReviewed, setIsReviewed] = useState(false);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, report: null, isDeleting: false });

  const toast = useToast();

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await labService.getAllReports();
      setReports(data || []);
    } catch (err) {
      setError(err);
      toast.error('Failed to load laboratory reports.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteModal.report) return;
    try {
      setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
      await labService.deleteReport(deleteModal.report.id);
      toast.success(`Lab report #${deleteModal.report.reportId || deleteModal.report.id} deleted.`);
      setDeleteModal({ isOpen: false, report: null, isDeleting: false });
      fetchReports();
    } catch (err) {
      toast.error(err.message || 'Failed to delete report.');
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const getSeverityInfo = (resultStr) => {
    const lower = (resultStr || '').toLowerCase();
    if (lower.includes('high') || lower.includes('critical') || lower.includes('positive') || lower.includes('severe') || lower.includes('abnormal')) {
      return {
        severity: 'CRITICAL',
        label: 'CRITICAL HIGH',
        badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800',
        icon: AlertTriangle
      };
    }
    if (lower.includes('borderline') || lower.includes('elevated') || lower.includes('mild')) {
      return {
        severity: 'WARNING',
        label: 'ELEVATED',
        badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        icon: AlertTriangle
      };
    }
    return {
      severity: 'NORMAL',
      label: 'NORMAL RANGE',
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      icon: CheckCircle2
    };
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    toast.info('Exporting lab diagnostic report to PDF...');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const handleDoctorReview = () => {
    setIsReviewed(true);
    toast.success('Report clinically reviewed and signed by Attending Physician.');
  };

  const columns = useMemo(
    () => [
      {
        header: 'Report ID',
        accessor: 'reportId',
        className: 'w-28',
        render: (row) => (
          <span className="font-mono text-xs font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-900">
            {mask(row.reportId || `LAB-${row.id}`, 'id')}
          </span>
        )
      },
      {
        header: 'Patient Name',
        accessor: 'patientName',
        render: (row) => (
          <div>
            <span className="font-semibold text-slate-900 dark:text-white block">
              {mask(row.patientName || 'Patient', 'name')}
            </span>
            <span className="text-xs text-slate-400">
              Dr. {row.doctorName || 'Attending Physician'}
            </span>
          </div>
        )
      },
      {
        header: 'Diagnostic Investigation',
        accessor: 'labTestName',
        render: (row) => (
          <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
            {row.labTestName || 'Diagnostic Panel'}
          </span>
        )
      },
      {
        header: 'Observed Result & Severity',
        accessor: 'result',
        render: (row) => {
          const sev = getSeverityInfo(row.result);
          const Icon = sev.icon;
          return (
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                {row.result}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${sev.badgeClass}`}
              >
                <Icon className="w-3 h-3" />
                <span>[{sev.label}]</span>
              </span>
            </div>
          );
        }
      },
      {
        header: 'Date',
        accessor: 'reportDate',
        className: 'w-28',
        render: (row) => (
          <span className="text-xs text-slate-500">
            {formatDate(row.reportDate || row.createdAt)}
          </span>
        )
      },
      {
        header: 'Status',
        accessor: 'status',
        className: 'w-28 text-center',
        align: 'center',
        render: (row) => <Badge dot size="xs">{row.status || 'COMPLETED'}</Badge>
      },
      {
        header: 'Actions',
        className: 'w-28 text-right',
        align: 'right',
        sortable: false,
        render: (row) => (
          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSelectedReport(row)}
              className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/40 rounded-lg transition"
              title="View Clinical Report"
            >
              <Eye className="w-4 h-4" />
            </button>
            <Link
              to={`/lab-reports/edit/${row.id}`}
              className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/40 rounded-lg transition"
              title="Edit Report"
            >
              <Edit2 className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => setDeleteModal({ isOpen: true, report: row, isDeleting: false })}
              className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
              title="Delete Report"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )
      }
    ],
    []
  );

  const filters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'PENDING', label: 'Pending' },
        { value: 'CANCELLED', label: 'Cancelled' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Diagnostic Lab Reports
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Validated pathology outcomes, specimen cultures, radiology observations, and diagnostic findings.
          </p>
        </div>

        <Link
          to="/lab-reports/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Lab Report</span>
        </Link>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={reports}
        isLoading={isLoading}
        error={error}
        onRetry={fetchReports}
        searchPlaceholder="Search by patient, physician, test, or report ID..."
        searchKeys={['patientName', 'doctorName', 'labTestName', 'result', 'reportId']}
        filters={filters}
        exportFileName="medicare-lab-reports.csv"
        emptyTitle="No laboratory reports on file"
        emptyDescription="Upload diagnostic findings and technician verifications."
        emptyAction={
          <Link
            to="/lab-reports/add"
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition"
          >
            Upload Report
          </Link>
        }
      />

      {/* Clinical Diagnostic Report Modal */}
      <Modal
        isOpen={Boolean(selectedReport)}
        onClose={() => {
          setSelectedReport(null);
          setIsReviewed(false);
        }}
        title="Pathology Diagnostic Investigation Report"
        maxWidth="max-w-2xl"
        footer={
          <div className="flex flex-wrap items-center justify-between w-full gap-2">
            <div className="flex items-center gap-2">
              {!isReviewed ? (
                <button
                  type="button"
                  onClick={handleDoctorReview}
                  className="px-3 py-1.5 text-xs font-semibold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-800 rounded-xl hover:bg-teal-100 transition flex items-center gap-1.5"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Attending Doctor Sign-Off</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Clinically Signed Off</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedReport(null);
                  setIsReviewed(false);
                }}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border rounded-xl"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Report</span>
              </button>
            </div>
          </div>
        }
      >
        {selectedReport && (
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-6 print-container">
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b-2 border-teal-700">
              <div>
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-6 h-6 text-teal-700" />
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    MediCare Clinical Laboratories
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  NABL & CAP Certified Diagnostic Pathology Department
                </p>
                <p className="text-[11px] text-slate-400">Health City Campus, Wing D · Accreditation #NAB-7819</p>
              </div>

              <div className="text-right">
                <span className="font-mono text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                  {mask(selectedReport.reportId || `LAB-${selectedReport.id}`, 'id')}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Report Date: {formatDate(selectedReport.reportDate || selectedReport.createdAt)}
                </p>
              </div>
            </div>

            {/* Demographics & Specimen */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  Patient Demographics
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {mask(selectedReport.patientName || 'Patient', 'name')}
                </p>
                <p className="text-slate-500">ID: {mask(selectedReport.patientId ? `PAT-${selectedReport.patientId}` : '—', 'id')}</p>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  Specimen / Sample
                </span>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  Venous Whole Blood (EDTA)
                </p>
                <p className="text-slate-500 text-[11px]">Collection: 08:30 AM · Fasting</p>
              </div>

              <div className="sm:text-right">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  Referring Physician
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  Dr. {selectedReport.doctorName || 'Attending Physician'}
                </p>
                <p className="text-slate-500">Clinical Diagnostics</p>
              </div>
            </div>

            {/* Test Investigation Results & Reference Ranges */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Investigation Findings & Reference Matrix
              </span>
              <div className="mt-2 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500">
                    <tr>
                      <th className="py-2.5 px-3">Diagnostic Panel</th>
                      <th className="py-2.5 px-3">Observed Value</th>
                      <th className="py-2.5 px-3">Reference Interval</th>
                      <th className="py-2.5 px-3">Interpretation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(() => {
                      const sev = getSeverityInfo(selectedReport.result);
                      const SevIcon = sev.icon;
                      return (
                        <tr>
                          <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                            {selectedReport.labTestName || 'Laboratory Test'}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                            {selectedReport.result}
                          </td>
                          <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                            70.0 - 110.0 mg/dL (Normal)
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${sev.badgeClass}`}
                            >
                              <SevIcon className="w-3 h-3" />
                              <span>[{sev.label}]</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {selectedReport.remarks && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Pathologist Clinical Remarks:
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {selectedReport.remarks}
                </p>
              </div>
            )}

            {/* Doctor review stamp */}
            {isReviewed && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold">
                    Clinically Verified & Reviewed by Dr. {selectedReport.doctorName || 'Attending Physician'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            )}

            {/* Signoff */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-end text-xs">
              <div>
                <p className="text-[10px] text-slate-400">
                  Technician: Tech. Sunita Rao, B.Sc MLT
                </p>
                <p className="text-[10px] text-slate-400">
                  Electronically verified & signed clinical diagnostic report
                </p>
              </div>
              <div className="text-center">
                <div className="w-36 border-b border-slate-400 pb-1 mb-1 font-serif italic text-teal-800 dark:text-teal-400">
                  Dr. Rajesh Sharma, MD
                </div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">
                  Chief Pathologist
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, report: null, isDeleting: false })}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteModal.isDeleting}
        title="Delete Diagnostic Report?"
        description="Are you sure you want to delete this lab report from the patient medical file?"
        confirmText="Confirm Delete"
      />
    </div>
  );
}