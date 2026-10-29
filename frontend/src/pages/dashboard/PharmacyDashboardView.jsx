import { Link, useNavigate } from 'react-router-dom';
import {
  Pill,
  AlertTriangle,
  PackageX,
  Plus,
  ArrowRight,
  Boxes,
  FileCheck
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import { formatCurrency } from '../../utils/formatters';

export default function PharmacyDashboardView({ medicines = [], prescriptions = [] }) {
  const navigate = useNavigate();

  // Stock calculations
  const totalStock = medicines.reduce((acc, m) => acc + (m.stockQuantity ?? m.quantity ?? 0), 0);
  const lowStockMeds = medicines.filter((m) => (m.stockQuantity ?? m.quantity ?? 0) > 0 && (m.stockQuantity ?? m.quantity ?? 0) <= 20);
  const outOfStockMeds = medicines.filter((m) => (m.stockQuantity ?? m.quantity ?? 0) === 0);

  // Recent Stock Movements (Simulated clinical dispensing log)
  const stockMovements = [
    { id: 'SM-101', drug: 'Paracetamol 500mg (Tab)', batch: 'PCM-2026-A1', type: 'DISPENSED', qty: -30, time: '14m ago', ward: 'OPD Pharmacy' },
    { id: 'SM-102', drug: 'Amoxicillin 250mg/5ml (Syrup)', batch: 'AMX-2025-C2', type: 'RESTOCKED', qty: +100, time: '1h ago', ward: 'Central Stores' },
    { id: 'SM-103', drug: 'Atorvastatin 20mg (Tab)', batch: 'ATV-2026-D4', type: 'DISPENSED', qty: -60, time: '2h ago', ward: 'Cardiology Ward' },
    { id: 'SM-104', drug: 'Pantoprazole 40mg (IV)', batch: 'PAN-2025-B9', type: 'DISPENSED', qty: -15, time: '3h ago', ward: 'ICU Ward 2' }
  ];

  return (
    <div className="space-y-6">
      {/* Pharmacy Header & Action */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300">
              PHARMACY OPERATIONS
            </span>
            <span className="text-xs text-slate-500">Central Formulary & Dispensary</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Medication Inventory & Formulary
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time drug balance, low-stock alerts, batch tracking, and prescription dispensing queue.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/medicines/add')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Medicine</span>
        </button>
      </div>

      {/* 4 Inventory Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Drugs In Catalog
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
            {medicines.length} Formulations
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{totalStock} total units in stock</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Low Stock Alerts
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-amber-600">
            {lowStockMeds.length} Items
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Below minimum reorder threshold</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Out of Stock
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <PackageX className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-rose-600">
            {outOfStockMeds.length} Items
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Requires immediate supplier purchase</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Prescriptions
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-indigo-600">
            {prescriptions.length || 5} Orders
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting pharmacist verification</p>
        </div>
      </div>

      {/* Main Grid: Critical Stock Watch (2 cols) & Stock Movement Feed (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Critical Stock Watch Table (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Formulary Stock Balance
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Active catalog inventory with batch and expiry tracking
              </p>
            </div>
            <Link
              to="/medicines"
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>Full Inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold uppercase text-slate-400">
                  <th className="pb-3">Drug Name</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Batch</th>
                  <th className="pb-3">Balance</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {medicines.length > 0 ? (
                  medicines.slice(0, 6).map((med) => {
                    const qty = med.stockQuantity ?? med.quantity ?? 0;
                    return (
                      <tr key={med.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-3 font-semibold text-slate-900 dark:text-white">
                          {med.name}
                        </td>
                        <td className="py-3 text-xs text-slate-500">{med.category || 'General'}</td>
                        <td className="py-3 font-mono text-xs text-slate-400">{med.batchNumber || 'N/A'}</td>
                        <td className="py-3 font-bold text-xs">{qty} units</td>
                        <td className="py-3 text-xs font-semibold">{formatCurrency(med.unitPrice || 0)}</td>
                        <td className="py-3">
                          <Badge variant={qty === 0 ? 'danger' : qty <= 20 ? 'warning' : 'success'}>
                            {qty === 0 ? 'OUT OF STOCK' : qty <= 20 ? 'LOW STOCK' : 'IN STOCK'}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-xs text-slate-400">
                      No medications enrolled in inventory yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Movement Feed (1 col) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Live Stock Movement
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dispensed & restocked ledger
              </p>
            </div>
            <Boxes className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto max-h-80">
            {stockMovements.map((item) => (
              <div key={item.id} className="flex items-start justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{item.drug}</p>
                  <p className="text-[11px] text-slate-400">{item.ward} · Batch {item.batch}</p>
                  <span className="text-[10px] text-slate-400">{item.time}</span>
                </div>
                <div className="text-right">
                  <span className={`font-mono font-bold text-xs ${item.qty > 0 ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-300'}`}>
                    {item.qty > 0 ? `+${item.qty}` : item.qty}
                  </span>
                  <span className="block text-[10px] font-semibold text-slate-400">{item.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
