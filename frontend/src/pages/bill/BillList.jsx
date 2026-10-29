import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Receipt,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Download,
  Printer,
  Clock,
  CheckCircle,
  HeartPulse
} from 'lucide-react';
import billingService from '../../services/billingService';
import { useToast } from '../../context/ToastContext';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import Modal from '../../components/common/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { PAYMENT_METHODS } from '../../constants';

export default function BillList() {
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected bill for preview modal
  const [previewBill, setPreviewBill] = useState(null);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, bill: null, isDeleting: false });

  const toast = useToast();

  const fetchBills = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await billingService.getAll();
      setBills(data || []);
    } catch (err) {
      setError(err);
      toast.error('Failed to load billing invoices.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleDownloadInvoice = async (id, billId) => {
    try {
      toast.info('Downloading official hospital invoice PDF...');
      await billingService.downloadInvoicePdf(id, billId);
      toast.success('Invoice PDF downloaded.');
    } catch (err) {
      toast.error(err.message || 'Failed to download invoice PDF.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.bill) return;
    try {
      setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
      await billingService.delete(deleteModal.bill.id);
      toast.success('Invoice deleted successfully.');
      setDeleteModal({ isOpen: false, bill: null, isDeleting: false });
      fetchBills();
    } catch (err) {
      toast.error(err.message || 'Failed to delete invoice.');
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Finance KPI metrics
  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let paidCount = 0;
    let pendingCount = 0;
    let pendingAmount = 0;

    bills.forEach((b) => {
      const amt = Number(b.totalAmount || 0);
      if (b.paymentStatus === 'PAID') {
        totalRevenue += amt;
        paidCount++;
      } else if (b.paymentStatus === 'PENDING') {
        pendingAmount += amt;
        pendingCount++;
      }
    });

    return { totalRevenue, paidCount, pendingCount, pendingAmount };
  }, [bills]);

  const columns = useMemo(
    () => [
      {
        header: 'Invoice #',
        accessor: 'billId',
        className: 'w-28',
        render: (row) => (
          <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900">
            {row.billId || `INV-${row.id}`}
          </span>
        )
      },
      {
        header: 'Patient Name',
        accessor: 'patientName',
        render: (row) => (
          <div>
            <span className="font-semibold text-slate-900 dark:text-white block">
              {row.patientName || `Patient #${row.patientId}`}
            </span>
            <span className="text-xs text-slate-400">
              Appt #{row.appointmentId || '—'}
            </span>
          </div>
        )
      },
      {
        header: 'Attending Doctor',
        accessor: 'doctorName',
        render: (row) => (
          <span className="text-slate-700 dark:text-slate-300 font-medium text-xs">
            {row.doctorName || 'Dr. Assigned'}
          </span>
        )
      },
      {
        header: 'Breakdown',
        accessor: 'totalAmount',
        render: (row) => (
          <div className="text-[11px] text-slate-500 space-x-1">
            <span>Fee: {formatCurrency(row.consultationFee)}</span>
            <span>·</span>
            <span>Rx: {formatCurrency(row.medicineCharge)}</span>
            <span>·</span>
            <span>Lab: {formatCurrency(row.labCharge)}</span>
          </div>
        )
      },
      {
        header: 'Total Payable',
        accessor: 'totalAmount',
        className: 'w-32',
        render: (row) => (
          <span className="font-black text-sm text-slate-900 dark:text-white">
            {formatCurrency(row.totalAmount)}
          </span>
        )
      },
      {
        header: 'Payment Mode',
        accessor: 'paymentMethod',
        className: 'w-28',
        render: (row) => (
          <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
            {row.paymentMethod || 'CASH'}
          </span>
        )
      },
      {
        header: 'Status',
        accessor: 'paymentStatus',
        className: 'w-24 text-center',
        align: 'center',
        render: (row) => <Badge dot size="xs">{row.paymentStatus || 'PAID'}</Badge>
      },
      {
        header: 'Actions',
        className: 'w-32 text-right',
        align: 'right',
        sortable: false,
        render: (row) => (
          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => handleDownloadInvoice(row.id, row.billId)}
              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition"
              title="Download PDF Invoice"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setPreviewBill(row)}
              className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/40 rounded-lg transition"
              title="View Invoice Breakdown"
            >
              <Eye className="w-4 h-4" />
            </button>
            <Link
              to={`/bills/edit/${row.id}`}
              className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/40 rounded-lg transition"
              title="Edit Invoice"
            >
              <Edit2 className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => setDeleteModal({ isOpen: true, bill: row, isDeleting: false })}
              className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
              title="Delete Invoice"
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
      key: 'paymentStatus',
      label: 'Payment Status',
      options: [
        { value: 'PAID', label: 'Paid' },
        { value: 'PENDING', label: 'Pending' },
        { value: 'CANCELLED', label: 'Cancelled' }
      ]
    },
    {
      key: 'paymentMethod',
      label: 'Payment Mode',
      options: PAYMENT_METHODS
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Billing & Invoices
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Financial reconciliation, consultation tariffs, pharmacy charges, and PDF invoice generation.
          </p>
        </div>

        <Link
          to="/bills/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Bill</span>
        </Link>
      </div>

      {/* Finance KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold">Settled Revenue</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {formatCurrency(metrics.totalRevenue)}
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold">{metrics.paidCount} paid invoices</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold">Pending Receivables</span>
            <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
              {formatCurrency(metrics.pendingAmount)}
            </h3>
            <span className="text-[11px] text-amber-600 font-semibold">{metrics.pendingCount} unpaid</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold">Total Invoices</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {bills.length}
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Billed patients</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold">PDF Generator</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
              OpenPDF Engine
            </h3>
            <span className="text-[11px] text-teal-600 font-semibold">Active & verified</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 flex items-center justify-center">
            <Download className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={bills}
        isLoading={isLoading}
        error={error}
        onRetry={fetchBills}
        searchPlaceholder="Search by invoice #, patient, doctor, or payment mode..."
        searchKeys={['billId', 'patientName', 'doctorName', 'paymentMethod']}
        filters={filters}
        exportFileName="medicare-billing-ledger.csv"
        emptyTitle="No invoices created yet"
        emptyDescription="Generate billing vouchers for outpatient visits, medications, and laboratory tests."
        emptyAction={
          <Link
            to="/bills/add"
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition"
          >
            Generate Bill
          </Link>
        }
      />

      {/* Invoice Breakdown Modal */}
      <Modal
        isOpen={Boolean(previewBill)}
        onClose={() => setPreviewBill(null)}
        title="Official Patient Billing Invoice"
        maxWidth="max-w-2xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setPreviewBill(null)}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border rounded-xl"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={() => handleDownloadInvoice(previewBill.id, previewBill.billId)}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </>
        }
      >
        {previewBill && (
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-6 print-container">
            {/* Invoice Top */}
            <div className="flex justify-between items-start pb-4 border-b-2 border-teal-700">
              <div>
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-6 h-6 text-teal-700" />
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    MediCare Hospital
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tax Invoice & Clinical Billing Settlement
                </p>
                <p className="text-[11px] text-slate-400">GSTIN: 27AAAAA0000A1Z5</p>
              </div>

              <div className="text-right">
                <span className="font-mono text-sm font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-3 py-1 rounded-lg border border-teal-200 dark:border-teal-800 block">
                  {previewBill.billId || `INV-${previewBill.id}`}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Billing Date: {formatDate(previewBill.createdAt)}
                </p>
              </div>
            </div>

            {/* Patient & Doctor Demographics */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  Billed Patient
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {previewBill.patientName || `Patient #${previewBill.patientId}`}
                </p>
                <p className="text-slate-500">Appt Ref #{previewBill.appointmentId || '—'}</p>
              </div>

              <div className="text-right">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  Attending Physician
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  Dr. {previewBill.doctorName || 'Attending'}
                </p>
                <p className="text-slate-500">Mode: {previewBill.paymentMethod || 'CASH'}</p>
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Itemized Medical Services
              </span>
              <div className="mt-2 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500">
                    <tr>
                      <th className="py-2.5 px-3">Service Description</th>
                      <th className="py-2.5 px-3 text-right">Tariff Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="py-2.5 px-3 font-medium">Physician Consultation Fee</td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {formatCurrency(previewBill.consultationFee)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-medium">Pharmacy / Medication Dispensed</td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {formatCurrency(previewBill.medicineCharge)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-medium">Laboratory & Diagnostic Tests</td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {formatCurrency(previewBill.labCharge)}
                      </td>
                    </tr>
                    {Number(previewBill.otherCharge || 0) > 0 && (
                      <tr>
                        <td className="py-2.5 px-3 font-medium">Hospital Facility / Other Charges</td>
                        <td className="py-2.5 px-3 text-right font-mono">
                          {formatCurrency(previewBill.otherCharge)}
                        </td>
                      </tr>
                    )}
                    {Number(previewBill.discount || 0) > 0 && (
                      <tr className="text-rose-600">
                        <td className="py-2.5 px-3 font-medium">Discount / Insurance Concession</td>
                        <td className="py-2.5 px-3 text-right font-mono">
                          - {formatCurrency(previewBill.discount)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50 dark:bg-slate-800 font-bold border-t border-slate-200 dark:border-slate-700">
                    <tr>
                      <td className="py-3 px-3 text-slate-900 dark:text-white text-sm">
                        Total Amount Payable
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-base text-teal-700 dark:text-teal-400">
                        {formatCurrency(previewBill.totalAmount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Status & Sign */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Settlement Status:</span>
                <Badge size="xs">{previewBill.paymentStatus || 'PAID'}</Badge>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Authorized Cashier / Accounts</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Hospital Billing Desk</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, bill: null, isDeleting: false })}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteModal.isDeleting}
        title="Delete Billing Record?"
        description="Are you sure you want to remove this invoice? Note that accounting ledgers will reflect this deletion."
        confirmText="Confirm Delete"
      />
    </div>
  );
}