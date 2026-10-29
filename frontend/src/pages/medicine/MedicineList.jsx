import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  AlertTriangle,
  PackageX,
  Calendar,
  Edit2,
  Trash2,
  Boxes
} from 'lucide-react';
import medicineService from '../../services/medicineService';
import { useToast } from '../../context/ToastContext';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { MEDICINE_CATEGORIES } from '../../constants';

export default function MedicineList() {
  const [medicines, setMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, medicine: null, isDeleting: false });

  const toast = useToast();

  const fetchMedicines = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await medicineService.getAll();
      setMedicines(data || []);
    } catch (err) {
      setError(err);
      toast.error('Failed to load pharmacy medicines.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteModal.medicine) return;
    try {
      setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
      await medicineService.delete(deleteModal.medicine.id);
      toast.success(`Medicine ${deleteModal.medicine.name} removed from inventory.`);
      setDeleteModal({ isOpen: false, medicine: null, isDeleting: false });
      fetchMedicines();
    } catch (err) {
      toast.error(err.message || 'Failed to delete medicine.');
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  // Inventory KPI metrics
  const metrics = useMemo(() => {
    const total = medicines.length;
    let lowStock = 0;
    let outOfStock = 0;
    let expiringSoon = 0;

    const now = new Date();
    const sixtyDaysLater = new Date();
    sixtyDaysLater.setDate(now.getDate() + 60);

    medicines.forEach((m) => {
      const qty = Number(m.stockQuantity || 0);
      if (qty === 0) outOfStock++;
      else if (qty < 25) lowStock++;

      if (m.expiryDate) {
        const exp = new Date(m.expiryDate);
        if (exp <= sixtyDaysLater) expiringSoon++;
      }
    });

    return { total, lowStock, outOfStock, expiringSoon };
  }, [medicines]);

  const columns = useMemo(
    () => [
      {
        header: 'Medicine Name',
        accessor: 'name',
        render: (row) => (
          <div>
            <span className="font-semibold text-slate-900 dark:text-white block">
              {row.name}
            </span>
            <span className="text-xs text-slate-400">
              {row.manufacturer || 'Generic Pharma'}
            </span>
          </div>
        )
      },
      {
        header: 'Category',
        accessor: 'category',
        render: (row) => (
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            {row.category || 'General'}
          </span>
        )
      },
      {
        header: 'In Stock',
        accessor: 'stockQuantity',
        className: 'w-32',
        render: (row) => {
          const qty = Number(row.stockQuantity || 0);
          const isOut = qty === 0;
          const isLow = qty > 0 && qty < 25;

          return (
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span
                  className={
                    isOut
                      ? 'text-rose-600 dark:text-rose-400'
                      : isLow
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }
                >
                  {qty} units
                </span>
              </div>
              <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isOut ? 'w-0' : isLow ? 'bg-amber-500 w-1/3' : 'bg-emerald-500 w-full'
                  }`}
                />
              </div>
            </div>
          );
        }
      },
      {
        header: 'Unit Price',
        accessor: 'unitPrice',
        className: 'w-28',
        render: (row) => (
          <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
            {formatCurrency(row.unitPrice)}
          </span>
        )
      },
      {
        header: 'Expiry Date',
        accessor: 'expiryDate',
        className: 'w-32',
        render: (row) => {
          const isExpired = row.expiryDate && new Date(row.expiryDate) < new Date();
          return (
            <span
              className={`text-xs ${
                isExpired ? 'text-rose-600 font-bold' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {formatDate(row.expiryDate)}
            </span>
          );
        }
      },
      {
        header: 'Status',
        accessor: 'stockQuantity',
        className: 'w-28 text-center',
        align: 'center',
        render: (row) => {
          const qty = Number(row.stockQuantity || 0);
          const isExpired = row.expiryDate && new Date(row.expiryDate) < new Date();
          if (isExpired) return <Badge color="red" size="xs">Expired</Badge>;
          if (qty === 0) return <Badge color="red" size="xs">Out of Stock</Badge>;
          if (qty < 25) return <Badge color="amber" size="xs">Low Stock</Badge>;
          return <Badge color="green" size="xs">In Stock</Badge>;
        }
      },
      {
        header: 'Actions',
        className: 'w-24 text-right',
        align: 'right',
        sortable: false,
        render: (row) => (
          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
            <Link
              to={`/medicines/edit/${row.id}`}
              className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/40 rounded-lg transition"
              title="Edit Medicine"
            >
              <Edit2 className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => setDeleteModal({ isOpen: true, medicine: row, isDeleting: false })}
              className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
              title="Delete from Inventory"
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
      options: MEDICINE_CATEGORIES
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Pharmacy & Medicine Inventory
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Monitor hospital drug stocks, unit pricing, batch lots, and expiry alerts.
          </p>
        </div>

        <Link
          to="/medicines/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Medicine</span>
        </Link>
      </div>

      {/* Inventory KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold">Total Items</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {metrics.total}
            </h3>
            <span className="text-[11px] text-teal-600 font-medium">Catalogued drugs</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 flex items-center justify-center">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold">Low Stock Warning</span>
            <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
              {metrics.lowStock}
            </h3>
            <span className="text-[11px] text-amber-500 font-medium">&lt; 25 units left</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold">Out of Stock</span>
            <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
              {metrics.outOfStock}
            </h3>
            <span className="text-[11px] text-rose-500 font-medium">Immediate reorder</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center">
            <PackageX className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold">Expiring Soon</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {metrics.expiringSoon}
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Within 60 days</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={medicines}
        isLoading={isLoading}
        error={error}
        onRetry={fetchMedicines}
        searchPlaceholder="Search by medicine name, manufacturer, or category..."
        searchKeys={['name', 'manufacturer', 'category', 'description']}
        filters={filters}
        exportFileName="medicare-pharmacy-inventory.csv"
        emptyTitle="No medicines registered"
        emptyDescription="Add pharmaceuticals to track stock levels and dispense to clinical prescriptions."
        emptyAction={
          <Link
            to="/medicines/add"
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition"
          >
            Add Medicine
          </Link>
        }
      />

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, medicine: null, isDeleting: false })}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteModal.isDeleting}
        title="Remove Medicine from Pharmacy?"
        description={`Are you sure you want to delete ${
          deleteModal.medicine?.name || 'this medicine'
        } from the active dispensary catalog?`}
        confirmText="Remove Medicine"
      />
    </div>
  );
}