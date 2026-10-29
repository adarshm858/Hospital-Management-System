import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save
} from 'lucide-react';
import billingService from '../../services/billingService';
import appointmentService from '../../services/appointmentService';
import { useToast } from '../../context/ToastContext';
import { FormInput, FormSelect } from '../../components/common/FormControls';
import ButtonLoader from '../../components/common/ButtonLoader';
import { formatCurrency } from '../../utils/formatters';
import { PAYMENT_METHODS } from '../../constants';

export default function AddBill() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [appointments, setAppointments] = useState([]);

  const [formData, setFormData] = useState({
    appointmentId: '',
    medicineCharge: 0,
    labCharge: 0,
    otherCharge: 0,
    discount: 0,
    paymentMethod: 'CASH',
    paymentStatus: 'PAID'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPrerequisites = async () => {
      try {
        setIsLoading(true);
        const appts = await appointmentService.getAll();
        setAppointments(appts || []);

        if (isEdit) {
          const bill = await billingService.getById(id);
          if (bill) {
            setFormData({
              appointmentId: bill.appointmentId || '',
              medicineCharge: bill.medicineCharge || 0,
              labCharge: bill.labCharge || 0,
              otherCharge: bill.otherCharge || 0,
              discount: bill.discount || 0,
              paymentMethod: bill.paymentMethod || 'CASH',
              paymentStatus: bill.paymentStatus || 'PAID'
            });
            }
        } else if (appts?.length > 0) {
          setFormData((prev) => ({ ...prev, appointmentId: appts[0].id }));
        }
      } catch {
        toast.error('Failed to load billing dependencies.');
      } finally {
        setIsLoading(false);
      }
    };
    loadPrerequisites();
  }, [id, isEdit, toast]);

  const handleAppointmentChange = (e) => {
    const aId = Number(e.target.value);
    setFormData((prev) => ({ ...prev, appointmentId: aId }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Live computed total
  const estimatedTotal = useMemo(() => {
    const med = Number(formData.medicineCharge) || 0;
    const lab = Number(formData.labCharge) || 0;
    const other = Number(formData.otherCharge) || 0;
    const disc = Number(formData.discount) || 0;
    // backend adds doctor consultation fee internally if fetched from appointment
    return Math.max(0, med + lab + other - disc);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.appointmentId) {
      toast.warning('Please select an appointment for billing.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        appointmentId: Number(formData.appointmentId),
        medicineCharge: Number(formData.medicineCharge) || 0,
        labCharge: Number(formData.labCharge) || 0,
        otherCharge: Number(formData.otherCharge) || 0,
        discount: Number(formData.discount) || 0,
        paymentMethod: formData.paymentMethod
      };

      if (isEdit) {
        await billingService.update(id, {
          ...payload,
          paymentStatus: formData.paymentStatus
        });
        toast.success('Invoice updated successfully.');
      } else {
        await billingService.create(payload);
        toast.success('Patient invoice generated and added to ledger.');
      }
      navigate('/bills');
    } catch (err) {
      toast.error(err.message || 'Failed to save billing invoice.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <ButtonLoader size="md" className="text-teal-700" />
        <p className="mt-2 text-sm text-slate-500">Preparing invoice form...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/bills"
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isEdit ? 'Update Billing Invoice' : 'Generate Patient Bill'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calculate clinical fees, drug prescriptions, lab charges, and payment mode.
            </p>
          </div>
        </div>

        <Link
          to="/bills"
          className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 transition"
        >
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          {/* Appointment Picker */}
          {!isEdit && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Select Consultation Appointment <span className="text-rose-500">*</span>
              </label>
              <select
                name="appointmentId"
                value={formData.appointmentId}
                onChange={handleAppointmentChange}
                required
                className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2.5"
              >
                <option value="" disabled>
                  Choose appointment...
                </option>
                {appointments.map((a) => (
                  <option key={a.id} value={a.id}>
                    Slot #{a.appointmentId || a.id} — {a.patientName || `Patient #${a.patientId}`} with Dr. {a.doctorName || 'Doctor'} ({a.appointmentDate})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Charges Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Medicine Charges (INR)"
              name="medicineCharge"
              type="number"
              min="0"
              step="0.01"
              value={formData.medicineCharge}
              onChange={handleChange}
              placeholder="0.00"
            />

            <FormInput
              label="Laboratory Investigation Charges (INR)"
              name="labCharge"
              type="number"
              min="0"
              step="0.01"
              value={formData.labCharge}
              onChange={handleChange}
              placeholder="0.00"
            />

            <FormInput
              label="Other Hospital & Nursing Charges (INR)"
              name="otherCharge"
              type="number"
              min="0"
              step="0.01"
              value={formData.otherCharge}
              onChange={handleChange}
              placeholder="0.00"
            />

            <FormInput
              label="Discount / Concession Amount (INR)"
              name="discount"
              type="number"
              min="0"
              step="0.01"
              value={formData.discount}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>

          {/* Payment Method & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <FormSelect
              label="Payment Method"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              options={PAYMENT_METHODS}
            />

            {isEdit && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Settlement Status
                </label>
                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2.5"
                >
                  <option value="PAID">Paid in Full</option>
                  <option value="PENDING">Pending Settlement</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            )}
          </div>

          {/* Live Subtotal Summary Box */}
          <div className="p-4 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 flex justify-between items-center text-xs">
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                Calculated Additional Services Total:
              </span>
              <span className="text-[11px] text-teal-700 dark:text-teal-400">
                (Physician consultation fee is auto-added from doctor profile upon save)
              </span>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-teal-800 dark:text-teal-300 font-mono">
                {formatCurrency(estimatedTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/bills')}
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
                <span>Generating Invoice...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEdit ? 'Update Invoice' : 'Generate & Issue Invoice'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}