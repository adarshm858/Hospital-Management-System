import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  UserPlus,
  Eye,
  Edit2,
  Trash2
} from 'lucide-react';
import patientService from '../../services/patientService';
import { useToast } from '../../context/ToastContext';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { calculateAge, getInitials } from '../../utils/formatters';
import { BLOOD_GROUPS, GENDERS } from '../../constants';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, patient: null, isDeleting: false });

  const toast = useToast();

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await patientService.getAll();
      setPatients(data || []);
    } catch (err) {
      setError(err);
      toast.error('Failed to load patient records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteModal.patient) return;
    try {
      setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
      await patientService.delete(deleteModal.patient.id);
      toast.success(`Patient record #${deleteModal.patient.patientId || deleteModal.patient.id} removed successfully.`);
      setDeleteModal({ isOpen: false, patient: null, isDeleting: false });
      fetchPatients();
    } catch (err) {
      toast.error(err.message || 'Failed to delete patient record.');
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const columns = useMemo(
    () => [
      {
        header: 'Patient ID',
        accessor: 'patientId',
        className: 'w-28',
        render: (row) => (
          <span className="font-mono text-xs font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-900">
            {row.patientId || `PAT-${row.id}`}
          </span>
        )
      },
      {
        header: 'Patient Name',
        accessor: 'firstName',
        render: (row) => {
          const fullName = `${row.firstName || ''} ${row.lastName || ''}`.trim();
          const initials = getInitials(row.firstName, row.lastName);
          return (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 font-bold text-xs flex items-center justify-center shrink-0">
                {initials}
              </div>
              <div className="truncate">
                <Link
                  to={`/patients/profile/${row.id}`}
                  className="font-semibold text-slate-900 dark:text-white hover:text-teal-700 dark:hover:text-teal-400 transition"
                >
                  {fullName || 'Unnamed Patient'}
                </Link>
                <p className="text-xs text-slate-400 truncate">{row.email || 'No email registered'}</p>
              </div>
            </div>
          );
        }
      },
      {
        header: 'Age / Gender',
        accessor: 'gender',
        className: 'w-32',
        render: (row) => {
          const age = calculateAge(row.dateOfBirth);
          return (
            <div className="text-xs">
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {age !== null ? `${age} yrs` : '—'}
              </span>
              <span className="text-slate-400 mx-1">·</span>
              <span className="capitalize text-slate-500">{row.gender ? row.gender.toLowerCase() : '—'}</span>
            </div>
          );
        }
      },
      {
        header: 'Phone Number',
        accessor: 'phone',
        className: 'w-36 font-mono text-xs'
      },
      {
        header: 'Blood Group',
        accessor: 'bloodGroup',
        className: 'w-24 text-center',
        align: 'center',
        render: (row) => (
          <Badge variant="bloodGroup">
            {row.bloodGroup || '—'}
          </Badge>
        )
      },
      {
        header: 'City / State',
        accessor: 'city',
        render: (row) => (
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {row.city ? `${row.city}${row.state ? `, ${row.state}` : ''}` : '—'}
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
            <Link
              to={`/patients/profile/${row.id}`}
              className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/40 rounded-lg transition"
              title="View EMR Profile"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <Link
              to={`/patients/edit/${row.id}`}
              className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/40 rounded-lg transition"
              title="Edit Patient Information"
            >
              <Edit2 className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => setDeleteModal({ isOpen: true, patient: row, isDeleting: false })}
              className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
              title="Delete Patient Record"
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
      key: 'gender',
      label: 'Gender',
      options: GENDERS.map((g) => ({ value: g.value, label: g.label }))
    },
    {
      key: 'bloodGroup',
      label: 'Blood Group',
      options: BLOOD_GROUPS
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Patients Registry
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage electronic health records, demographics, and clinical case histories.
          </p>
        </div>

        <Link
          to="/patients/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Patient</span>
        </Link>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={patients}
        isLoading={isLoading}
        error={error}
        onRetry={fetchPatients}
        searchPlaceholder="Search by name, ID, phone, email, or city..."
        searchKeys={['firstName', 'lastName', 'patientId', 'phone', 'email', 'city']}
        filters={filters}
        exportFileName="medicare-patients-registry.csv"
        emptyTitle="No patient records found"
        emptyDescription="Get started by registering your first patient into the MediCare EMR system."
        emptyAction={
          <Link
            to="/patients/add"
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition"
          >
            Add Patient
          </Link>
        }
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, patient: null, isDeleting: false })}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteModal.isDeleting}
        title="Delete Patient Record?"
        description={`Are you sure you want to permanently delete the record for ${
          deleteModal.patient ? `${deleteModal.patient.firstName} ${deleteModal.patient.lastName || ''}` : 'this patient'
        }? Associated appointments, lab orders, and prescriptions may also be affected.`}
        confirmText="Confirm Delete"
      />
    </div>
  );
}