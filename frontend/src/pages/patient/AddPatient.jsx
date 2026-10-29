import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  MapPin,
  Heart,
  PhoneCall,
  Save
} from 'lucide-react';
import patientService from '../../services/patientService';
import { useToast } from '../../context/ToastContext';
import { FormInput, FormSelect, FormTextarea } from '../../components/common/FormControls';
import ButtonLoader from '../../components/common/ButtonLoader';
import { BLOOD_GROUPS, GENDERS } from '../../constants';

export default function AddPatient() {
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
    dateOfBirth: '',
    bloodGroup: 'A+',
    address: '',
    city: '',
    state: '',
    country: 'India',
    emergencyContactName: '',
    emergencyContactPhone: '',
    allergies: '',
    medicalHistory: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchPatient = async () => {
        try {
          setIsLoading(true);
          const data = await patientService.getById(id);
          if (data) {
            setFormData({
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              email: data.email || '',
              phone: data.phone || '',
              gender: data.gender || 'MALE',
              dateOfBirth: data.dateOfBirth || '',
              bloodGroup: data.bloodGroup || 'A+',
              address: data.address || '',
              city: data.city || '',
              state: data.state || '',
              country: data.country || 'India',
              emergencyContactName: data.emergencyContactName || '',
              emergencyContactPhone: data.emergencyContactPhone || '',
              allergies: data.allergies || '',
              medicalHistory: data.medicalHistory || ''
            });
          }
        } catch {
          toast.error('Failed to load patient record for editing.');
          navigate('/patients');
        } finally {
          setIsLoading(false);
        }
      };
      fetchPatient();
    }
  }, [id, isEdit, navigate, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) {
      errs.firstName = 'First name is required.';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Valid contact phone number is required.';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email format.';
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
      if (isEdit) {
        await patientService.update(id, formData);
        toast.success('Patient record updated successfully.');
      } else {
        await patientService.create(formData);
        toast.success('New patient registered successfully into MediCare HMS.');
      }
      navigate('/patients');
    } catch (err) {
      toast.error(err.message || 'Failed to save patient record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <ButtonLoader size="md" className="text-teal-700" />
        <p className="mt-2 text-sm text-slate-500">Retrieving patient record...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/patients"
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isEdit ? 'Edit Patient Information' : 'Register New Patient'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEdit
                ? 'Update patient demographic and medical profile records'
                : 'Create an Electronic Medical Record (EMR) for a new hospital admission'}
            </p>
          </div>
        </div>

        <Link
          to="/patients"
          className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 transition"
        >
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Personal Demographics */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800 text-teal-700 dark:text-teal-400 font-semibold text-sm">
            <User className="w-4 h-4" />
            <span>1. Personal & Contact Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="First Name"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              placeholder="e.g. Adarsh"
              error={errors.firstName}
            />

            <FormInput
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="e.g. Mishra"
            />

            <FormInput
              label="Contact Phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              error={errors.phone}
            />

            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="patient@example.com"
              error={errors.email}
            />

            <FormSelect
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={GENDERS.map((g) => ({ value: g.value, label: g.label }))}
            />

            <FormInput
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Section 2: Address Information */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800 text-teal-700 dark:text-teal-400 font-semibold text-sm">
            <MapPin className="w-4 h-4" />
            <span>2. Residential Address</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <FormInput
                label="Street Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Flat / House No., Street, Landmark"
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

            <FormInput
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="e.g. India"
            />
          </div>
        </div>

        {/* Section 3: Medical & Clinical Information */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800 text-teal-700 dark:text-teal-400 font-semibold text-sm">
            <Heart className="w-4 h-4" />
            <span>3. Clinical & Medical Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FormSelect
                label="Blood Group"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                options={BLOOD_GROUPS}
              />
            </div>

            <div>
              <FormInput
                label="Known Allergies"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="e.g. Penicillin, Peanuts, Sulfa drugs"
                helperText="Specify any drug or environmental allergies"
              />
            </div>

            <div className="sm:col-span-2">
              <FormTextarea
                label="Existing Medical History & Chronic Conditions"
                name="medicalHistory"
                rows={3}
                value={formData.medicalHistory}
                onChange={handleChange}
                placeholder="e.g. Type 2 Diabetes, Hypertension, Previous Cardiac Bypass in 2021"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Emergency Contact */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800 text-teal-700 dark:text-teal-400 font-semibold text-sm">
            <PhoneCall className="w-4 h-4" />
            <span>4. Emergency Contact Person</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Emergency Contact Name"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleChange}
              placeholder="e.g. Sunita Mishra (Spouse / Guardian)"
            />

            <FormInput
              label="Emergency Contact Phone"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleChange}
              placeholder="+91 91234 56789"
            />
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => navigate('/patients')}
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
                <span>Saving Patient Record...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEdit ? 'Update Patient' : 'Save Patient Record'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}