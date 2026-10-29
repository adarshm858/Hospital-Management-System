import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save
} from 'lucide-react';
import labService from '../../services/labService';
import { useToast } from '../../context/ToastContext';
import { FormInput, FormSelect, FormTextarea } from '../../components/common/FormControls';
import ButtonLoader from '../../components/common/ButtonLoader';
import { LAB_TEST_CATEGORIES } from '../../constants';

export default function AddLabTest() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    testName: '',
    category: 'Hematology',
    description: '',
    testFee: 450
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchTest = async () => {
        try {
          setIsLoading(true);
          const data = await labService.getTestById(id);
          if (data) {
            setFormData({
              testName: data.testName || '',
              category: data.category || 'Hematology',
              description: data.description || '',
              testFee: data.testFee || 0
            });
          }
        } catch {
          toast.error('Failed to load test details.');
          navigate('/lab-tests');
        } finally {
          setIsLoading(false);
        }
      };
      fetchTest();
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
    if (!formData.testName.trim()) errs.testName = 'Test name is required.';
    if (!formData.category.trim()) errs.category = 'Laboratory category is required.';
    if (formData.testFee === null || formData.testFee === undefined || formData.testFee < 0) {
      errs.testFee = 'Valid test fee required.';
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
        testName: formData.testName,
        category: formData.category,
        description: formData.description,
        testFee: Number(formData.testFee)
      };

      if (isEdit) {
        await labService.updateTest(id, payload);
        toast.success('Lab test updated successfully.');
      } else {
        await labService.createTest(payload);
        toast.success('New laboratory diagnostic test registered.');
      }
      navigate('/lab-tests');
    } catch (err) {
      toast.error(err.message || 'Failed to save laboratory test.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <ButtonLoader size="md" className="text-teal-700" />
        <p className="mt-2 text-sm text-slate-500">Retrieving test definition...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/lab-tests"
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isEdit ? 'Update Diagnostic Investigation' : 'Configure New Lab Test'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Set laboratory benchmarks, clinical descriptions, and billing tariff.
            </p>
          </div>
        </div>

        <Link
          to="/lab-tests"
          className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 transition"
        >
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <FormInput
            label="Diagnostic Test Name"
            name="testName"
            required
            value={formData.testName}
            onChange={handleChange}
            placeholder="e.g. Complete Blood Count (CBC), Serum Ferritin"
            error={errors.testName}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              label="Laboratory Discipline / Category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              options={LAB_TEST_CATEGORIES}
              error={errors.category}
            />

            <FormInput
              label="Test Fee Tariff (INR)"
              name="testFee"
              type="number"
              min="0"
              required
              value={formData.testFee}
              onChange={handleChange}
              placeholder="450"
              error={errors.testFee}
            />
          </div>

          <FormTextarea
            label="Clinical Description & Reference Guidelines"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g. Evaluates overall health and detects a wide range of disorders, including anemia, infection and leukemia."
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/lab-tests')}
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
                <span>Saving Investigation...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEdit ? 'Update Lab Test' : 'Save Lab Test'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}