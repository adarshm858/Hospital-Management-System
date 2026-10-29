import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  Users,
  Clock,
  FilePlus,
  FlaskConical,
  Check
} from 'lucide-react';
import { usePrivacy } from '../../context/PrivacyContext';
import { useToast } from '../../context/ToastContext';
import appointmentService from '../../services/appointmentService';
import prescriptionService from '../../services/prescriptionService';
import Badge from '../../components/common/Badge';
import { formatTime, formatDate } from '../../utils/formatters';

export default function DoctorWorkspaceView({ appointments = [], patients: _patients = [], onDataChange }) {
  const { mask } = usePrivacy();
  const toast = useToast();
  const navigate = useNavigate();

  // Active patient in consultation room
  const [currentAppointment, setCurrentAppointment] = useState(() => {
    return appointments.find((a) => a.status === 'SCHEDULED' || a.status === 'WAITING') || appointments[0] || null;
  });

  // Clinical consultation state
  const [vitals, setVitals] = useState({
    bp: '120/80 mmHg',
    pulse: '74 bpm',
    temp: '98.6 °F',
    spo2: '99%'
  });

  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);

  // Filter today's queue
  const waitingQueue = useMemo(() => {
    return appointments.filter((a) => a.status === 'SCHEDULED' || a.status === 'WAITING');
  }, [appointments]);

  const handleSelectPatient = (appt) => {
    setCurrentAppointment(appt);
    setDiagnosis(appt.reason ? `Evaluation for ${appt.reason}` : '');
    toast.info(`Loaded patient into examination room.`);
  };

  const handleCompleteConsultation = async () => {
    if (!currentAppointment) {
      toast.warning('No active patient selected for consultation.');
      return;
    }

    try {
      setIsCompleting(true);
      // 1. Update appointment status to COMPLETED
      await appointmentService.updateStatus(currentAppointment.id, 'COMPLETED');

      // 2. Formulate prescription if diagnosis entered
      if (diagnosis) {
        await prescriptionService.create({
          appointmentId: currentAppointment.id,
          diagnosis: diagnosis,
          medication: 'Prescribed during clinical consultation'
        }).catch(() => null);
      }

      toast.success('Consultation completed and patient record updated.');
      if (onDataChange) onDataChange();
    } catch {
      toast.error('Failed to complete consultation.');
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="bg-linear-to-r from-teal-800 to-teal-900 rounded-2xl p-6 text-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-teal-700/80 text-teal-200">
                CLINICAL WORKSPACE
              </span>
              <span className="text-xs text-teal-200">OPD Examination Room 4</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">Physician Consultation Suite</h2>
            <p className="text-xs text-teal-100/90 mt-0.5">
              Rapid clinical review, electronic chart documentation, vitals triage, and direct prescription formulation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-teal-200 block">Queue Capacity</span>
              <span className="text-lg font-bold">{waitingQueue.length} Waiting</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout: Waiting Queue (1 col) & Active Patient Examination (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Waiting Patient Queue */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                <span>Today's Waiting Queue</span>
              </h3>
              <p className="text-[11px] text-slate-400">Click to call patient to exam desk</p>
            </div>
            <span className="px-2 py-0.5 text-xs font-bold rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300">
              {waitingQueue.length}
            </span>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto max-h-[500px]">
            {waitingQueue.length > 0 ? (
              waitingQueue.map((appt) => {
                const isCurrent = currentAppointment?.id === appt.id;
                return (
                  <button
                    key={appt.id}
                    type="button"
                    onClick={() => handleSelectPatient(appt)}
                    className={`w-full p-3 rounded-xl border text-left transition flex items-start justify-between ${
                      isCurrent
                        ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/30 ring-2 ring-teal-600/20'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-400">#{appt.id}</span>
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {mask(appt.patientName || `Patient #${appt.patientId}`, 'name')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[180px]">
                        {appt.reason || 'General Health Consultation'}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(appt.appointmentTime)}</span>
                      </div>
                    </div>
                    <Badge variant={isCurrent ? 'info' : 'warning'}>
                      {isCurrent ? 'IN EXAM' : 'WAITING'}
                    </Badge>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-12 text-xs text-slate-400">
                No patients currently in waiting queue.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Examination Desk (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {currentAppointment ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-6">
              {/* Patient Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold text-base flex items-center justify-center">
                    PT
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                        {mask(currentAppointment.patientName || `Patient #${currentAppointment.patientId}`, 'name')}
                      </h4>
                      <Badge variant="success">IN EXAMINATION</Badge>
                    </div>
                    <p className="text-xs text-slate-500">
                      Slot #{currentAppointment.id} · Scheduled {formatDate(currentAppointment.appointmentDate)} at {formatTime(currentAppointment.appointmentTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/patients/profile/${currentAppointment.patientId || 1}`}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition"
                  >
                    View Full EMR
                  </Link>
                </div>
              </div>

              {/* Patient Vitals Triage Bar */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Patient Baseline Vitals
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Blood Pressure</span>
                    <input
                      type="text"
                      value={vitals.bp}
                      onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                      className="mt-0.5 w-full font-bold text-sm bg-transparent text-slate-900 dark:text-white outline-hidden"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Heart Rate</span>
                    <input
                      type="text"
                      value={vitals.pulse}
                      onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
                      className="mt-0.5 w-full font-bold text-sm bg-transparent text-slate-900 dark:text-white outline-hidden"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Body Temperature</span>
                    <input
                      type="text"
                      value={vitals.temp}
                      onChange={(e) => setVitals({ ...vitals, temp: e.target.value })}
                      className="mt-0.5 w-full font-bold text-sm bg-transparent text-slate-900 dark:text-white outline-hidden"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">SpO2 Oxygen</span>
                    <input
                      type="text"
                      value={vitals.spo2}
                      onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
                      className="mt-0.5 w-full font-bold text-sm bg-transparent text-slate-900 dark:text-white outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Clinical Assessment & Prescription Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Primary Clinical Diagnosis <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="e.g. Essential Hypertension / Type 2 Diabetes Mellitus"
                    className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-white outline-hidden focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Presenting Symptoms & Clinical Notes
                  </label>
                  <textarea
                    rows={3}
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    placeholder="Document patient history, onset, physical examination findings, and treatment rationale..."
                    className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-white outline-hidden focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                {/* Quick Action Clinical Dispatch */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigate('/prescriptions/add')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition"
                    >
                      <FilePlus className="w-3.5 h-3.5" />
                      <span>Formulate Detailed Rx</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/lab-tests')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition"
                    >
                      <FlaskConical className="w-3.5 h-3.5" />
                      <span>Order Diagnostic Lab Test</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleCompleteConsultation}
                    disabled={isCompleting}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-xs transition"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isCompleting ? 'Finalizing...' : 'Complete Consultation & Sign Off'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
              <Stethoscope className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Examination Room Ready
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Select an appointment from the waiting queue on the left to review chart, record vitals, and conduct clinical consultation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
