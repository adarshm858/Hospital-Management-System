import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarPlus,
  FilePlus,
  ReceiptText,
  Edit2,
  Mail,
  Phone,
  Heart,
  AlertTriangle,
  UserCheck,
  Download,
  Activity,
  Sparkles
} from 'lucide-react';
import patientService from '../../services/patientService';
import billingService from '../../services/billingService';
import { usePrivacy } from '../../context/PrivacyContext';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/common/Badge';
import PageLoader from '../../components/common/PageLoader';
import {
  calculateAge,
  formatCurrency,
  formatDate,
  formatTime,
  getInitials
} from '../../utils/formatters';

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { mask } = usePrivacy();

  const [profile, setProfile] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        // Fetch both profile (which has nested arrays) and detailed patient entity
        const [profileRes, detailsRes] = await Promise.allSettled([
          patientService.getProfile(id),
          patientService.getById(id)
        ]);

        if (profileRes.status === 'fulfilled' && profileRes.value) {
          setProfile(profileRes.value);
        }
        if (detailsRes.status === 'fulfilled' && detailsRes.value) {
          setPatientDetails(detailsRes.value);
        }
      } catch {
        toast.error('Failed to load patient EMR record.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [id, toast]);

  const handleDownloadInvoice = async (billId, invoiceNumber) => {
    try {
      toast.info('Generating PDF invoice from hospital server...');
      await billingService.downloadInvoicePdf(billId, invoiceNumber);
      toast.success('Invoice downloaded successfully.');
    } catch {
      toast.error('Unable to download invoice PDF.');
    }
  };

  if (isLoading) {
    return <PageLoader message="Loading Electronic Medical Record..." />;
  }

  // Combine details with Privacy masking
  const rawName =
    profile?.name ||
    (patientDetails ? `${patientDetails.firstName} ${patientDetails.lastName || ''}`.trim() : 'Patient');
  const name = mask(rawName, 'name');
  const rawEmail = profile?.email || patientDetails?.email || '—';
  const email = mask(rawEmail, 'email');
  const rawPhone = profile?.phone || patientDetails?.phone || '—';
  const phone = mask(rawPhone, 'phone');
  const gender = profile?.gender || patientDetails?.gender || '—';
  const bloodGroup = profile?.bloodGroup || patientDetails?.bloodGroup || '—';
  const address = profile?.address || patientDetails?.address || '—';
  const age =
    profile?.age ||
    (patientDetails?.dateOfBirth ? calculateAge(patientDetails.dateOfBirth) : null);
  const patientCode = mask(patientDetails?.patientId || `PAT-${id}`, 'id');

  const appointments = profile?.appointments || [];
  const prescriptions = profile?.prescriptions || [];
  const labReports = profile?.labReports || [];
  const bills = profile?.bills || [];

  const tabs = [
    { id: 'overview', label: 'Clinical Overview', count: null },
    { id: 'timeline', label: 'Medical Timeline', count: null },
    { id: 'appointments', label: 'Appointments', count: appointments.length },
    { id: 'prescriptions', label: 'Prescriptions', count: prescriptions.length },
    { id: 'laboratory', label: 'Lab Reports', count: labReports.length },
    { id: 'billing', label: 'Billing Invoices', count: bills.length }
  ];

  return (
    <div className="space-y-6">
      {/* Top Navigation & Back */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/patients')}
          className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-xs uppercase font-semibold tracking-wider text-teal-700 dark:text-teal-400">
            Electronic Medical Record (EMR)
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Patient Profile</h2>
        </div>
      </div>

      {/* Hero EMR Banner Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-teal-800 to-teal-600 text-white font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-md shadow-teal-900/20">
              {getInitials(patientDetails?.firstName || name, patientDetails?.lastName || '')}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {name}
                </h1>
                <span className="font-mono text-xs font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
                  {patientCode}
                </span>
                <Badge variant="bloodGroup">{bloodGroup}</Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                {age !== null && (
                  <span>
                    <strong className="text-slate-700 dark:text-slate-300">{age}</strong> years old
                  </span>
                )}
                <span>·</span>
                <span className="capitalize">{gender?.toLowerCase()}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {phone}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {email}
                </span>
              </div>
            </div>
          </div>

          {/* Quick EMR Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/patients/edit/${id}`}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Record</span>
            </Link>

            <Link
              to="/appointments/add"
              className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Book Slot</span>
            </Link>

            <Link
              to="/prescriptions/add"
              className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>Prescribe</span>
            </Link>

            <Link
              to="/bills/add"
              className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <ReceiptText className="w-3.5 h-3.5" />
              <span>Generate Bill</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-3">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto pb-1" aria-label="Tabs">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-teal-200/60 dark:bg-teal-900 text-teal-800 dark:text-teal-200'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Panels */}
      {/* 1. Clinical Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card: AI Clinical Assistant (Phase 26 AI-Ready Architecture) */}
          <div className="lg:col-span-2 rounded-2xl p-5 border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/70 via-teal-50/40 to-slate-50 dark:from-indigo-950/30 dark:via-teal-950/20 dark:to-slate-900 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-indigo-100 dark:border-indigo-900/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>AI Clinical Summary & Chart Insights</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      EMR AI-Ready v2.0
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Automated chart synthesis from visits, active medications, and diagnostic panels
                  </p>
                </div>
              </div>
              <div className="text-[10px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 px-2.5 py-1 rounded-lg">
                ⚠️ AI Decision Support · Physician Verification Required
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Care Continuity</span>
                <p className="text-slate-800 dark:text-slate-200 font-medium mt-1">
                  {appointments.length > 0 ? `${appointments.length} recorded consultations on file.` : 'New admission, initial intake evaluation pending.'}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Medication Regimen</span>
                <p className="text-slate-800 dark:text-slate-200 font-medium mt-1">
                  {prescriptions.length > 0 ? `${prescriptions.length} active prescription orders recorded.` : 'No current prescription drug interactions flagged.'}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Diagnostic Status</span>
                <p className="text-slate-800 dark:text-slate-200 font-medium mt-1">
                  {labReports.length > 0 ? `${labReports.length} diagnostic laboratory reports finalized.` : 'Baseline clinical blood panels suggested upon consultation.'}
                </p>
              </div>
            </div>
          </div>

          {/* Card: Demographics & Contact */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-teal-600" />
              Contact & Residential Details
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-1.5 border-b border-slate-50 dark:border-slate-800/60">
                <span className="text-slate-500">Full Name</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50 dark:border-slate-800/60">
                <span className="text-slate-500">Phone</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{phone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50 dark:border-slate-800/60">
                <span className="text-slate-500">Email Address</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50 dark:border-slate-800/60">
                <span className="text-slate-500">Address</span>
                <span className="text-right font-medium text-slate-800 dark:text-slate-200 max-w-xs">{address}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">City / Country</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {patientDetails?.city || '—'}, {patientDetails?.country || 'India'}
                </span>
              </div>
            </div>
          </div>

          {/* Card: Emergency Contact */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Phone className="w-4 h-4 text-sky-600" />
              Emergency Contact Person
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-1.5 border-b border-slate-50 dark:border-slate-800/60">
                <span className="text-slate-500">Contact Name</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {patientDetails?.emergencyContactName || 'Not recorded'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50 dark:border-slate-800/60">
                <span className="text-slate-500">Contact Phone</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  {patientDetails?.emergencyContactPhone || 'Not recorded'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Relation</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">Next of Kin / Guardian</span>
              </div>
            </div>
          </div>

          {/* Card: Allergies & Alerts */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Known Medical Allergies
            </h3>
            <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs sm:text-sm text-rose-900 dark:text-rose-200">
              {patientDetails?.allergies || 'No known clinical allergies recorded.'}
            </div>
          </div>

          {/* Card: Medical History */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Heart className="w-4 h-4 text-teal-600" />
              Chronic Conditions & Medical History
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {patientDetails?.medicalHistory || 'No pre-existing chronic conditions noted in EMR.'}
            </div>
          </div>
        </div>
      )}

      {/* 2. Medical Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            Patient Clinical Progression & Timeline
          </h3>

          <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-8 pb-4">
            {appointments.map((appt, i) => (
              <div key={`appt-${i}`} className="relative pl-6">
                <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-sky-500 border-4 border-white dark:border-slate-900" />
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                      Appointment Consultation
                    </span>
                    <span>{formatDate(appt.appointmentDate)} · {formatTime(appt.appointmentTime)}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Attending: {appt.doctorName || 'Assigned Physician'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Reason: {appt.reason || 'General clinical consultation'}
                  </p>
                  <div className="mt-2">
                    <Badge size="xs">{appt.status || 'SCHEDULED'}</Badge>
                  </div>
                </div>
              </div>
            ))}

            {prescriptions.map((rx, i) => (
              <div key={`rx-${i}`} className="relative pl-6">
                <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-purple-500 border-4 border-white dark:border-slate-900" />
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                      Prescription Issued
                    </span>
                    <span>{formatDate(rx.createdAt)}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Diagnosis: {rx.diagnosis || 'Clinical Diagnosis'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-mono">
                    Rx: {rx.medicines} — {rx.dosage}
                  </p>
                  {rx.instructions && (
                    <p className="text-xs text-slate-500 mt-0.5">Instructions: {rx.instructions}</p>
                  )}
                </div>
              </div>
            ))}

            {labReports.map((lab, i) => (
              <div key={`lab-${i}`} className="relative pl-6">
                <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-amber-500 border-4 border-white dark:border-slate-900" />
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                      Laboratory Diagnostic
                    </span>
                    <span>{formatDate(lab.reportDate || lab.createdAt)}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Test: {lab.labTestName || 'Diagnostic Specimen'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Result: <strong className="text-slate-900 dark:text-white">{lab.result}</strong>
                  </p>
                  <div className="mt-2">
                    <Badge size="xs">{lab.status || 'COMPLETED'}</Badge>
                  </div>
                </div>
              </div>
            ))}

            {appointments.length === 0 && prescriptions.length === 0 && labReports.length === 0 && (
              <div className="pl-6 text-xs text-slate-400">
                No clinical history recorded yet for this patient.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Appointments Tab */}
      {activeTab === 'appointments' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Scheduled & Past Appointments
            </h3>
            <Link
              to="/appointments/add"
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline"
            >
              + Book New Appointment
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold uppercase text-slate-400">
                  <th className="pb-3">Slot ID</th>
                  <th className="pb-3">Attending Physician</th>
                  <th className="pb-3">Date & Time</th>
                  <th className="pb-3">Reason</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {appointments.length > 0 ? (
                  appointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 font-mono text-xs font-semibold text-teal-700 dark:text-teal-400">
                        {appt.appointmentId || `APT-${appt.id}`}
                      </td>
                      <td className="py-3 font-medium text-slate-800 dark:text-slate-200">
                        {appt.doctorName || 'Dr. Assigned'}
                      </td>
                      <td className="py-3 text-xs text-slate-500">
                        {formatDate(appt.appointmentDate)} · {formatTime(appt.appointmentTime)}
                      </td>
                      <td className="py-3 text-xs text-slate-600 dark:text-slate-300">
                        {appt.reason || '—'}
                      </td>
                      <td className="py-3 text-right">
                        <Badge size="xs">{appt.status || 'SCHEDULED'}</Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-slate-400">
                      No appointments registered for this patient.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Prescriptions Tab */}
      {activeTab === 'prescriptions' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Medication Prescriptions
            </h3>
            <Link
              to="/prescriptions/add"
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline"
            >
              + Create Prescription
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold uppercase text-slate-400">
                  <th className="pb-3">Rx ID</th>
                  <th className="pb-3">Diagnosis</th>
                  <th className="pb-3">Medicines & Dosage</th>
                  <th className="pb-3">Instructions</th>
                  <th className="pb-3 text-right">Date Issued</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {prescriptions.length > 0 ? (
                  prescriptions.map((rx) => (
                    <tr key={rx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 font-mono text-xs font-semibold text-teal-700 dark:text-teal-400">
                        {rx.prescriptionId || `RX-${rx.id}`}
                      </td>
                      <td className="py-3 font-medium text-slate-800 dark:text-slate-200">
                        {rx.diagnosis}
                      </td>
                      <td className="py-3 text-xs text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">{rx.medicines}</span>
                        {rx.dosage && <span className="text-slate-400 ml-1.5">({rx.dosage})</span>}
                      </td>
                      <td className="py-3 text-xs text-slate-500 max-w-xs truncate">
                        {rx.instructions || '—'}
                      </td>
                      <td className="py-3 text-xs text-slate-400 text-right">
                        {formatDate(rx.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-slate-400">
                      No prescriptions on file for this patient.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Laboratory Tab */}
      {activeTab === 'laboratory' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Laboratory & Diagnostic Results
            </h3>
            <Link
              to="/lab-reports/add"
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline"
            >
              + Add Diagnostic Report
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold uppercase text-slate-400">
                  <th className="pb-3">Report ID</th>
                  <th className="pb-3">Diagnostic Test</th>
                  <th className="pb-3">Doctor</th>
                  <th className="pb-3">Observed Result</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {labReports.length > 0 ? (
                  labReports.map((lab) => (
                    <tr key={lab.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 font-mono text-xs font-semibold text-teal-700 dark:text-teal-400">
                        {lab.reportId || `LAB-${lab.id}`}
                      </td>
                      <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">
                        {lab.labTestName || 'Lab Investigation'}
                      </td>
                      <td className="py-3 text-xs text-slate-600 dark:text-slate-300">
                        {lab.doctorName || '—'}
                      </td>
                      <td className="py-3 text-xs font-medium text-slate-900 dark:text-white">
                        {lab.result}
                      </td>
                      <td className="py-3">
                        <Badge size="xs">{lab.status || 'COMPLETED'}</Badge>
                      </td>
                      <td className="py-3 text-xs text-slate-400 text-right">
                        {formatDate(lab.reportDate || lab.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                      No laboratory reports recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Billing Tab */}
      {activeTab === 'billing' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Patient Invoices & Settlements
            </h3>
            <Link
              to="/bills/add"
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline"
            >
              + Create Invoice
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold uppercase text-slate-400">
                  <th className="pb-3">Invoice #</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Payment Method</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">PDF Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bills.length > 0 ? (
                  bills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 font-mono text-xs font-semibold text-teal-700 dark:text-teal-400">
                        {bill.billId || `INV-${bill.id}`}
                      </td>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">
                        {formatCurrency(bill.totalAmount)}
                      </td>
                      <td className="py-3 text-xs text-slate-600 dark:text-slate-300">
                        {bill.paymentMethod || 'CASH'}
                      </td>
                      <td className="py-3">
                        <Badge size="xs">{bill.paymentStatus || 'PAID'}</Badge>
                      </td>
                      <td className="py-3 text-xs text-slate-400">
                        {formatDate(bill.createdAt)}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDownloadInvoice(bill.id, bill.billId)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 rounded-lg hover:bg-teal-100 transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                      No billing invoices recorded for this patient.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}