import { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  Stethoscope,
  CalendarCheck,
  Receipt,
  UserPlus,
  CalendarPlus,
  FilePlus,
  Pill,
  FlaskConical,
  ReceiptText,
  Activity,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Eye,
  Calendar,
  AlertTriangle,
  Radio,
  ShieldCheck
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { usePrivacy } from '../../context/PrivacyContext';
import dashboardService from '../../services/dashboardService';
import appointmentService from '../../services/appointmentService';
import patientService from '../../services/patientService';
import doctorService from '../../services/doctorService';
import medicineService from '../../services/medicineService';
import labService from '../../services/labService';
import { formatCurrency, formatDate, formatTime, getInitials } from '../../utils/formatters';
import Badge from '../../components/common/Badge';
import { CardSkeleton } from '../../components/common/Skeletons';

import DoctorWorkspaceView from './DoctorWorkspaceView';
import ReceptionistDashboardView from './ReceptionistDashboardView';
import PharmacyDashboardView from './PharmacyDashboardView';
import LabDashboardView from './LabDashboardView';

export default function Dashboard() {
  const { user, activeRole, setActiveRole } = useAuth();
  const { isDark } = useTheme();
  const { mask } = usePrivacy();
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    medicines: 0,
    labTests: 0,
    labReports: 0,
    bills: 0,
    revenue: 0
  });

  const [activities, setActivities] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('today');

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [countsData, activityData, apptData, patData, docData, medData, labRepData, labTestData] = await Promise.allSettled([
        dashboardService.getCounts(),
        dashboardService.getRecentActivity(),
        appointmentService.getAll(),
        patientService.getAll(),
        doctorService.getAll(),
        medicineService.getAll(),
        labService.getAllReports(),
        labService.getAllTests()
      ]);

      if (countsData.status === 'fulfilled') setCounts(countsData.value);
      if (activityData.status === 'fulfilled') setActivities(activityData.value || []);
      if (apptData.status === 'fulfilled') setAppointments(apptData.value || []);
      if (patData.status === 'fulfilled') setPatients(patData.value || []);
      if (docData.status === 'fulfilled') setDoctors(docData.value || []);
      if (medData.status === 'fulfilled') setMedicines(medData.value || []);
      if (labRepData.status === 'fulfilled') setLabReports(labRepData.value || []);
      if (labTestData.status === 'fulfilled') setLabTests(labTestData.value || []);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Greeting by hour
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Filter today's appointments
  const todayAppointments = useMemo(() => {
    return appointments.slice(0, 5);
  }, [appointments]);

  // Recent patients
  const recentPatients = useMemo(() => {
    return patients.slice(0, 5);
  }, [patients]);

  // Analytics Sample Datasets
  const weeklyTrends = [
    { day: 'Mon', outpatient: 42, inpatient: 18 },
    { day: 'Tue', outpatient: 58, inpatient: 24 },
    { day: 'Wed', outpatient: 65, inpatient: 30 },
    { day: 'Thu', outpatient: 51, inpatient: 22 },
    { day: 'Fri', outpatient: 74, inpatient: 35 },
    { day: 'Sat', outpatient: 49, inpatient: 28 },
    { day: 'Sun', outpatient: 32, inpatient: 15 }
  ];

  const appointmentStatusData = [
    { name: 'Completed', count: appointments.filter((a) => a.status === 'COMPLETED').length || 24, fill: '#10B981' },
    { name: 'Scheduled', count: appointments.filter((a) => a.status === 'SCHEDULED').length || 18, fill: '#0EA5E9' },
    { name: 'Cancelled', count: appointments.filter((a) => a.status === 'CANCELLED').length || 4, fill: '#F43F5E' }
  ];

  const departmentData = [
    { name: 'Cardiology', value: 32, color: '#0F766E' },
    { name: 'General Medicine', value: 45, color: '#0EA5E9' },
    { name: 'Orthopedics', value: 24, color: '#6366F1' },
    { name: 'Pediatrics', value: 28, color: '#F59E0B' },
    { name: 'Neurology', value: 16, color: '#EC4899' }
  ];

  const monthlyRevenueData = [
    { month: 'May', revenue: 420000 },
    { month: 'Jun', revenue: 530000 },
    { month: 'Jul', revenue: 610000 },
    { month: 'Aug', revenue: 590000 },
    { month: 'Sep', revenue: 680000 },
    { month: 'Oct', revenue: counts.revenue ? Number(counts.revenue) : 740000 }
  ];

  const chartTheme = {
    gridColor: isDark ? '#334155' : '#F1F5F9',
    textColor: isDark ? '#94A3B8' : '#64748B',
    tooltipBg: isDark ? '#1E293B' : '#FFFFFF',
    tooltipBorder: isDark ? '#334155' : '#E2E8F0'
  };

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {greeting}, {user?.fullName || 'Dr. Admin'}
            </h1>
            <span className="hidden sm:inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Here is what is happening across your hospital and clinical operations today.
          </p>
        </div>

        {/* Date Filter & Status */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="text-xs font-medium py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal-600/20"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Role Perspective Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2 px-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Role Perspective:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'ADMIN', label: 'Executive Admin' },
            { id: 'DOCTOR', label: 'Doctor Workspace' },
            { id: 'RECEPTIONIST', label: 'Reception Desk' },
            { id: 'PHARMACIST', label: 'Pharmacy Formulary' },
            { id: 'LAB_TECHNICIAN', label: 'Pathology Lab' }
          ].map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => setActiveRole(role.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeRole === role.id
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      {/* Role Specific Views */}
      {activeRole === 'DOCTOR' ? (
        <DoctorWorkspaceView
          appointments={appointments}
          patients={patients}
          onDataChange={fetchDashboardData}
        />
      ) : activeRole === 'RECEPTIONIST' ? (
        <ReceptionistDashboardView
          appointments={appointments}
          doctors={doctors}
          onDataChange={fetchDashboardData}
        />
      ) : activeRole === 'PHARMACIST' ? (
        <PharmacyDashboardView
          medicines={medicines}
          prescriptions={appointments}
        />
      ) : activeRole === 'LAB_TECHNICIAN' ? (
        <LabDashboardView
          labTests={labTests}
          labReports={labReports}
        />
      ) : (
        /* Executive Admin Dashboard View */
        <>
          {/* Phase 6: 6 KPI Cards */}
          {isLoading ? (
            <CardSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {/* Card 1: Total Patients */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Patients
                    </p>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                      {Number(counts.patients || 0).toLocaleString()}
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-center text-[10px] text-emerald-600 font-semibold">
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                  +12.5% vs last month
                </div>
              </div>

              {/* Card 2: Doctors on Duty */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Doctors
                    </p>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                      {Number(counts.doctors || doctors.length || 0).toLocaleString()}
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 flex items-center justify-center">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>On active duty</span>
                </div>
              </div>

              {/* Card 3: Appointments */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Appointments
                    </p>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                      {Number(counts.appointments || appointments.length || 0).toLocaleString()}
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-teal-600 font-semibold">
                  +{appointments.length} scheduled today
                </div>
              </div>

              {/* Card 4: Total Revenue */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Revenue
                    </p>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1 truncate">
                      {formatCurrency(counts.revenue)}
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                    <Receipt className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-slate-500">
                  {counts.bills || 0} invoices settled
                </div>
              </div>

              {/* Card 5: Pending Bills */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Pending Bills
                    </p>
                    <h3 className="text-lg font-extrabold text-amber-600 mt-1">
                      ₹1,24,500
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-slate-500">
                  12 outstanding ledgers
                </div>
              </div>

              {/* Card 6: Critical Operations Alerts */}
              <Link
                to="/command-center"
                className="bg-rose-50 dark:bg-rose-950/30 p-4 rounded-2xl border border-rose-200 dark:border-rose-900/40 shadow-xs hover:shadow-md transition group block"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                      Telemetry
                    </p>
                    <h3 className="text-xl font-extrabold text-rose-900 dark:text-rose-100 mt-1 flex items-center gap-1.5">
                      <span>3 Live</span>
                      <Radio className="w-3.5 h-3.5 animate-pulse text-rose-600" />
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 text-[10px] text-rose-600 dark:text-rose-400 font-semibold group-hover:underline">
                  Open Command Center →
                </div>
              </Link>
            </div>
          )}

      {/* 13. Quick Clinical Actions */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          Quick Clinical Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <Link
            to="/patients/add"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-600 dark:hover:border-teal-500 hover:bg-teal-50/40 dark:hover:bg-teal-950/20 text-slate-700 dark:text-slate-300 transition group text-center"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <UserPlus className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold">Add Patient</span>
          </Link>

          <Link
            to="/doctors/add"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-600 dark:hover:border-teal-500 hover:bg-teal-50/40 dark:hover:bg-teal-950/20 text-slate-700 dark:text-slate-300 transition group text-center"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Stethoscope className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold">Add Doctor</span>
          </Link>

          <Link
            to="/appointments/add"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-600 dark:hover:border-teal-500 hover:bg-teal-50/40 dark:hover:bg-teal-950/20 text-slate-700 dark:text-slate-300 transition group text-center"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <CalendarPlus className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold">Book Slot</span>
          </Link>

          <Link
            to="/prescriptions/add"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-600 dark:hover:border-teal-500 hover:bg-teal-50/40 dark:hover:bg-teal-950/20 text-slate-700 dark:text-slate-300 transition group text-center"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <FilePlus className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold">Prescription</span>
          </Link>

          <Link
            to="/medicines/add"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-600 dark:hover:border-teal-500 hover:bg-teal-50/40 dark:hover:bg-teal-950/20 text-slate-700 dark:text-slate-300 transition group text-center"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Pill className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold">Add Medicine</span>
          </Link>

          <Link
            to="/lab-tests/add"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-600 dark:hover:border-teal-500 hover:bg-teal-50/40 dark:hover:bg-teal-950/20 text-slate-700 dark:text-slate-300 transition group text-center"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <FlaskConical className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold">Add Lab Test</span>
          </Link>

          <Link
            to="/bills/add"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-600 dark:hover:border-teal-500 hover:bg-teal-50/40 dark:hover:bg-teal-950/20 text-slate-700 dark:text-slate-300 transition group text-center"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <ReceiptText className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold">Generate Bill</span>
          </Link>
        </div>
      </div>

      {/* 10. Dashboard Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Patient Volume Trends */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Patient Volume Overview
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inpatient vs Outpatient weekly admissions
              </p>
            </div>
            <Badge color="teal" size="xs">
              Weekly
            </Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrends}>
                <defs>
                  <linearGradient id="colorOutpatient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F766E" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0F766E" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorInpatient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
                <XAxis dataKey="day" stroke={chartTheme.textColor} fontSize={12} tickLine={false} />
                <YAxis stroke={chartTheme.textColor} fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartTheme.tooltipBg,
                    borderColor: chartTheme.tooltipBorder,
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="outpatient"
                  name="Outpatients"
                  stroke="#0F766E"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorOutpatient)"
                />
                <Area
                  type="monotone"
                  dataKey="inpatient"
                  name="Inpatients"
                  stroke="#0EA5E9"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorInpatient)"
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Appointment Statuses */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Appointment Execution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Completed, scheduled, and cancelled slots
              </p>
            </div>
            <Badge color="blue" size="xs">
              Live Feed
            </Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
                <XAxis dataKey="name" stroke={chartTheme.textColor} fontSize={12} tickLine={false} />
                <YAxis stroke={chartTheme.textColor} fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartTheme.tooltipBg,
                    borderColor: chartTheme.tooltipBorder,
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" name="Appointments" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Department Distribution */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Department Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Patient caseload across medical specialties
              </p>
            </div>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartTheme.tooltipBg,
                    borderColor: chartTheme.tooltipBorder,
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Monthly Revenue */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Revenue Growth
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monthly billed healthcare services
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Target Met
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
                <XAxis dataKey="month" stroke={chartTheme.textColor} fontSize={12} tickLine={false} />
                <YAxis
                  stroke={chartTheme.textColor}
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Revenue']}
                  contentStyle={{
                    backgroundColor: chartTheme.tooltipBg,
                    borderColor: chartTheme.tooltipBorder,
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="revenue" name="Monthly Revenue" fill="#0F766E" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Section: Today's Appointments & Recent Patients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments Table (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Upcoming Appointments
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time patient schedule for today
              </p>
            </div>
            <Link
              to="/appointments"
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold uppercase text-slate-400">
                  <th className="pb-3">Patient</th>
                  <th className="pb-3">Physician</th>
                  <th className="pb-3">Date & Time</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {todayAppointments.length > 0 ? (
                  todayAppointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 font-medium text-slate-800 dark:text-slate-200">
                        {mask(appt.patientName || `Patient #${appt.patientId}`, 'name')}
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">
                        {appt.doctorName || 'Dr. Assigned'}
                      </td>
                      <td className="py-3 text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(appt.appointmentDate)} · {formatTime(appt.appointmentTime)}
                      </td>
                      <td className="py-3">
                        <Badge>{appt.status || 'SCHEDULED'}</Badge>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() => navigate('/appointments')}
                          className="p-1 text-slate-400 hover:text-teal-700 dark:hover:text-teal-400"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-xs text-slate-400">
                      No appointments scheduled yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Hospital Activity Logs (1 col) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Live Audit Logs
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Clinical events & database updates
              </p>
            </div>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>

          <div className="flex-1 overflow-y-auto max-h-80 space-y-3.5 pr-1">
            {activities.length > 0 ? (
              activities.map((act, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-teal-600 shrink-0 mt-1.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {act.type || 'CLINICAL_EVENT'}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                      {act.message}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      {formatDate(act.time)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-xs text-slate-400">
                No recent activity recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Patients Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Patients
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Recently admitted or consulted patient profiles
            </p>
          </div>
          <Link
            to="/patients"
            className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1"
          >
            <span>View all patients</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold uppercase text-slate-400">
                <th className="pb-3">Patient ID</th>
                <th className="pb-3">Patient</th>
                <th className="pb-3">Age / Gender</th>
                <th className="pb-3">Doctor</th>
                <th className="pb-3">Blood Group</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentPatients.length > 0 ? (
                recentPatients.map((pat) => (
                  <tr key={pat.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3 text-xs font-mono font-medium text-slate-500">
                      #{pat.id}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold text-[10px] flex items-center justify-center">
                          {getInitials(pat.name || pat.firstName || 'P')}
                        </div>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {mask(pat.name || `${pat.firstName || ''} ${pat.lastName || ''}`.trim() || 'Patient', 'name')}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-xs text-slate-600 dark:text-slate-400">
                      {pat.age ? `${pat.age} yrs` : 'N/A'} · {pat.gender || 'Unknown'}
                    </td>
                    <td className="py-3 text-xs text-slate-600 dark:text-slate-400">
                      {pat.primaryDoctorName || 'Dr. Assigned'}
                    </td>
                    <td className="py-3">
                      <Badge variant="neutral">{pat.bloodGroup || 'O+'}</Badge>
                    </td>
                    <td className="py-3">
                      <Badge variant="success">Active</Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/patients/profile/${pat.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900/50 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Profile</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-xs text-slate-400">
                    No patients enrolled yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}
    </div>
  );
}