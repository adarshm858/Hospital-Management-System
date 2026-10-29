import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save
} from 'lucide-react';
import medicineService from '../../services/medicineService';
import { useToast } from '../../context/ToastContext';
import { FormInput, FormSelect, FormTextarea } from '../../components/common/FormControls';
import ButtonLoader from '../../components/common/ButtonLoader';
import { MEDICINE_CATEGORIES } from '../../constants';

export default function AddMedicine() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    category: 'Antibiotics',
    description: '',
    stockQuantity: 100,
    unitPrice: 25.0,
    expiryDate: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchMedicine = async () => {
        try {
          setIsLoading(true);
          const data = await medicineService.getById(id);
          if (data) {
            setFormData({
              name: data.name || '',
              manufacturer: data.manufacturer || '',
              category: data.category || 'Antibiotics',
              description: data.description || '',
              stockQuantity: data.stockQuantity || 0,
              unitPrice: data.unitPrice || 0,
              expiryDate: data.expiryDate || ''
            });
          }
        } catch {
          toast.error('Failed to load medicine details.');
          navigate('/medicines');
        } finally {
          setIsLoading(false);
        }
      };
      fetchMedicine();
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
    if (!formData.name.trim()) errs.name = 'Medicine name is required.';
    if (!formData.manufacturer.trim()) errs.manufacturer = 'Manufacturer name is required.';
    if (!formData.category.trim()) errs.category = 'Category is required.';
    if (formData.stockQuantity === null || formData.stockQuantity === undefined || formData.stockQuantity < 0) {
      errs.stockQuantity = 'Valid stock quantity required.';
    }
    if (formData.unitPrice === null || formData.unitPrice === undefined || formData.unitPrice < 0) {
      errs.unitPrice = 'Valid unit price required.';
    }
    if (!formData.expiryDate) {
      errs.expiryDate = 'Expiry date is required for clinical safety.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.warning('Please review and resolve highlighted errors.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: formData.name,
        manufacturer: formData.manufacturer,
        category: formData.category,
        description: formData.description,
        stockQuantity: Number(formData.stockQuantity),
        unitPrice: Number(formData.unitPrice),
        expiryDate: formData.expiryDate
      };

      if (isEdit) {
        await medicineService.update(id, payload);
        toast.success('Medicine catalog updated successfully.');
      } else {
        await medicineService.create(payload);
        toast.success('New medicine added to pharmacy inventory.');
      }
      navigate('/medicines');
    } catch (err) {
      toast.error(err.message || 'Failed to save medicine.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <ButtonLoader size="md" className="text-teal-700" />
        <p className="mt-2 text-sm text-slate-500">Retrieving pharmaceutical record...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/medicines"
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isEdit ? 'Update Pharmaceutical Record' : 'Catalogue New Medicine'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage drug formulations, pricing, and expiry monitoring.
            </p>
          </div>
        </div>

        <Link
          to="/medicines"
          className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 transition"
        >
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Medicine Commercial Name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Paracetamol 650mg, Augmentin 625 Duo"
              error={errors.name}
            />

            <FormInput
              label="Manufacturer / Pharma Brand"
              name="manufacturer"
              required
              value={formData.manufacturer}
              onChange={handleChange}
              placeholder="e.g. Cipla, Sun Pharma, Pfizer"
              error={errors.manufacturer}
            />

            <FormSelect
              label="Therapeutic Category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              options={MEDICINE_CATEGORIES}
              error={errors.category}
            />

            <FormInput
              label="Expiry Date"
              name="expiryDate"
              type="date"
              required
              value={formData.expiryDate}
              onChange={handleChange}
              error={errors.expiryDate}
            />

            <FormInput
              label="Initial Stock Quantity"
              name="stockQuantity"
              type="number"
              min="0"
              required
              value={formData.stockQuantity}
              onChange={handleChange}
              placeholder="100"
              error={errors.stockQuantity}
            />

            <FormInput
              label="Unit Selling Price (INR)"
              name="unitPrice"
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.unitPrice}
              onChange={handleChange}
              placeholder="25.00"
              error={errors.unitPrice}
            />

            <div className="sm:col-span-2">
              <FormTextarea
                label="Drug Description & Dosage Form"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g. Oral film-coated tablet. Indicated for relief of mild to moderate pain and reduction of fever."
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/medicines')}
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
                <span>Saving to Catalog...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEdit ? 'Update Medicine' : 'Save Medicine'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}