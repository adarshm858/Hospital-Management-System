import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Stethoscope,
  GraduationCap,
  MapPin,
  Save
} from 'lucide-react';
import doctorService from '../../services/doctorService';
import { useToast } from '../../context/ToastContext';
import { FormInput, FormSelect } from '../../components/common/FormControls';
import ButtonLoader from '../../components/common/ButtonLoader';
import { SPECIALIZATIONS, GENDERS } from '../../constants';

export default function AddDoctor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'MALE',
    specialization: 'General Medicine',
    qualification: 'MBBS, MD',
    experience: 5,
    consultationFee: 500,
    address: '',
    city: '',
    state: '',
    country: 'India',
    available: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchDoctor = async () => {
        try {
          setIsLoading(true);
          const data = await doctorService.getById(id);
          if (data) {
            setFormData({
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              email: data.email || '',
              phone: data.phone || '',
              gender: data.gender || 'MALE',
              specialization: data.specialization || 'General Medicine',
              qualification: data.qualification || '',
              experience: data.experience || 0,
              consultationFee: data.consultationFee || 500,
              address: data.address || '',
              city: data.city || '',
              state: data.state || '',
              country: data.country || 'India',
              available: data.available !== false
            });
          }
        } catch {
          toast.error('Failed to load doctor profile for editing.');
          navigate('/doctors');
        } finally {
          setIsLoading(false);
        }
      };
      fetchDoctor();
    }
  }, [id, isEdit, navigate, toast]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required.';
    if (!formData.phone.trim()) errs.phone = 'Contact phone number is required.';
    if (!formData.specialization.trim()) errs.specialization = 'Specialization is required.';
    if (formData.consultationFee === null || formData.consultationFee === undefined || formData.consultationFee < 0) {
      errs.consultationFee = 'Valid consultation fee required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.warning('Please review and resolve the highlighted errors.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        experience: Number(formData.experience) || 0,
        consultationFee: Number(formData.consultationFee) || 0
      };

      if (isEdit) {
        await doctorService.update(id, payload);
        toast.success('Doctor profile updated successfully.');
      } else {
        await doctorService.create(payload);
        toast.success('Doctor registered successfully in MediCare directory.');
      }
      navigate('/doctors');
    } catch (err) {
      toast.error(err.message || 'Failed to save doctor profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <ButtonLoader size="md" className="text-teal-700" />
        <p className="mt-2 text-sm text-slate-500">Retrieving doctor profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/doctors"
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isEdit ? 'Edit Physician Profile' : 'Onboard New Physician'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Register medical staff qualifications, specialties, and fee structures.
            </p>
          </div>
        </div>

        <Link
          to="/doctors"
          className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 transition"
        >
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Personal Details */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800 text-sky-700 dark:text-sky-400 font-semibold text-sm">
            <Stethoscope className="w-4 h-4" />
            <span>1. Doctor Demographics & Contact</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="First Name"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              placeholder="e.g. Ramesh"
              error={errors.firstName}
            />

            <FormInput
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="e.g. Gupta"
            />

            <FormInput
              label="Contact Phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 12345"
              error={errors.phone}
            />

            <FormInput
              label="Official Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="dr.gupta@hospital.org"
            />

            <FormSelect
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={GENDERS.map((g) => ({ value: g.value, label: g.label }))}
            />

            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  className="rounded border-slate-300 text-teal-700 focus:ring-teal-600 w-4 h-4"
                />
                <span>Active on Clinical Duty</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: Professional Details */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800 text-teal-700 dark:text-teal-400 font-semibold text-sm">
            <GraduationCap className="w-4 h-4" />
            <span>2. Professional Credentials & Practice Fee</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              label="Clinical Specialization"
              name="specialization"
              required
              value={formData.specialization}
              onChange={handleChange}
              options={SPECIALIZATIONS}
              error={errors.specialization}
            />

            <FormInput
              label="Qualifications / Degrees"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              placeholder="e.g. MBBS, MD (Cardiology), FACC"
            />

            <FormInput
              label="Years of Experience"
              name="experience"
              type="number"
              min="0"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g. 8"
            />

            <FormInput
              label="Consultation Fee (INR)"
              name="consultationFee"
              type="number"
              min="0"
              required
              value={formData.consultationFee}
              onChange={handleChange}
              placeholder="e.g. 800"
              error={errors.consultationFee}
            />

            <FormSelect
              label="Availability / Duty Status"
              name="available"
              value={formData.available ? 'true' : 'false'}
              onChange={(e) => setFormData((prev) => ({ ...prev, available: e.target.value === 'true' }))}
              options={[
                { value: 'true', label: 'On Duty (Active & Available)' },
                { value: 'false', label: 'On Leave (Unavailable for Slots)' }
              ]}
            />
          </div>
        </div>

        {/* Section 3: Clinic Address */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800 text-indigo-700 dark:text-indigo-400 font-semibold text-sm">
            <MapPin className="w-4 h-4" />
            <span>3. Clinic / Chamber Location</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <FormInput
                label="Department & Room / Chamber"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. OPD Block B, Suite 204"
              />
            </div>

            <FormInput
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Mumbai"
            />

            <FormInput
              label="State / Province"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g. Maharashtra"
            />
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => navigate('/doctors')}
            className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition"
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
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEdit ? 'Update Doctor' : 'Save Doctor Profile'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}