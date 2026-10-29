import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FilePlus,
  Edit2,
  Trash2,
  Printer,
  HeartPulse
} from 'lucide-react';
import prescriptionService from '../../services/prescriptionService';
import { useToast } from '../../context/ToastContext';
import DataTable from '../../components/common/DataTable';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import Modal from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';

export default function PrescriptionList() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected prescription for preview & print modal
  const [previewPrescription, setPreviewPrescription] = useState(null);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, prescription: null, isDeleting: false });

  const toast = useToast();

  const fetchPrescriptions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await prescriptionService.getAll();
      setPrescriptions(data || []);
    } catch (err) {
      setError(err);
      toast.error('Failed to load prescriptions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteModal.prescription) return;
    try {
      setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
      await prescriptionService.delete(deleteModal.prescription.id);
      toast.success('Prescription record removed.');
      setDeleteModal({ isOpen: false, prescription: null, isDeleting: false });
      fetchPrescriptions();
    } catch (err) {
      toast.error(err.message || 'Failed to remove prescription.');
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const columns = useMemo(
    () => [
      {
        header: 'Rx ID',
        accessor: 'prescriptionId',
        className: 'w-28',
        render: (row) => (
          <span className="font-mono text-xs font-semibold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-900">
            {row.prescriptionId || `RX-${row.id}`}
          </span>
        )
      },
      {
        header: 'Patient',
        accessor: 'patientName',
        render: (row) => (
          <div>
            <span className="font-semibold text-slate-900 dark:text-white">
              {row.patientName || row.patientId || 'Patient'}
            </span>
            <span className="text-[11px] text-slate-400 font-mono block">
              Appt #{row.appointmentId || '—'}
            </span>
          </div>
        )
      },
      {
        header: 'Physician',
        accessor: 'doctorName',
        render: (row) => (
          <span className="text-slate-700 dark:text-slate-300 font-medium">
            {row.doctorName || 'Dr. Assigned'}
          </span>
        )
      },
      {
        header: 'Clinical Diagnosis',
        accessor: 'diagnosis',
        render: (row) => (
          <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
            {row.diagnosis}
          </span>
        )
      },
      {
        header: 'Prescribed Drugs',
        accessor: 'medicines',
        render: (row) => (
          <div className="text-xs">
            <span className="font-mono text-slate-700 dark:text-slate-300 font-medium block">
              {row.medicines}
            </span>
            {row.dosage && (
              <span className="text-[11px] text-teal-700 dark:text-teal-400">
                Dosage: {row.dosage}
              </span>
            )}
          </div>
        )
      },
      {
        header: 'Date Issued',
        accessor: 'createdAt',
        className: 'w-28',
        render: (row) => (
          <span className="text-xs text-slate-500">
            {formatDate(row.createdAt)}
          </span>
        )
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
              onClick={() => setPreviewPrescription(row)}
              className="p-1.5 text-slate-500 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-lg transition"
              title="Preview & Print Rx"
            >
              <Printer className="w-4 h-4" />
            </button>
            <Link
              to={`/prescriptions/edit/${row.id}`}
              className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/40 rounded-lg transition"
              title="Edit Prescription"
            >
              <Edit2 className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => setDeleteModal({ isOpen: true, prescription: row, isDeleting: false })}
              className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
              title="Delete Prescription"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )
      }
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Prescriptions Registry
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Digitally signed medical prescriptions, medication instructions, and dosage records.
          </p>
        </div>

        <Link
          to="/prescriptions/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <FilePlus className="w-4 h-4" />
          <span>Create Prescription</span>
        </Link>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={prescriptions}
        isLoading={isLoading}
        error={error}
        onRetry={fetchPrescriptions}
        searchPlaceholder="Search by patient, physician, diagnosis, or medicines..."
        searchKeys={['patientName', 'doctorName', 'diagnosis', 'medicines', 'prescriptionId']}
        exportFileName="medicare-prescriptions.csv"
        emptyTitle="No prescriptions recorded"
        emptyDescription="Create a new prescription connected to a clinical appointment."
        emptyAction={
          <Link
            to="/prescriptions/add"
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition"
          >
            Create Prescription
          </Link>
        }
      />

      {/* Prescription Preview & Print Modal */}
      <Modal
        isOpen={Boolean(previewPrescription)}
        onClose={() => setPreviewPrescription(null)}
        title="Electronic Prescription (Rx)"
        maxWidth="max-w-2xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setPreviewPrescription(null)}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border rounded-xl"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs flex items-center gap-2"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Prescription</span>
            </button>
          </>
        }
      >
        {previewPrescription && (
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-6 print-container">
            {/* Hospital Branding Header */}
            <div className="flex justify-between items-start pb-4 border-b-2 border-teal-700">
              <div>
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-6 h-6 text-teal-700" />
                  <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                    MediCare Hospital
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Center for Clinical Excellence & Healthcare
                </p>
                <p className="text-[11px] text-slate-400">
                  Sector 14, Health City · Helpline: +91 1800-MEDICARE
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-teal-700 font-serif">℞</span>
                <p className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {previewPrescription.prescriptionId || `RX-${previewPrescription.id}`}
                </p>
                <p className="text-[11px] text-slate-400">
                  Date: {formatDate(previewPrescription.createdAt)}
                </p>
              </div>
            </div>

            {/* Patient & Doctor Demographics */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Patient Details
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {previewPrescription.patientName || 'Patient'}
                </p>
                <p className="text-slate-500">ID: {previewPrescription.patientId || '—'}</p>
              </div>

              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Consulting Physician
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {previewPrescription.doctorName || 'Dr. Attending'}
                </p>
                <p className="text-slate-500">Medical Registration Verified</p>
              </div>
            </div>

            {/* Clinical Diagnosis */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Primary Clinical Diagnosis
              </span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1 p-2.5 rounded-lg bg-teal-50/50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900">
                {previewPrescription.diagnosis}
              </p>
            </div>

            {/* Prescribed Medications */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Medications & Dosages
              </span>
              <div className="mt-2 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500">
                    <tr>
                      <th className="py-2.5 px-3">Medicine</th>
                      <th className="py-2.5 px-3">Dosage / Frequency</th>
                      <th className="py-2.5 px-3">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                        {previewPrescription.medicines}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                        {previewPrescription.dosage || 'As directed'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {previewPrescription.instructions || 'After meals'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {previewPrescription.notes && (
              <div className="text-xs text-slate-600 dark:text-slate-400">
                <strong className="text-slate-700 dark:text-slate-300">Physician Notes:</strong>{' '}
                {previewPrescription.notes}
              </div>
            )}

            {/* Doctor Signature Footer */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-end text-xs">
              <span className="text-[10px] text-slate-400">
                Generated via MediCare Electronic Health Record Platform
              </span>
              <div className="text-center">
                <div className="w-40 border-b border-slate-400 pb-1 mb-1 font-serif italic text-teal-800 dark:text-teal-400">
                  {previewPrescription.doctorName || 'Dr. Attending'}
                </div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">
                  Authorized Signature
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, prescription: null, isDeleting: false })}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteModal.isDeleting}
        title="Delete Prescription?"
        description="Are you sure you want to permanently remove this prescription record?"
        confirmText="Confirm Delete"
      />
    </div>
  );
}