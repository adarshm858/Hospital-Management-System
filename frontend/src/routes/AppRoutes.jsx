import { Routes, Route, Navigate } from 'react-router-dom';

// Layout & Protection
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Dashboard
import Dashboard from '../pages/dashboard/Dashboard';

// Patient Module
import PatientList from '../pages/patient/PatientList';
import AddPatient from '../pages/patient/AddPatient';
import PatientProfile from '../pages/patient/PatientProfile';

// Doctor Module
import DoctorList from '../pages/doctor/DoctorList';
import AddDoctor from '../pages/doctor/AddDoctor';

// Appointment Module
import AppointmentList from '../pages/appointment/AppointmentList';
import AddAppointment from '../pages/appointment/AddAppointment';

// Prescription Module
import PrescriptionList from '../pages/prescription/PrescriptionList';
import AddPrescription from '../pages/prescription/AddPrescription';

// Medicine Module
import MedicineList from '../pages/medicine/MedicineList';
import AddMedicine from '../pages/medicine/AddMedicine';

// Laboratory Module
import LabTestList from '../pages/labtest/LabTestList';
import AddLabTest from '../pages/labtest/AddLabTest';
import LabReportList from '../pages/labreport/LabReportList';
import AddLabReport from '../pages/labreport/AddLabReport';

// Billing Module
import BillList from '../pages/bill/BillList';
import AddBill from '../pages/bill/AddBill';

// Settings & Governance
import Settings from '../pages/settings/Settings';
import RolesPermissions from '../pages/settings/RolesPermissions';
import AuditLogs from '../pages/audit/AuditLogs';
import CommandCenter from '../pages/commandcenter/CommandCenter';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Healthcare Dashboard Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Patients */}
        <Route path="patients" element={<PatientList />} />
        <Route path="patients/add" element={<AddPatient />} />
        <Route path="patients/edit/:id" element={<AddPatient />} />
        <Route path="patients/profile/:id" element={<PatientProfile />} />

        {/* Doctors */}
        <Route path="doctors" element={<DoctorList />} />
        <Route path="doctors/add" element={<AddDoctor />} />
        <Route path="doctors/edit/:id" element={<AddDoctor />} />

        {/* Appointments */}
        <Route path="appointments" element={<AppointmentList />} />
        <Route path="appointments/add" element={<AddAppointment />} />
        <Route path="appointments/edit/:id" element={<AddAppointment />} />

        {/* Prescriptions */}
        <Route path="prescriptions" element={<PrescriptionList />} />
        <Route path="prescriptions/add" element={<AddPrescription />} />
        <Route path="prescriptions/edit/:id" element={<AddPrescription />} />

        {/* Medicines */}
        <Route path="medicines" element={<MedicineList />} />
        <Route path="medicines/add" element={<AddMedicine />} />
        <Route path="medicines/edit/:id" element={<AddMedicine />} />

        {/* Lab Tests */}
        <Route path="lab-tests" element={<LabTestList />} />
        <Route path="lab-tests/add" element={<AddLabTest />} />
        <Route path="lab-tests/edit/:id" element={<AddLabTest />} />

        {/* Lab Reports */}
        <Route path="lab-reports" element={<LabReportList />} />
        <Route path="lab-reports/add" element={<AddLabReport />} />
        <Route path="lab-reports/edit/:id" element={<AddLabReport />} />

        {/* Billing */}
        <Route path="bills" element={<BillList />} />
        <Route path="bills/add" element={<AddBill />} />
        <Route path="bills/edit/:id" element={<AddBill />} />

        {/* Command Center */}
        <Route path="command-center" element={<CommandCenter />} />

        {/* Audit Logs */}
        <Route path="audit-logs" element={<AuditLogs />} />

        {/* Settings & Permissions */}
        <Route path="settings" element={<Settings />} />
        <Route path="settings/roles" element={<RolesPermissions />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}