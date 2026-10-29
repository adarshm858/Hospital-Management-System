import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarPlus,
  List,
  Clock,
  Edit2,
  Trash2,
  CheckCircle,
  Calendar as CalendarIcon,
  Activity,
  Stethoscope,
  PlayCircle
} from 'lucide-react';
import appointmentService from '../../services/appointmentService';
import { useToast } from '../../context/ToastContext';
import { usePrivacy } from '../../context/PrivacyContext';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import Modal from '../../components/common/Modal';
import { formatDate, formatTime } from '../../utils/formatters';

export default function AppointmentList() {
  const { mask } = usePrivacy();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // View mode: 'list' | 'queue' | 'calendar'
  const [viewMode, setViewMode] = useState('list');

  // Status update modal
  const [statusModal, setStatusModal] = useState({ isOpen: false, appointment: null, newStatus: 'COMPLETED' });

  // Delete modal
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, appointment: null, isDeleting: false });

  const toast = useToast();

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await appointmentService.getAll();
      setAppointments(data || []);
    } catch (err) {
      setError(err);
      toast.error('Failed to load appointments.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async () => {
    if (!statusModal.appointment) return;
    try {
      await appointmentService.update(statusModal.appointment.id, {
        appointmentDate: statusModal.appointment.appointmentDate,
        appointmentTime: statusModal.appointment.appointmentTime,
        reason: statusModal.appointment.reason,
        status: statusModal.newStatus
      });
      toast.success(`Appointment status updated to ${statusModal.newStatus}`);
      setStatusModal({ isOpen: false, appointment: null, newStatus: 'COMPLETED' });
      fetchAppointments();
    } catch (err) {
      toast.error(err.message || 'Failed to update status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.appointment) return;
    try {
      setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
      await appointmentService.delete(deleteModal.appointment.id);
      toast.success('Appointment cancelled and removed.');
      setDeleteModal({ isOpen: false, appointment: null, isDeleting: false });
      fetchAppointments();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel appointment.');
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };



  const columns = useMemo(
    () => [
      {
        header: 'Appt ID',
        accessor: 'appointmentId',
        className: 'w-28',
        render: (row) => (
          <span className="font-mono text-xs font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-900">
            {mask(row.appointmentId || `APT-${row.id}`, 'id')}
          </span>
        )
      },
      {
        header: 'Patient',
        accessor: 'patientName',
        render: (row) => (
          <div>
            <span className="font-semibold text-slate-900 dark:text-white">
              {mask(row.patientName || 'Patient', 'name')}
            </span>
            {row.patientId && (
              <span className="text-[11px] text-slate-400 font-mono block">
                ID: {mask(row.patientId, 'id')}
              </span>
            )}
          </div>
        )
      },
      {
        header: 'Attending Physician',
        accessor: 'doctorName',
        render: (row) => (
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {row.doctorName || 'Assigned Physician'}
          </span>
        )
      },
      {
        header: 'Date & Time',
        accessor: 'appointmentDate',
        render: (row) => (
          <div className="text-xs">
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
              {formatDate(row.appointmentDate)}
            </span>
            <span className="text-slate-400 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" />
              {formatTime(row.appointmentTime)}
            </span>
          </div>
        )
      },
      {
        header: 'Clinical Reason',
        accessor: 'reason',
        render: (row) => (
          <span className="text-xs text-slate-600 dark:text-slate-400 max-w-xs truncate block">
            {row.reason || 'General Follow-up'}
          </span>
        )
      },
      {
        header: 'Status',
        accessor: 'status',
        className: 'w-28 text-center',
        align: 'center',
        render: (row) => <Badge dot size="xs">{row.status || 'SCHEDULED'}</Badge>
      },
      {
        header: 'Actions',
        className: 'w-32 text-right',
        align: 'right',
        sortable: false,
        render: (row) => (
          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
            {/* Quick complete button */}
            {row.status !== 'COMPLETED' && (
              <button
                type="button"
                onClick={() => setStatusModal({ isOpen: true, appointment: row, newStatus: 'COMPLETED' })}
                className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition"
                title="Mark as Completed"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            )}

            {/* Quick status edit */}
            <button
              type="button"
              onClick={() => setStatusModal({ isOpen: true, appointment: row, newStatus: row.status || 'SCHEDULED' })}
              className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/40 rounded-lg transition"
              title="Update Status"
            >
              <Activity className="w-4 h-4" />
            </button>

            <Link
              to={`/appointments/edit/${row.id}`}
              className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/40 rounded-lg transition"
              title="Reschedule / Edit"
            >
              <Edit2 className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => setDeleteModal({ isOpen: true, appointment: row, isDeleting: false })}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
              title="Cancel Appointment"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )
      }
    ],
    [mask]
  );

  const filters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'SCHEDULED', label: 'Scheduled' },
        { value: 'CONFIRMED', label: 'Confirmed' },
        { value: 'WAITING', label: 'Waiting in Queue' },
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'CANCELLED', label: 'Cancelled' },
        { value: 'NO_SHOW', label: 'No Show' }
      ]
    }
  ];

  // Calendar groupings (next 7 days)
  const calendarDays = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const slots = appointments.filter((a) => a.appointmentDate === dateStr);
      days.push({
        date: dateStr,
        dayName: d.toLocaleDateString(undefined, { weekday: 'short' }),
        dayNum: d.getDate(),
        month: d.toLocaleDateString(undefined, { month: 'short' }),
        slots
      });
    }
    return days;
  }, [appointments]);

  // Queue stages for Queue View
  const queueStages = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const waiting = appointments.filter(
      (a) => a.status === 'WAITING' || (a.status === 'SCHEDULED' && a.appointmentDate === todayStr)
    );
    const inProgress = appointments.filter((a) => a.status === 'IN_PROGRESS');
    const completedToday = appointments.filter((a) => a.status === 'COMPLETED');
    return { waiting, inProgress, completedToday };
  }, [appointments]);

  const quickChangeStatus = async (appointment, newStatus) => {
    try {
      await appointmentService.update(appointment.id, {
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        reason: appointment.reason,
        status: newStatus
      });
      toast.success(`Patient moved to ${newStatus}`);
      fetchAppointments();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Appointment Management
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Schedule consultations, track physician slots, and check in patients.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Toggles: List, Queue, Calendar */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('queue')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                viewMode === 'queue'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Queue Triage ({queueStages.waiting.length + queueStages.inProgress.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
          </div>

          <Link
            to="/appointments/add"
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Book Appointment</span>
          </Link>
        </div>
      </div>

      {/* 1. List View */}
      {viewMode === 'list' && (
        <DataTable
          columns={columns}
          data={appointments}
          isLoading={isLoading}
          error={error}
          onRetry={fetchAppointments}
          searchPlaceholder="Search by patient, doctor, reason, or appointment ID..."
          searchKeys={['patientName', 'doctorName', 'reason', 'appointmentId']}
          filters={filters}
          exportFileName="medicare-appointments.csv"
          emptyTitle="No appointments on record"
          emptyDescription="Book a new consultation slot for an outpatient or specialist visit."
          emptyAction={
            <Link
              to="/appointments/add"
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition"
            >
              Book Appointment
            </Link>
          }
        />
      )}

      {/* 2. Queue Triage View */}
      {viewMode === 'queue' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Waiting Lane */}
          <div className="bg-slate-50/60 dark:bg-slate-900/60 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100 dark:border-amber-950">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Waiting in Lobby</h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                {queueStages.waiting.length}
              </span>
            </div>

            <div className="space-y-3">
              {queueStages.waiting.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">
                  No patients currently waiting in lobby.
                </div>
              ) : (
                queueStages.waiting.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] text-teal-700 dark:text-teal-400 font-semibold">
                        {mask(apt.appointmentId || `APT-${apt.id}`, 'id')}
                      </span>
                      <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                        Wait: ~12m
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {mask(apt.patientName || 'Patient', 'name')}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                        <Stethoscope className="w-3 h-3 text-slate-400" />
                        {apt.doctorName || 'Assigned Physician'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700 text-xs">
                      <span className="text-slate-400 font-mono">{formatTime(apt.appointmentTime)}</span>
                      <button
                        type="button"
                        onClick={() => quickChangeStatus(apt, 'IN_PROGRESS')}
                        className="px-2.5 py-1 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg flex items-center gap-1"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Start Consult</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* In Consultation Lane */}
          <div className="bg-slate-50/60 dark:bg-slate-900/60 rounded-2xl border border-teal-200/60 dark:border-teal-900/40 p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-teal-100 dark:border-teal-950">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-teal-500 animate-pulse"></span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">In Consultation</h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                {queueStages.inProgress.length}
              </span>
            </div>

            <div className="space-y-3">
              {queueStages.inProgress.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">
                  No active consultations right now.
                </div>
              ) : (
                queueStages.inProgress.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-800 shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] text-teal-700 dark:text-teal-400 font-semibold">
                        {mask(apt.appointmentId || `APT-${apt.id}`, 'id')}
                      </span>
                      <Badge variant="inProgress" size="xs">Room 204</Badge>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {mask(apt.patientName || 'Patient', 'name')}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                        <Stethoscope className="w-3 h-3 text-teal-600" />
                        {apt.doctorName || 'Assigned Physician'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700 text-xs">
                      <span className="text-slate-400">Time: {formatTime(apt.appointmentTime)}</span>
                      <button
                        type="button"
                        onClick={() => quickChangeStatus(apt, 'COMPLETED')}
                        className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Complete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Completed Lane */}
          <div className="bg-slate-50/60 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Completed Today</h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {queueStages.completedToday.length}
              </span>
            </div>

            <div className="space-y-3">
              {queueStages.completedToday.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">
                  No completed slots logged today.
                </div>
              ) : (
                queueStages.completedToday.slice(0, 5).map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-1.5 opacity-90"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {mask(apt.patientName || 'Patient', 'name')}
                      </h4>
                      <Badge size="xs" variant="completed">Done</Badge>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Dr. {apt.doctorName} · {formatDate(apt.appointmentDate)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Calendar Schedule View */}
      {viewMode === 'calendar' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-teal-600" />
              <span>7-Day Clinic Consultation Schedule</span>
            </h3>
            <span className="text-xs text-slate-500">
              {appointments.length} total scheduled slots across departments
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {calendarDays.map((day, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col min-h-[220px]"
              >
                <div className="text-center pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    {day.dayName}
                  </span>
                  <span className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                    {day.dayNum} {day.month}
                  </span>
                </div>

                <div className="flex-1 space-y-2 pt-2 overflow-y-auto">
                  {day.slots.length === 0 ? (
                    <div className="text-[10px] text-slate-400 text-center py-6">No slots</div>
                  ) : (
                    day.slots.map((s) => (
                      <div
                        key={s.id}
                        className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] shadow-2xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-mono text-[10px] text-teal-600 dark:text-teal-400">
                          <span>{formatTime(s.appointmentTime)}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                        </div>
                        <p className="font-semibold text-slate-900 dark:text-white truncate">
                          {mask(s.patientName || 'Patient', 'name')}
                        </p>
                        <p className="text-slate-400 truncate text-[10px]">
                          Dr. {s.doctorName || 'Assigned'}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      <Modal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ isOpen: false, appointment: null, newStatus: 'COMPLETED' })}
        title="Update Appointment Status"
        maxWidth="max-w-md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setStatusModal({ isOpen: false, appointment: null, newStatus: 'COMPLETED' })}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleStatusUpdate}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl"
            >
              Confirm Update
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Select a new clinical status for the consultation session with{' '}
            <strong className="text-slate-900 dark:text-white">
              {statusModal.appointment?.patientName || 'this patient'}
            </strong>:
          </p>
          <select
            value={statusModal.newStatus}
            onChange={(e) => setStatusModal((prev) => ({ ...prev, newStatus: e.target.value }))}
            className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2.5"
          >
            <option value="SCHEDULED">Scheduled</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="WAITING">Waiting in Queue</option>
            <option value="IN_PROGRESS">In Progress (Consulting)</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="NO_SHOW">No Show</option>
          </select>
        </div>
      </Modal>

      {/* Cancel / Delete Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, appointment: null, isDeleting: false })}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteModal.isDeleting}
        title="Cancel & Remove Appointment?"
        description={`Are you sure you want to cancel the appointment for ${
          deleteModal.appointment?.patientName || 'this patient'
        } with Dr. ${deleteModal.appointment?.doctorName || 'the physician'} on ${formatDate(
          deleteModal.appointment?.appointmentDate
        )}?`}
        confirmText="Confirm Cancellation"
      />
    </div>
  );
}