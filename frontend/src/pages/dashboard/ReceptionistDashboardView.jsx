import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserPlus,
  CalendarPlus,
  Receipt,
  Search
} from 'lucide-react';
import { usePrivacy } from '../../context/PrivacyContext';
import { useToast } from '../../context/ToastContext';
import appointmentService from '../../services/appointmentService';
import Badge from '../../components/common/Badge';
import { formatTime } from '../../utils/formatters';

export default function ReceptionistDashboardView({ appointments = [], doctors = [], onDataChange }) {
  const { mask } = usePrivacy();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchFilter, setSearchFilter] = useState('');

  const handleCheckIn = async (appointmentId) => {
    try {
      await appointmentService.updateStatus(appointmentId, 'WAITING');
      toast.success('Patient checked in and placed into doctor waiting queue.');
      if (onDataChange) onDataChange();
    } catch {
      toast.error('Failed to update patient check-in status.');
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    const q = searchFilter.toLowerCase();
    const name = (a.patientName || `patient #${a.patientId}`).toLowerCase();
    const doc = (a.doctorName || '').toLowerCase();
    return name.includes(q) || doc.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Reception Desk Header & Quick Action Buttons */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300">
                RECEPTION & ADMISSIONS
              </span>
              <span className="text-xs text-slate-500">Front Desk Station 1</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Patient Intake & Check-In Desk
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Rapid outpatient check-in, registration intake, appointment scheduling, and cashier billing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/patients/add')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Patient</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/appointments/add')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/bills/add')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Create Bill</span>
            </button>
          </div>
        </div>

        {/* Reception KPI counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Scheduled Today</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">{appointments.length}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Waiting Queue</span>
            <span className="text-xl font-bold text-amber-600">
              {appointments.filter((a) => a.status === 'WAITING').length}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Completed Visits</span>
            <span className="text-xl font-bold text-emerald-600">
              {appointments.filter((a) => a.status === 'COMPLETED').length}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Doctors on Floor</span>
            <span className="text-xl font-bold text-indigo-600">{doctors.length || 6}</span>
          </div>
        </div>
      </div>

      {/* Main Table: Today's Check-in Queue */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Today's Patient Schedule & Check-In Desk
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mark patient arrival, verify appointment slots, and dispatch to physician waiting rooms
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search patient or doctor..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-hidden"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold uppercase text-slate-400">
                <th className="pb-3">Slot ID</th>
                <th className="pb-3">Patient</th>
                <th className="pb-3">Physician</th>
                <th className="pb-3">Time</th>
                <th className="pb-3">Reason</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Desk Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-mono text-xs text-slate-400">#{appt.id}</td>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      {mask(appt.patientName || `Patient #${appt.patientId}`, 'name')}
                    </td>
                    <td className="py-3 text-xs text-slate-600 dark:text-slate-300">
                      {appt.doctorName || 'Dr. Consultant'}
                    </td>
                    <td className="py-3 text-xs text-slate-500">
                      {formatTime(appt.appointmentTime)}
                    </td>
                    <td className="py-3 text-xs text-slate-500 truncate max-w-[160px]">
                      {appt.reason || 'Consultation'}
                    </td>
                    <td className="py-3">
                      <Badge>{appt.status || 'SCHEDULED'}</Badge>
                    </td>
                    <td className="py-3 text-right space-x-1">
                      {appt.status === 'SCHEDULED' && (
                        <button
                          type="button"
                          onClick={() => handleCheckIn(appt.id)}
                          className="px-2.5 py-1 text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 rounded-lg transition"
                        >
                          Check In
                        </button>
                      )}
                      <Link
                        to="/bills/add"
                        className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg transition"
                      >
                        Bill
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-xs text-slate-400">
                    No matching appointments found for today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
