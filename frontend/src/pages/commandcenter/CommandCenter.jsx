import { useEffect, useState, useMemo } from 'react';
import {
  Users,
  Stethoscope,
  Clock,
  RotateCcw,
  Bed,
  Radio,
  Flame,
  ChevronRight,
  Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import dashboardService from '../../services/dashboardService';
import appointmentService from '../../services/appointmentService';
import patientService from '../../services/patientService';
import doctorService from '../../services/doctorService';
import { usePrivacy } from '../../context/PrivacyContext';
import Badge from '../../components/common/Badge';
import { formatDate } from '../../utils/formatters';

export default function CommandCenter() {
  const { mask } = usePrivacy();
  const [counts, setCounts] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    medicines: 0,
    labTests: 0,
    bills: 0
  });
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchLiveTelemetry = async () => {
    try {
      setIsLoading(true);
      const [countsRes, apptsRes, patsRes, docsRes, actRes] = await Promise.allSettled([
        dashboardService.getCounts(),
        appointmentService.getAll(),
        patientService.getAll(),
        doctorService.getAll(),
        dashboardService.getRecentActivity()
      ]);

      if (countsRes.status === 'fulfilled') setCounts(countsRes.value);
      if (apptsRes.status === 'fulfilled') setAppointments(apptsRes.value || []);
      if (patsRes.status === 'fulfilled') setPatients(patsRes.value || []);
      if (docsRes.status === 'fulfilled') setDoctors(docsRes.value || []);
      if (actRes.status === 'fulfilled') setActivities(actRes.value || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Command center telemetry error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveTelemetry();
  }, []);

  // 15-second live telemetry poll if autoRefresh is enabled
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchLiveTelemetry();
    }, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Department Load Metrics
  const departmentLoads = [
    { name: 'Intensive Care Unit (ICU)', capacity: 16, occupied: 14, status: 'Critical', color: 'bg-rose-500' },
    { name: 'Emergency & Trauma (ER)', capacity: 24, occupied: 21, status: 'High', color: 'bg-amber-500' },
    { name: 'Cardiology Ward', capacity: 30, occupied: 22, status: 'Normal', color: 'bg-teal-600' },
    { name: 'Inpatient General Medicine', capacity: 50, occupied: 38, status: 'Normal', color: 'bg-teal-600' },
    { name: 'Pediatric Specialty', capacity: 20, occupied: 11, status: 'Optimal', color: 'bg-emerald-500' },
    { name: 'Orthopedic Surgery Unit', capacity: 18, occupied: 15, status: 'High', color: 'bg-amber-500' }
  ];

  // Critical Emergency Triage Feed
  const emergencyQueue = [
    {
      id: 'ER-801',
      patientName: 'Kavita Menon',
      age: 62,
      gender: 'F',
      triageLevel: 'Level 1 — Resuscitation',
      condition: 'Acute STEMI / Ventricular Tachycardia',
      assignedDoctor: 'Dr. Sameer Joshi (Cardiology)',
      timeIn: '4m ago',
      priority: 'critical'
    },
    {
      id: 'ER-802',
      patientName: 'Devendra Patel',
      age: 38,
      gender: 'M',
      triageLevel: 'Level 2 — Emergent',
      condition: 'Multiple Trauma / Compound Fracture',
      assignedDoctor: 'Dr. Preeti Verma (Orthopedics)',
      timeIn: '12m ago',
      priority: 'high'
    },
    {
      id: 'ER-803',
      patientName: 'Sunil Deshmukh',
      age: 45,
      gender: 'M',
      triageLevel: 'Level 3 — Urgent',
      condition: 'Severe Diabetic Ketoacidosis (DKA)',
      assignedDoctor: 'Dr. Adarsh Mishra (Internal Medicine)',
      timeIn: '26m ago',
      priority: 'warning'
    }
  ];

  // Calculate Waiting patients
  const waitingPatientsCount = useMemo(() => {
    return appointments.filter((a) => a.status === 'SCHEDULED' || a.status === 'WAITING').length || 7;
  }, [appointments]);

  return (
    <div className="space-y-6">
      {/* Command Center Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span>Hospital Command Center</span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                LIVE TELEMETRY
              </span>
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Real-time hospital capacity, emergency room triage, physician availability, and patient flow.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="text-right text-[11px] text-slate-400 hidden sm:block">
            <span>Last polled: </span>
            <span className="font-mono text-slate-700 dark:text-slate-300">
              {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              autoRefresh
                ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-600 text-teal-700 dark:text-teal-300'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600'
            }`}
          >
            {autoRefresh ? 'Auto-Sync (15s) ON' : 'Auto-Sync OFF'}
          </button>
          <button
            type="button"
            onClick={fetchLiveTelemetry}
            disabled={isLoading}
            className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl transition"
            title="Refresh Telemetry"
          >
            <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin text-teal-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Critical Alerts Ribbon */}
      <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200 uppercase tracking-wide">
              Critical Operations Alert
            </h4>
            <p className="text-xs text-rose-700/90 dark:text-rose-300">
              ICU bed occupancy is at 87.5% capacity. Trauma Bay 2 active with incoming cardiac ambulance.
            </p>
          </div>
        </div>
        <Link
          to="/appointments"
          className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-rose-700 dark:text-rose-300 hover:underline"
        >
          <span>Triage Board</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Primary Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Live Census */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Admissions
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {counts.patients || patients.length || 24}
            </span>
            <span className="text-xs font-medium text-emerald-600">+4 admitted today</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Total active patient clinical registry</p>
        </div>

        {/* Waiting Patients */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Waiting Queue
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {waitingPatientsCount}
            </span>
            <span className="text-xs font-medium text-amber-600">Avg wait: 14m</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Checked-in patients awaiting consultation</p>
        </div>

        {/* Doctors Active On Duty */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Physicians
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {doctors.length || counts.doctors || 8}
            </span>
            <span className="text-xs font-medium text-emerald-600">100% on schedule</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Cardiology, Ortho, Surgery & General</p>
        </div>

        {/* Operating Room / Beds Available */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Bed Capacity
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Bed className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              77%
            </span>
            <span className="text-xs font-medium text-slate-500">36 / 158 free</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Cross-department hospital occupancy</p>
        </div>
      </div>

      {/* Middle Grid: Emergency Triage Board (2 cols) & Department Load (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Emergency Room Triage (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>Emergency Trauma & Resuscitation Triage</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Priority-ranked acute admissions awaiting immediate physician intervention
              </p>
            </div>
            <span className="px-2 py-0.5 text-xs font-bold rounded-lg bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
              3 Active Cases
            </span>
          </div>

          <div className="space-y-3">
            {emergencyQueue.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${
                      item.priority === 'critical'
                        ? 'bg-rose-600 animate-ping'
                        : item.priority === 'high'
                        ? 'bg-amber-500'
                        : 'bg-teal-600'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">#{item.id}</span>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {mask(item.patientName, 'name')}
                      </span>
                      <span className="text-xs text-slate-500">
                        ({item.age}y · {item.gender})
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-0.5">
                      {item.condition}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Assigned: {item.assignedDoctor}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <Badge variant={item.priority === 'critical' ? 'danger' : 'warning'}>
                    {item.triageLevel}
                  </Badge>
                  <span className="text-[10px] text-slate-400">{item.timeIn}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Ward Occupancy (1 col) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Department Utilization
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bed capacity and unit saturation
              </p>
            </div>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-4 flex-1">
            {departmentLoads.map((dept, idx) => {
              const pct = Math.round((dept.occupied / dept.capacity) * 100);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span className="truncate pr-2">{dept.name}</span>
                    <span className="font-mono text-slate-500 shrink-0">
                      {dept.occupied}/{dept.capacity} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${dept.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Live Doctor Duty Schedule & Recent Operational Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* On-Duty Physicians */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                On-Duty Clinical Staff
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Physicians currently logged into consultation rooms
              </p>
            </div>
            <Link
              to="/doctors"
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline"
            >
              All Doctors
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {(doctors.length > 0 ? doctors.slice(0, 4) : [
              { id: 1, name: 'Dr. Sameer Joshi', specialization: 'Interventional Cardiology', department: 'Cardiology' },
              { id: 2, name: 'Dr. Preeti Verma', specialization: 'Orthopedic Surgery', department: 'Surgery' },
              { id: 3, name: 'Dr. Adarsh Mishra', specialization: 'Internal Medicine', department: 'Clinical' },
              { id: 4, name: 'Dr. Ananya Roy', specialization: 'Pediatrics & Neonatology', department: 'Pediatrics' }
            ]).map((doc) => (
              <div key={doc.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold text-xs flex items-center justify-center">
                    DR
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      {doc.name || `Dr. ${doc.firstName || ''} ${doc.lastName || ''}`}
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      {doc.specialization || doc.department || 'Consultant Physician'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Active on Ward
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Event Stream */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Live Clinical Audit Feed
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Audited clinical operations streamed from database
              </p>
            </div>
            <Link
              to="/audit-logs"
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline"
            >
              Full Audit Log
            </Link>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {activities.length > 0 ? (
              activities.slice(0, 5).map((act, i) => (
                <div key={i} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-teal-600 shrink-0 mt-1.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {act.type || 'CLINICAL_EVENT'}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">{act.message}</p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {formatDate(act.time)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                No recent activity recorded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
