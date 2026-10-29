import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Pill,
  HeartPulse
} from 'lucide-react';
import prescriptionService from '../../services/prescriptionService';
import appointmentService from '../../services/appointmentService';
import medicineService from '../../services/medicineService';
import { useToast } from '../../context/ToastContext';
import { FormInput, FormTextarea } from '../../components/common/FormControls';
import ButtonLoader from '../../components/common/ButtonLoader';

export default function AddPrescription() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [appointments, setAppointments] = useState([]);
  const [availableMedicines, setAvailableMedicines] = useState([]);
  const [appointmentId, setAppointmentId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [instructions, setInstructions] = useState('');
  const [notes, setNotes] = useState('');

  // Dynamic medicine rows
  const [medicineRows, setMedicineRows] = useState([
    { name: '', dosage: '500mg', frequency: '1-0-1', duration: '5 days', instructions: 'After food' }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [appts, meds] = await Promise.all([
          appointmentService.getAll(),
          medicineService.getAll()
        ]);
        setAppointments(appts || []);
        setAvailableMedicines(meds || []);

        if (isEdit) {
          const rx = await prescriptionService.getById(id);
          if (rx) {
            setAppointmentId(rx.appointmentId || '');
            setDiagnosis(rx.diagnosis || '');
            setInstructions(rx.instructions || '');
            setNotes(rx.notes || '');
            setMedicineRows([
              {
                name: rx.medicines || '',
                dosage: rx.dosage || '',
                frequency: 'As directed',
                duration: '5 days',
                instructions: rx.instructions || ''
              }
            ]);
          }
        } else if (appts?.length > 0) {
          setAppointmentId(appts[0].id);
        }
      } catch {
        toast.error('Failed to load prescription requirements.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id, isEdit, toast]);

  const addMedicineRow = () => {
    setMedicineRows((prev) => [
      ...prev,
      { name: '', dosage: '500mg', frequency: '1-0-1', duration: '5 days', instructions: 'After food' }
    ]);
  };

  const removeMedicineRow = (index) => {
    if (medicineRows.length <= 1) return;
    setMedicineRows((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMedicineRow = (index, field, value) => {
    setMedicineRows((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appointmentId) {
      toast.warning('Please associate prescription with an appointment.');
      return;
    }
    if (!diagnosis.trim()) {
      toast.warning('Clinical diagnosis is required.');
      return;
    }

    const validMeds = medicineRows.filter((r) => r.name.trim());
    if (validMeds.length === 0) {
      toast.warning('Please specify at least one medication.');
      return;
    }

    // Format medicines and dosages strings
    const medicinesStr = validMeds
      .map((m) => `${m.name} (${m.dosage}, ${m.frequency} x ${m.duration})`)
      .join(', ');

    const dosageStr = validMeds.map((m) => `${m.name}: ${m.dosage}`).join('; ');

    try {
      setIsSubmitting(true);
      const payload = {
        appointmentId: Number(appointmentId),
        diagnosis,
        medicines: medicinesStr,
        dosage: dosageStr,
        instructions: instructions || 'Follow course instructions closely.',
        notes
      };

      if (isEdit) {
        await prescriptionService.update(id, payload);
        toast.success('Prescription updated.');
      } else {
        await prescriptionService.create(payload);
        toast.success('Prescription registered and signed.');
      }
      navigate('/prescriptions');
    } catch (err) {
      toast.error(err.message || 'Failed to save prescription.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <ButtonLoader size="md" className="text-teal-700" />
        <p className="mt-2 text-sm text-slate-500">Preparing prescription builder...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/prescriptions"
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isEdit ? 'Update Prescription' : 'Digital Prescription Builder'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Formulate medication orders, dosages, and clinical instructions.
            </p>
          </div>
        </div>

        <Link
          to="/prescriptions"
          className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 transition"
        >
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Appointment & Diagnosis */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800 text-teal-700 dark:text-teal-400 font-semibold text-sm">
            <HeartPulse className="w-4 h-4" />
            <span>1. Consultation & Clinical Diagnosis</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Associated Clinical Consultation <span className="text-rose-500">*</span>
              </label>
              <select
                value={appointmentId}
                onChange={(e) => setAppointmentId(e.target.value)}
                required
                className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2.5"
              >
                <option value="" disabled>
                  Select appointment slot...
                </option>
                {appointments.map((a) => (
                  <option key={a.id} value={a.id}>
                    Slot #{a.appointmentId || a.id} — {a.patientName || `Patient #${a.patientId}`} with Dr. {a.doctorName || 'Doctor'} ({a.appointmentDate})
                  </option>
                ))}
              </select>
            </div>

            <FormInput
              label="Primary Diagnosis"
              required
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Acute Bacterial Pharyngitis, Hypertension Stage 1"
            />
          </div>
        </div>

        {/* Dynamic Medications Builder */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5 text-teal-700 dark:text-teal-400 font-semibold text-sm">
              <Pill className="w-4 h-4" />
              <span>2. Prescribed Medications & Dosage Regimen</span>
            </div>
            <button
              type="button"
              onClick={addMedicineRow}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 rounded-xl hover:bg-teal-100 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Medicine</span>
            </button>
          </div>

          <div className="space-y-4">
            {medicineRows.map((row, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
              >
                <div className="sm:col-span-4">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Medicine Name
                  </label>
                  <input
                    type="text"
                    list="hospital-medicines"
                    value={row.name}
                    onChange={(e) => updateMedicineRow(idx, 'name', e.target.value)}
                    placeholder="e.g. Amoxicillin 500mg"
                    className="w-full text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2"
                  />
                  <datalist id="hospital-medicines">
                    {availableMedicines.map((m) => (
                      <option key={m.id} value={m.name} />
                    ))}
                  </datalist>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Dosage
                  </label>
                  <input
                    type="text"
                    value={row.dosage}
                    onChange={(e) => updateMedicineRow(idx, 'dosage', e.target.value)}
                    placeholder="500mg"
                    className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Frequency
                  </label>
                  <select
                    value={row.frequency}
                    onChange={(e) => updateMedicineRow(idx, 'frequency', e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2"
                  >
                    <option value="1-0-1">1-0-1 (BID)</option>
                    <option value="1-1-1">1-1-1 (TID)</option>
                    <option value="1-0-0">1-0-0 (Morning)</option>
                    <option value="0-0-1">0-0-1 (Night)</option>
                    <option value="SOS">SOS (As needed)</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Instructions
                  </label>
                  <input
                    type="text"
                    value={row.instructions}
                    onChange={(e) => updateMedicineRow(idx, 'instructions', e.target.value)}
                    placeholder="After meals with water"
                    className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2"
                  />
                </div>

                <div className="sm:col-span-1 flex justify-end pt-4 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => removeMedicineRow(idx)}
                    disabled={medicineRows.length <= 1}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition disabled:opacity-30"
                    title="Remove medicine"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions & Notes */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <FormTextarea
            label="General Dietary & Lifestyle Advice"
            rows={2}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Drink plenty of warm liquids. Avoid cold foods. Follow up after 5 days if fever persists."
          />

          <FormTextarea
            label="Internal Clinical Notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes visible to medical staff and pharmacists"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/prescriptions')}
            className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border rounded-xl"
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
                <span>Signing Prescription...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEdit ? 'Update Prescription' : 'Issue Prescription'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}