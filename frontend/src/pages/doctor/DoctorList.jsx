import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  UserPlus,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail
} from 'lucide-react';
import doctorService from '../../services/doctorService';
import { useToast } from '../../context/ToastContext';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import Modal from '../../components/common/Modal';
import { formatCurrency, getInitials } from '../../utils/formatters';
import { SPECIALIZATIONS } from '../../constants';

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected doctor for quick view modal
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, doctor: null, isDeleting: false });

  const toast = useToast();

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await doctorService.getAll();
      setDoctors(data || []);
    } catch (err) {
      setError(err);
      toast.error('Failed to load doctors list.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteModal.doctor) return;
    try {
      setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
      await doctorService.delete(deleteModal.doctor.id);
      toast.success(`Doctor profile #${deleteModal.doctor.doctorId || deleteModal.doctor.id} removed.`);
      setDeleteModal({ isOpen: false, doctor: null, isDeleting: false });
      fetchDoctors();
    } catch (err) {
      toast.error(err.message || 'Failed to remove doctor profile.');
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const handleToggleDuty = async (doctor) => {
    try {
      const newStatus = doctor.available === false;
      await doctorService.update(doctor.id, {
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        phone: doctor.phone,
        gender: doctor.gender,
        specialization: doctor.specialization,
        qualification: doctor.qualification,
        experience: doctor.experience,
        consultationFee: doctor.consultationFee,
        address: doctor.address,
        city: doctor.city,
        state: doctor.state,
        country: doctor.country,
        available: newStatus
      });
      toast.success(`Dr. ${doctor.firstName} ${doctor.lastName || ''} is now ${newStatus ? 'On Duty' : 'On Leave'}`);
      fetchDoctors();
    } catch {
      toast.error('Failed to update doctor availability status.');
    }
  };

  const columns = useMemo(
    () => [
      {
        header: 'Doctor ID',
        accessor: 'doctorId',
        className: 'w-28',
        render: (row) => (
          <span className="font-mono text-xs font-semibold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-900">
            {row.doctorId || `DOC-${row.id}`}
          </span>
        )
      },
      {
        header: 'Doctor Name',
        accessor: 'firstName',
        render: (row) => {
          const fullName = `Dr. ${row.firstName || ''} ${row.lastName || ''}`.trim();
          const initials = getInitials(row.firstName, row.lastName);
          return (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-700 to-sky-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                {initials}
              </div>
              <div className="truncate">
                <button
                  type="button"
                  onClick={() => setSelectedDoctor(row)}
                  className="font-semibold text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition text-left"
                >
                  {fullName}
                </button>
                <p className="text-xs text-slate-400 truncate">{row.qualification || 'MBBS'}</p>
              </div>
            </div>
          );
        }
      },
      {
        header: 'Specialization',
        accessor: 'specialization',
        render: (row) => (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            {row.specialization || 'General Practitioner'}
          </span>
        )
      },
      {
        header: 'Experience',
        accessor: 'experience',
        className: 'w-28 text-center',
        align: 'center',
        render: (row) => (
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            {row.experience ? `${row.experience} yrs` : '—'}
          </span>
        )
      },
      {
        header: 'Fee',
        accessor: 'consultationFee',
        className: 'w-28',
        render: (row) => (
          <span className="font-semibold text-xs text-slate-900 dark:text-white">
            {formatCurrency(row.consultationFee)}
          </span>
        )
      },
      {
        header: 'Status',
        accessor: 'available',
        className: 'w-28 text-center',
        align: 'center',
        render: (row) => (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleDuty(row);
            }}
            title={`Click to switch to ${row.available !== false ? 'On Leave' : 'On Duty'}`}
            className="cursor-pointer transition transform active:scale-95"
          >
            <Badge
              color={row.available !== false ? 'green' : 'slate'}
              dot
              size="xs"
            >
              {row.available !== false ? 'On Duty' : 'On Leave'}
            </Badge>
          </button>
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
              onClick={() => setSelectedDoctor(row)}
              className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/40 rounded-lg transition"
              title="View Doctor Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <Link
              to={`/doctors/edit/${row.id}`}
              className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/40 rounded-lg transition"
              title="Edit Profile"
            >
              <Edit2 className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => setDeleteModal({ isOpen: true, doctor: row, isDeleting: false })}
              className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
              title="Remove Doctor"
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
      key: 'specialization',
      label: 'Specialty',
      options: SPECIALIZATIONS
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Medical Staff & Doctors
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Directory of licensed physicians, surgeons, specialists, and clinical consultants.
          </p>
        </div>

        <Link
          to="/doctors/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Doctor</span>
        </Link>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={doctors}
        isLoading={isLoading}
        error={error}
        onRetry={fetchDoctors}
        searchPlaceholder="Search by doctor name, specialty, qualification, phone..."
        searchKeys={['firstName', 'lastName', 'specialization', 'qualification', 'phone', 'email']}
        filters={filters}
        exportFileName="medicare-doctors-directory.csv"
        emptyTitle="No medical doctors found"
        emptyDescription="Add licensed physicians and consultants to enable appointment bookings."
        emptyAction={
          <Link
            to="/doctors/add"
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition"
          >
            Add Doctor
          </Link>
        }
      />

      {/* Doctor Quick View Modal */}
      <Modal
        isOpen={Boolean(selectedDoctor)}
        onClose={() => setSelectedDoctor(null)}
        title="Physician Credentials & Profile"
        maxWidth="max-w-lg"
      >
        {selectedDoctor && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-700 to-teal-600 text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-md">
                {getInitials(selectedDoctor.firstName, selectedDoctor.lastName)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                </h3>
                <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                  {selectedDoctor.specialization}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge color={selectedDoctor.available !== false ? 'green' : 'slate'} size="xs" dot>
                    {selectedDoctor.available !== false ? 'Available on Duty' : 'Currently on Leave'}
                  </Badge>
                  <span className="font-mono text-[11px] text-slate-400">
                    {selectedDoctor.doctorId || `DOC-${selectedDoctor.id}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-0.5">Qualifications</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedDoctor.qualification || 'MBBS, MD'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-0.5">Clinical Experience</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedDoctor.experience || '5+'} Years
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-0.5">Consultation Fee</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatCurrency(selectedDoctor.consultationFee)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-0.5">Contact Phone</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  {selectedDoctor.phone || '—'}
                </span>
              </div>
            </div>

            <div className="text-xs space-y-1.5 pt-2 text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedDoctor.email || 'doctor@hospital.org'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedDoctor.address || 'MediCare Hospital Campus, Wing B'}</span>
              </div>
            </div>

            <div className="pt-3 flex justify-between items-center gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={async () => {
                  const updatedAvailable = selectedDoctor.available === false;
                  await handleToggleDuty(selectedDoctor);
                  setSelectedDoctor((prev) => (prev ? { ...prev, available: updatedAvailable } : null));
                }}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                Mark as {selectedDoctor.available !== false ? 'On Leave' : 'On Duty'}
              </button>
              <Link
                to={`/doctors/edit/${selectedDoctor.id}`}
                className="px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50 dark:bg-teal-950/50 rounded-xl hover:bg-teal-100 transition"
              >
                Edit Doctor Profile
              </Link>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, doctor: null, isDeleting: false })}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteModal.isDeleting}
        title="Remove Doctor Profile?"
        description={`Are you sure you want to remove Dr. ${
          deleteModal.doctor ? `${deleteModal.doctor.firstName} ${deleteModal.doctor.lastName || ''}` : ''
        } from the active medical directory?`}
        confirmText="Remove Physician"
      />
    </div>
  );
}