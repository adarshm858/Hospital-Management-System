import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save
} from 'lucide-react';
import labService from '../../services/labService';
import patientService from '../../services/patientService';
import doctorService from '../../services/doctorService';
import { useToast } from '../../context/ToastContext';
import { FormInput, FormTextarea } from '../../components/common/FormControls';
import ButtonLoader from '../../components/common/ButtonLoader';

export default function AddLabReport() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [labTests, setLabTests] = useState([]);

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    labTestId: '',
    result: '',
    remarks: '',
    status: 'COMPLETED'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDependencies = async () => {
      try {
        setIsLoading(true);
        const [pData, dData, tData] = await Promise.all([
          patientService.getAll(),
          doctorService.getAll(),
          labService.getAllTests()
        ]);
        setPatients(pData || []);
        setDoctors(dData || []);
        setLabTests(tData || []);

        if (isEdit) {
          const report = await labService.getReportById(id);
          if (report) {
            setFormData({
              patientId: report.patientId || '',
              doctorId: report.doctorId || '',
              labTestId: report.labTestId || '',
              result: report.result || '',
              remarks: report.remarks || '',
              status: report.status || 'COMPLETED'
            });
          }
        } else {
          setFormData((prev) => ({
            ...prev,
            patientId: pData?.length > 0 ? pData[0].id : '',
            doctorId: dData?.length > 0 ? dData[0].id : '',
            labTestId: tData?.length > 0 ? tData[0].id : ''
          }));
        }
      } catch {
        toast.error('Failed to load lab reporting dependencies.');
      } finally {
        setIsLoading(false);
      }
    };
    loadDependencies();
  }, [id, isEdit, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.patientId) errs.patientId = 'Please select a patient.';
    if (!formData.doctorId) errs.doctorId = 'Please select an ordering doctor.';
    if (!formData.labTestId) errs.labTestId = 'Please select a diagnostic test.';
    if (!formData.result.trim()) errs.result = 'Observed clinical result is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.warning('Please review and resolve highlighted fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        patientId: Number(formData.patientId),
        doctorId: Number(formData.doctorId),
        labTestId: Number(formData.labTestId),
        result: formData.result,
        remarks: formData.remarks
      };

      if (isEdit) {
        await labService.updateReport(id, {
          result: formData.result,
          remarks: formData.remarks,
          status: formData.status
        });
        toast.success('Lab report updated successfully.');
      } else {
        await labService.createReport(payload);
        toast.success('Lab investigation report uploaded to patient file.');
      }
      navigate('/lab-reports');
    } catch (err) {
      toast.error(err.message || 'Failed to save diagnostic report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <ButtonLoader size="md" className="text-teal-700" />
        <p className="mt-2 text-sm text-slate-500">Preparing report workspace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/lab-reports"
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isEdit ? 'Update Laboratory Finding' : 'Upload Diagnostic Lab Report'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Record specimen results, benchmarks, and clinical impressions.
            </p>
          </div>
        </div>

        <Link
          to="/lab-reports"
          className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 transition"
        >
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          {/* Patient Selector */}
          {!isEdit && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Patient <span className="text-rose-500">*</span>
              </label>
              <select
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                required
                className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2.5"
              >
                <option value="" disabled>
                  Select patient...
                </option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName || ''} ({p.patientId || `PAT-${p.id}`}) — {p.phone}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Doctor Selector */}
          {!isEdit && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Referring Doctor <span className="text-rose-500">*</span>
              </label>
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                required
                className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2.5"
              >
                <option value="" disabled>
                  Select doctor...
                </option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    Dr. {d.firstName} {d.lastName || ''} ({d.specialization})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Test Selector */}
          {!isEdit && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Diagnostic Test Investigation <span className="text-rose-500">*</span>
              </label>
              <select
                name="labTestId"
                value={formData.labTestId}
                onChange={handleChange}
                required
                className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2.5"
              >
                <option value="" disabled>
                  Select investigation...
                </option>
                {labTests.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.testName} ({t.category}) — Tariff: ₹{t.testFee}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Observed Result */}
          <FormInput
            label="Observed Clinical Result / Finding"
            name="result"
            required
            value={formData.result}
            onChange={handleChange}
            placeholder="e.g. Hemoglobin: 14.2 g/dL (Normal: 13.5-17.5 g/dL)"
            error={errors.result}
          />

          {/* Pathologist Remarks */}
          <FormTextarea
            label="Pathologist Impressions & Remarks"
            name="remarks"
            rows={3}
            value={formData.remarks}
            onChange={handleChange}
            placeholder="e.g. Sample processed within valid window. Cellular morphology within standard biological limits."
          />

          {isEdit && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Report Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2.5"
              >
                <option value="COMPLETED">Completed & Verified</option>
                <option value="PENDING">Pending Verification</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/lab-reports')}
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
                <span>Saving Report...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEdit ? 'Update Report' : 'Save Lab Report'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}