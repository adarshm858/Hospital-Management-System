import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  User,
  UserPlus,
  Search,
  X
} from 'lucide-react';
import appointmentService from '../../services/appointmentService';
import patientService from '../../services/patientService';
import doctorService from '../../services/doctorService';
import { useToast } from '../../context/ToastContext';
import { FormInput, FormTextarea } from '../../components/common/FormControls';
import ButtonLoader from '../../components/common/ButtonLoader';

export default function AddAppointment() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Mode: 'select' (existing registered patient) or 'manual' (enter patient name/phone manually)
  const [patientMode, setPatientMode] = useState('select');
  const [patientSearch, setPatientSearch] = useState('');
  const [manualPatient, setManualPatient] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    gender: 'MALE',
    dateOfBirth: '',
    email: ''
  });
  const [manualErrors, setManualErrors] = useState({});

  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: todayStr,
    appointmentTime: '10:00',
    reason: '',
    status: 'SCHEDULED'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPrerequisites = async () => {
      try {
        setIsLoading(true);
        const [patData, docData] = await Promise.all([
          patientService.getAll(),
          doctorService.getAll()
        ]);
        const patList = patData || [];
        setPatients(patList);
        setDoctors(docData || []);

        if (isEdit) {
          const appt = await appointmentService.getById(id);
          if (appt) {
            setFormData({
              patientId: appt.patientId || '',
              doctorId: appt.doctorId || '',
              appointmentDate: appt.appointmentDate || todayStr,
              appointmentTime: appt.appointmentTime ? appt.appointmentTime.substring(0, 5) : '10:00',
              reason: appt.reason || '',
              status: appt.status || 'SCHEDULED'
            });
          }
        } else if (patList.length > 0 && docData?.length > 0) {
          setFormData((prev) => ({
            ...prev,
            patientId: patList[0].id,
            doctorId: docData[0].id
          }));
        } else if (patList.length === 0) {
          // If no patients exist in system, open manual mode directly
          setPatientMode('manual');
          if (docData?.length > 0) {
            setFormData((prev) => ({ ...prev, doctorId: docData[0].id }));
          }
        }
      } catch {
        toast.error('Failed to load scheduling dependencies.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPrerequisites();
  }, [id, isEdit, todayStr, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleManualChange = (field, value) => {
    setManualPatient((prev) => ({ ...prev, [field]: value }));
    if (manualErrors[field]) {
      setManualErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const switchToManualWithSearch = () => {
    const trimmed = patientSearch.trim();
    if (trimmed) {
      const parts = trimmed.split(' ');
      const fName = parts[0] || '';
      const lName = parts.slice(1).join(' ') || '';
      setManualPatient((prev) => ({
        ...prev,
        firstName: fName,
        lastName: lName
      }));
    }
    setPatientMode('manual');
  };

  const filteredPatients = patients.filter((p) => {
    if (!patientSearch.trim()) return true;
    const term = patientSearch.toLowerCase();
    const fullName = `${p.firstName || ''} ${p.lastName || ''}`.toLowerCase();
    const phone = (p.phone || '').toLowerCase();
    const pid = (p.patientId || '').toLowerCase();
    return fullName.includes(term) || phone.includes(term) || pid.includes(term);
  });

  const validate = () => {
    const errs = {};
    const manualErrs = {};

    if (!isEdit) {
      if (patientMode === 'manual') {
        if (!manualPatient.firstName.trim()) {
          manualErrs.firstName = 'Patient first name is required.';
        }
        if (!manualPatient.phone.trim()) {
          manualErrs.phone = 'Contact phone number is required.';
        } else if (manualPatient.phone.trim().length < 7) {
          manualErrs.phone = 'Please enter a valid phone number (at least 7 digits).';
        }
      } else {
        if (!formData.patientId) {
          errs.patientId = 'Please select a registered patient.';
        }
      }
    }

    if (!formData.doctorId) errs.doctorId = 'Please select an attending doctor.';
    if (!formData.appointmentDate) errs.appointmentDate = 'Appointment date is required.';
    if (!formData.appointmentTime) errs.appointmentTime = 'Consultation time slot is required.';
    if (!formData.reason.trim()) errs.reason = 'Please provide the clinical reason for this consultation.';

    setErrors(errs);
    setManualErrors(manualErrs);
    return Object.keys(errs).length === 0 && Object.keys(manualErrs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.warning('Please complete all required fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      const formattedTime =
        formData.appointmentTime.length === 5
          ? `${formData.appointmentTime}:00`
          : formData.appointmentTime;

      if (isEdit) {
        await appointmentService.update(id, {
          appointmentDate: formData.appointmentDate,
          appointmentTime: formattedTime,
          reason: formData.reason,
          status: formData.status
        });
        toast.success('Appointment rescheduled successfully.');
      } else {
        let finalPatientId = formData.patientId;

        // If manual mode, create patient or link existing phone match
        if (patientMode === 'manual') {
          const trimmedPhone = manualPatient.phone.trim();
          const existingByPhone = patients.find(
            (p) => p.phone && p.phone.trim() === trimmedPhone
          );

          if (existingByPhone) {
            finalPatientId = existingByPhone.id;
            toast.info(`Linked to existing patient: ${existingByPhone.firstName} ${existingByPhone.lastName || ''} (${existingByPhone.patientId || `PAT-${existingByPhone.id}`})`);
          } else {
            const newPatient = await patientService.create({
              firstName: manualPatient.firstName.trim(),
              lastName: manualPatient.lastName?.trim() || undefined,
              phone: trimmedPhone,
              gender: manualPatient.gender || 'MALE',
              dateOfBirth: manualPatient.dateOfBirth || undefined,
              email: manualPatient.email?.trim() || undefined
            });
            finalPatientId = newPatient.id;
            toast.success(`Patient record ${newPatient.patientId || `PAT-${newPatient.id}`} created successfully.`);
          }
        }

        await appointmentService.create({
          patientId: Number(finalPatientId),
          doctorId: Number(formData.doctorId),
          appointmentDate: formData.appointmentDate,
          appointmentTime: formattedTime,
          reason: formData.reason
        });
        toast.success('Consultation slot confirmed and booked successfully.');
      }
      navigate('/appointments');
    } catch (err) {
      toast.error(err.message || 'Failed to save appointment slot.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <ButtonLoader size="md" className="text-teal-700" />
        <p className="mt-2 text-sm text-slate-500">Loading appointment schedule...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/appointments"
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isEdit ? 'Reschedule Appointment' : 'Book Clinical Appointment'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Assign an outpatient or follow-up slot to an attending specialist.
            </p>
          </div>
        </div>

        <Link
          to="/appointments"
          className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 transition"
        >
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          {/* Patient Selection Section */}
          {!isEdit && (
            <div className="space-y-3">
              {/* Header with Mode Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Select Patient <span className="text-rose-500">*</span>
                </label>

                {/* Mode Selector */}
                <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setPatientMode('select')}
                    className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                      patientMode === 'select'
                        ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Registered Patient</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPatientMode('manual')}
                    className={`px-3 py-1 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                      patientMode === 'manual'
                        ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Write Manually</span>
                  </button>
                </div>
              </div>

              {patientMode === 'select' ? (
                <div className="space-y-2">
                  {/* Search / Filter Input */}
                  {patients.length > 5 && (
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={patientSearch}
                        onChange={(e) => setPatientSearch(e.target.value)}
                        placeholder="Search patient by name, MRN (PAT...), or phone..."
                        className="w-full pl-9 pr-8 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                      />
                      {patientSearch && (
                        <button
                          type="button"
                          onClick={() => setPatientSearch('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Patient Dropdown */}
                  <select
                    name="patientId"
                    required={patientMode === 'select'}
                    value={formData.patientId}
                    onChange={(e) => {
                      if (e.target.value === '__manual__') {
                        setPatientMode('manual');
                      } else {
                        handleChange(e);
                      }
                    }}
                    className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 cursor-pointer"
                  >
                    <option value="" disabled>
                      Choose registered patient...
                    </option>
                    <option
                      value="__manual__"
                      className="font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40"
                    >
                      ✍️ Patient name not listed? Write manually...
                    </option>
                    {filteredPatients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.firstName} {p.lastName || ''} ({p.patientId || `PAT-${p.id}`}) — {p.phone}
                      </option>
                    ))}
                  </select>

                  {/* When no match found from search */}
                  {patientSearch && filteredPatients.length === 0 && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 rounded-xl flex items-center justify-between gap-3 text-xs">
                      <span className="text-amber-800 dark:text-amber-200">
                        No patient found matching &ldquo;<strong>{patientSearch}</strong>&rdquo;
                      </span>
                      <button
                        type="button"
                        onClick={switchToManualWithSearch}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition cursor-pointer flex items-center gap-1 shadow-xs shrink-0"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        Write Manually
                      </button>
                    </div>
                  )}

                  {/* Quick Helper Link */}
                  <div className="flex items-center justify-between text-xs px-1 text-slate-500 dark:text-slate-400 pt-0.5">
                    <span>Patient name not showing in the list?</span>
                    <button
                      type="button"
                      onClick={() => setPatientMode('manual')}
                      className="text-teal-700 dark:text-teal-400 font-medium hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Write patient name manually
                    </button>
                  </div>

                  {errors.patientId && (
                    <p className="text-xs text-rose-500 mt-1">{errors.patientId}</p>
                  )}
                </div>
              ) : (
                /* Manual Patient Entry Card */
                <div className="p-4 rounded-xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/40 dark:bg-teal-950/20 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-teal-200/60 dark:border-teal-900/40">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-teal-700 text-white shadow-xs">
                        <UserPlus className="w-4 h-4" />
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                          Manual Patient Details
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Auto-registers a permanent patient record & assigns MRN ID
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPatientMode('select')}
                      className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline font-medium cursor-pointer"
                    >
                      ← Back to list
                    </button>
                  </div>

                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                        First Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh"
                        value={manualPatient.firstName}
                        onChange={(e) => handleManualChange('firstName', e.target.value)}
                        className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                      />
                      {manualErrors.firstName && (
                        <p className="text-[11px] text-rose-500 mt-1">{manualErrors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Kumar"
                        value={manualPatient.lastName}
                        onChange={(e) => handleManualChange('lastName', e.target.value)}
                        className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                      />
                    </div>
                  </div>

                  {/* Phone & Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                        Contact Phone <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={manualPatient.phone}
                        onChange={(e) => handleManualChange('phone', e.target.value)}
                        className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                      />
                      {manualErrors.phone && (
                        <p className="text-[11px] text-rose-500 mt-1">{manualErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                        Gender
                      </label>
                      <div className="grid grid-cols-3 gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        {['MALE', 'FEMALE', 'OTHER'].map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => handleManualChange('gender', g)}
                            className={`py-1.5 text-xs font-semibold rounded-lg transition capitalize cursor-pointer ${
                              manualPatient.gender === g
                                ? 'bg-teal-700 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            {g.toLowerCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* DOB & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                        Date of Birth (Optional)
                      </label>
                      <input
                        type="date"
                        value={manualPatient.dateOfBirth}
                        onChange={(e) => handleManualChange('dateOfBirth', e.target.value)}
                        className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="patient@example.com"
                        value={manualPatient.email}
                        onChange={(e) => handleManualChange('email', e.target.value)}
                        className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Doctor Selection */}
          {!isEdit && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Select Attending Physician <span className="text-rose-500">*</span>
              </label>
              <select
                name="doctorId"
                required
                value={formData.doctorId}
                onChange={handleChange}
                className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
              >
                <option value="" disabled>
                  Choose physician...
                </option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    Dr. {d.firstName} {d.lastName || ''} ({d.specialization}) — Fee: ₹{d.consultationFee}
                  </option>
                ))}
              </select>
              {errors.doctorId && (
                <p className="text-xs text-rose-500 mt-1">{errors.doctorId}</p>
              )}
            </div>
          )}

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Consultation Date"
              name="appointmentDate"
              type="date"
              required
              value={formData.appointmentDate}
              onChange={handleChange}
              error={errors.appointmentDate}
            />

            <FormInput
              label="Time Slot"
              name="appointmentTime"
              type="time"
              required
              value={formData.appointmentTime}
              onChange={handleChange}
              error={errors.appointmentTime}
            />
          </div>

          {/* Clinical Reason */}
          <FormTextarea
            label="Chief Complaint / Reason for Consultation"
            name="reason"
            required
            rows={3}
            value={formData.reason}
            onChange={handleChange}
            placeholder="e.g. High fever, persistent cough for 4 days, routine diabetic checkup"
            error={errors.reason}
          />

          {isEdit && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Appointment Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2.5"
              >
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/appointments')}
            className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition flex items-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <ButtonLoader size="sm" />
                <span>Confirming Slot...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEdit ? 'Update Appointment' : 'Book Appointment'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}