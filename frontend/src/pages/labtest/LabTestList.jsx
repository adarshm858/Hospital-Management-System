import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2
} from 'lucide-react';
import labService from '../../services/labService';
import { useToast } from '../../context/ToastContext';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { formatCurrency } from '../../utils/formatters';
import { LAB_TEST_CATEGORIES } from '../../constants';

export default function LabTestList() {
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, test: null, isDeleting: false });

  const toast = useToast();

  const fetchTests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await labService.getAllTests();
      setTests(data || []);
    } catch (err) {
      setError(err);
      toast.error('Failed to load laboratory tests catalog.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteModal.test) return;
    try {
      setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
      await labService.deleteTest(deleteModal.test.id);
      toast.success(`Lab test ${deleteModal.test.testName} removed from catalog.`);
      setDeleteModal({ isOpen: false, test: null, isDeleting: false });
      fetchTests();
    } catch (err) {
      toast.error(err.message || 'Failed to remove lab test.');
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const columns = useMemo(
    () => [
      {
        header: 'Test Code',
        accessor: 'testId',
        className: 'w-28',
        render: (row) => (
          <span className="font-mono text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-900">
            {row.testId || `TEST-${row.id}`}
          </span>
        )
      },
      {
        header: 'Diagnostic Investigation',
        accessor: 'testName',
        render: (row) => (
          <div>
            <span className="font-semibold text-slate-900 dark:text-white block">
              {row.testName}
            </span>
            <span className="text-xs text-slate-400 max-w-sm truncate block">
              {row.description || 'Standard Diagnostic Panel'}
            </span>
          </div>
        )
      },
      {
        header: 'Laboratory Category',
        accessor: 'category',
        render: (row) => (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            {row.category || 'Pathology'}
          </span>
        )
      },
      {
        header: 'Standard Fee',
        accessor: 'testFee',
        className: 'w-28',
        render: (row) => (
          <span className="font-bold text-xs text-slate-900 dark:text-white">
            {formatCurrency(row.testFee)}
          </span>
        )
      },
      {
        header: 'Status',
        accessor: 'available',
        className: 'w-28 text-center',
        align: 'center',
        render: (row) => (
          <Badge color={row.available !== false ? 'green' : 'slate'} dot size="xs">
            {row.available !== false ? 'Active' : 'Suspended'}
          </Badge>
        )
      },
      {
        header: 'Actions',
        className: 'w-24 text-right',
        align: 'right',
        sortable: false,
        render: (row) => (
          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
            <Link
              to={`/lab-tests/edit/${row.id}`}
              className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/40 rounded-lg transition"
              title="Edit Test Details"
            >
              <Edit2 className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => setDeleteModal({ isOpen: true, test: row, isDeleting: false })}
              className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
              title="Delete Test"
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
      key: 'category',
      label: 'Category',
      options: LAB_TEST_CATEGORIES
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Laboratory Tests Directory
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Catalog of pathology, radiology, microbiology, and diagnostic clinical investigations.
          </p>
        </div>

        <Link
          to="/lab-tests/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Test</span>
        </Link>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={tests}
        isLoading={isLoading}
        error={error}
        onRetry={fetchTests}
        searchPlaceholder="Search by test name, category, or test ID..."
        searchKeys={['testName', 'category', 'description', 'testId']}
        filters={filters}
        exportFileName="medicare-lab-tests.csv"
        emptyTitle="No laboratory tests catalogued"
        emptyDescription="Define diagnostic laboratory investigations to enable doctor requisitions."
        emptyAction={
          <Link
            to="/lab-tests/add"
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition"
          >
            Add Lab Test
          </Link>
        }
      />

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, test: null, isDeleting: false })}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteModal.isDeleting}
        title="Remove Lab Test?"
        description={`Are you sure you want to delete ${
          deleteModal.test?.testName || 'this test'
        } from the laboratory investigations catalog?`}
        confirmText="Remove Test"
      />
    </div>
  );
}