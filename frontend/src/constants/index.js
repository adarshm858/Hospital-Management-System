export const ROLES = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  RECEPTIONIST: 'RECEPTIONIST',
  PATIENT: 'PATIENT'
};

export const GENDERS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' }
];

export const BLOOD_GROUPS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

export const SPECIALIZATIONS = [
  'General Medicine',
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Dermatology',
  'Gynecology',
  'Oncology',
  'Ophthalmology',
  'ENT',
  'Psychiatry',
  'Urology',
  'Radiology',
  'Anesthesiology',
  'Emergency Medicine'
];

export const APPOINTMENT_STATUSES = {
  SCHEDULED: { label: 'Scheduled', color: 'blue' },
  CONFIRMED: { label: 'Confirmed', color: 'teal' },
  COMPLETED: { label: 'Completed', color: 'green' },
  CANCELLED: { label: 'Cancelled', color: 'red' },
  WAITING: { label: 'Waiting', color: 'amber' }
};

export const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Cash' },
  { value: 'CARD', label: 'Credit / Debit Card' },
  { value: 'UPI', label: 'UPI' },
  { value: 'NET_BANKING', label: 'Net Banking' },
  { value: 'INSURANCE', label: 'Insurance' }
];

export const PAYMENT_STATUSES = {
  PAID: { label: 'Paid', color: 'green' },
  PENDING: { label: 'Pending', color: 'amber' },
  CANCELLED: { label: 'Cancelled', color: 'red' }
};

export const REPORT_STATUSES = {
  PENDING: { label: 'Pending', color: 'amber' },
  COMPLETED: { label: 'Completed', color: 'green' },
  CANCELLED: { label: 'Cancelled', color: 'red' }
};

export const MEDICINE_CATEGORIES = [
  'Antibiotics',
  'Analgesics / Pain Relief',
  'Antipyretics',
  'Cardiovascular',
  'Antidiabetic',
  'Respiratory',
  'Gastrointestinal',
  'Vitamins & Supplements',
  'Dermatological',
  'Neurological',
  'Other'
];

export const LAB_TEST_CATEGORIES = [
  'Hematology',
  'Biochemistry',
  'Microbiology',
  'Immunology',
  'Pathology',
  'Radiology',
  'Cardiology',
  'Urine Analysis',
  'General Clinical'
];
