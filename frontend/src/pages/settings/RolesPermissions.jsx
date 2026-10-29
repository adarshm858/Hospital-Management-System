import { useState } from 'react';
import {
  Check,
  X,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const MODULES = [
  'Patients (EMR)',
  'Doctors Registry',
  'Appointments & Scheduling',
  'Prescriptions (Rx)',
  'Pharmacy & Inventory',
  'Laboratory & Diagnostics',
  'Billing & Financial Invoicing',
  'Clinical Reports & Audit',
  'System Administration & Settings'
];

const PERMISSIONS = ['View', 'Create', 'Edit', 'Delete', 'Export', 'Approve'];

// Default RBAC Matrix definition for hospital staff
const DEFAULT_MATRIX = {
  ADMIN: {
    'Patients (EMR)': ['View', 'Create', 'Edit', 'Delete', 'Export', 'Approve'],
    'Doctors Registry': ['View', 'Create', 'Edit', 'Delete', 'Export', 'Approve'],
    'Appointments & Scheduling': ['View', 'Create', 'Edit', 'Delete', 'Export', 'Approve'],
    'Prescriptions (Rx)': ['View', 'Create', 'Edit', 'Delete', 'Export', 'Approve'],
    'Pharmacy & Inventory': ['View', 'Create', 'Edit', 'Delete', 'Export', 'Approve'],
    'Laboratory & Diagnostics': ['View', 'Create', 'Edit', 'Delete', 'Export', 'Approve'],
    'Billing & Financial Invoicing': ['View', 'Create', 'Edit', 'Delete', 'Export', 'Approve'],
    'Clinical Reports & Audit': ['View', 'Create', 'Edit', 'Delete', 'Export', 'Approve'],
    'System Administration & Settings': ['View', 'Create', 'Edit', 'Delete', 'Export', 'Approve']
  },
  DOCTOR: {
    'Patients (EMR)': ['View', 'Create', 'Edit', 'Export'],
    'Doctors Registry': ['View'],
    'Appointments & Scheduling': ['View', 'Create', 'Edit', 'Approve'],
    'Prescriptions (Rx)': ['View', 'Create', 'Edit', 'Approve', 'Export'],
    'Pharmacy & Inventory': ['View'],
    'Laboratory & Diagnostics': ['View', 'Create', 'Approve'],
    'Billing & Financial Invoicing': ['View'],
    'Clinical Reports & Audit': ['View', 'Export'],
    'System Administration & Settings': []
  },
  RECEPTIONIST: {
    'Patients (EMR)': ['View', 'Create', 'Edit'],
    'Doctors Registry': ['View'],
    'Appointments & Scheduling': ['View', 'Create', 'Edit', 'Delete'],
    'Prescriptions (Rx)': ['View'],
    'Pharmacy & Inventory': ['View'],
    'Laboratory & Diagnostics': ['View'],
    'Billing & Financial Invoicing': ['View', 'Create', 'Edit', 'Export'],
    'Clinical Reports & Audit': ['View'],
    'System Administration & Settings': []
  },
  PHARMACIST: {
    'Patients (EMR)': ['View'],
    'Doctors Registry': ['View'],
    'Appointments & Scheduling': ['View'],
    'Prescriptions (Rx)': ['View', 'Approve'],
    'Pharmacy & Inventory': ['View', 'Create', 'Edit', 'Delete', 'Export', 'Approve'],
    'Laboratory & Diagnostics': ['View'],
    'Billing & Financial Invoicing': ['View'],
    'Clinical Reports & Audit': ['View', 'Export'],
    'System Administration & Settings': []
  },
  LAB_TECHNICIAN: {
    'Patients (EMR)': ['View'],
    'Doctors Registry': ['View'],
    'Appointments & Scheduling': ['View'],
    'Prescriptions (Rx)': ['View'],
    'Pharmacy & Inventory': ['View'],
    'Laboratory & Diagnostics': ['View', 'Create', 'Edit', 'Delete', 'Export', 'Approve'],
    'Billing & Financial Invoicing': ['View'],
    'Clinical Reports & Audit': ['View', 'Export'],
    'System Administration & Settings': []
  }
};

export default function RolesPermissions() {
  const { activeRole, setActiveRole } = useAuth();
  const toast = useToast();
  const [selectedRole, setSelectedRole] = useState(activeRole || 'ADMIN');

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleApplyRole = (role) => {
    setActiveRole(role);
    toast.success(`Active hospital role switched to ${role}. UI permissions synchronized.`);
  };

  const currentRoleMatrix = DEFAULT_MATRIX[selectedRole] || DEFAULT_MATRIX.ADMIN;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300">
              ACCESS CONTROL
            </span>
            <span className="text-xs text-slate-500">RBAC Security Policy</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Roles & Clinical Permissions Matrix
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Explicit matrix of CRUD, export, and approval capabilities governing clinical modules and hospital data access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleApplyRole(selectedRole)}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Switch My Active Role to {selectedRole}</span>
          </button>
        </div>
      </div>

      {/* Role Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {Object.keys(DEFAULT_MATRIX).map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => handleRoleSelect(role)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              selectedRole === role
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{role}</span>
            {activeRole === role && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Currently Active" />
            )}
          </button>
        ))}
      </div>

      {/* Security Note */}
      <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2.5">
        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
        <span>
          <strong>Enterprise Security Boundary:</strong> UI permissions enforce healthcare workflow hygiene. All sensitive operations remain strictly validated by Spring Security JWT claims on the Spring Boot backend.
        </span>
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-500">
                <th className="py-3 px-4">Hospital Functional Module</th>
                {PERMISSIONS.map((perm) => (
                  <th key={perm} className="py-3 px-4 text-center">
                    {perm}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {MODULES.map((moduleName) => {
                const granted = currentRoleMatrix[moduleName] || [];
                return (
                  <tr key={moduleName} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-semibold text-xs text-slate-800 dark:text-slate-200">
                      {moduleName}
                    </td>
                    {PERMISSIONS.map((perm) => {
                      const hasPerm = granted.includes(perm);
                      return (
                        <td key={perm} className="py-3 px-4 text-center">
                          {hasPerm ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600">
                              <X className="w-3.5 h-3.5 stroke-[2]" />
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
