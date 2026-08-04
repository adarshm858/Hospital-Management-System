import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import Dashboard from "../pages/dashboard/Dashboard.jsx";

import PatientList from "../pages/patient/PatientList.jsx";
import AddPatient from "../pages/patient/AddPatient.jsx";
import PatientProfile from "../pages/patient/PatientProfile";

import DoctorList from "../pages/doctor/DoctorList.jsx";
import AddDoctor from "../pages/doctor/AddDoctor.jsx";

import AppointmentList from "../pages/appointment/AppointmentList.jsx";
import AddAppointment from "../pages/appointment/AddAppointment.jsx";

import PrescriptionList from "../pages/prescription/PrescriptionList.jsx";
import AddPrescription from "../pages/prescription/AddPrescription.jsx";

import MedicineList from "../pages/medicine/MedicineList.jsx";
import AddMedicine from "../pages/medicine/AddMedicine.jsx";

import LabTestList from "../pages/labtest/LabTestList.jsx";
import AddLabTest from "../pages/labtest/AddLabTest.jsx";

import LabReportList from "../pages/labreport/LabReportList.jsx";
import AddLabReport from "../pages/labreport/AddLabReport.jsx";

import BillList from "../pages/bill/BillList.jsx";
import AddBill from "../pages/bill/AddBill.jsx";

import Layout from "../components/common/Layout.jsx";


function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>


                <Route
                    path="/login"
                    element={<Login />}
                />


                <Route
                    path="/register"
                    element={<Register />}
                />


                <Route
                    path="/"
                    element={<Layout />}
                >


                    <Route
                        path="dashboard"
                        element={<Dashboard />}
                    />


                    {/* Patient */}

                    <Route
                        path="patients"
                        element={<PatientList />}
                    />

                    <Route
                        path="patients/add"
                        element={<AddPatient />}
                    />

                    <Route
                        path="patients/edit/:id"
                        element={<AddPatient />}
                    />

                    <Route
                        path="patients/profile/:id"
                        element={<PatientProfile />}
                    />



                    {/* Doctor */}

                    <Route
                        path="doctors"
                        element={<DoctorList />}
                    />

                    <Route
                        path="doctors/add"
                        element={<AddDoctor />}
                    />

                    <Route
                        path="doctors/edit/:id"
                        element={<AddDoctor />}
                    />



                    {/* Appointment */}

                    <Route
                        path="appointments"
                        element={<AppointmentList />}
                    />

                    <Route
                        path="appointments/add"
                        element={<AddAppointment />}
                    />

                    <Route
                        path="appointments/edit/:id"
                        element={<AddAppointment />}
                    />



                    {/* Prescription */}

                    <Route
                        path="prescriptions"
                        element={<PrescriptionList />}
                    />

                    <Route
                        path="prescriptions/add"
                        element={<AddPrescription />}
                    />

                    <Route
                        path="prescriptions/edit/:id"
                        element={<AddPrescription />}
                    />



                    {/* Medicine */}

                    <Route
                        path="medicines"
                        element={<MedicineList />}
                    />

                    <Route
                        path="medicines/add"
                        element={<AddMedicine />}
                    />

                    <Route
                        path="medicines/edit/:id"
                        element={<AddMedicine />}
                    />



                    {/* Lab Test */}

                    <Route
                        path="lab-tests"
                        element={<LabTestList />}
                    />

                    <Route
                        path="lab-tests/add"
                        element={<AddLabTest />}
                    />

                    <Route
                        path="lab-tests/edit/:id"
                        element={<AddLabTest />}
                    />



                    {/* Lab Reports */}

                    <Route
                        path="lab-reports"
                        element={<LabReportList />}
                    />

                    <Route
                        path="lab-reports/add"
                        element={<AddLabReport />}
                    />

                    <Route
                        path="lab-reports/edit/:id"
                        element={<AddLabReport />}
                    />



                    {/* Bills */}

                    <Route
                        path="bills"
                        element={<BillList />}
                    />

                    <Route
                        path="bills/add"
                        element={<AddBill />}
                    />

                    <Route
                        path="bills/edit/:id"
                        element={<AddBill />}
                    />


                </Route>


            </Routes>

        </BrowserRouter>

    );

}


export default AppRoutes;