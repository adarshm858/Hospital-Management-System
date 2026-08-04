import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    createLabReport,
    getLabReportById,
    updateLabReport
} from "../../api/labReportApi";

import { getAllPatients } from "../../api/patientApi";
import { getAllDoctors } from "../../api/doctorApi";
import { getAllLabTests } from "../../api/labTestApi";


function AddLabReport() {


    const navigate = useNavigate();

    const { id } = useParams();


    const [patients, setPatients] = useState([]);

    const [doctors, setDoctors] = useState([]);

    const [labTests, setLabTests] = useState([]);



    const [report, setReport] = useState({

        patientId: "",
        doctorId: "",
        labTestId: "",
        result: "",
        remarks: ""

    });




    useEffect(() => {

        loadDropdownData();

        if (id) {

            loadReport();

        }

    }, [id]);




    const loadDropdownData = async () => {

        try {

            const patientsResponse = await getAllPatients();

            const doctorsResponse = await getAllDoctors();

            const testsResponse = await getAllLabTests();


            setPatients(patientsResponse.data);

            setDoctors(doctorsResponse.data);

            setLabTests(testsResponse.data);


        } catch (error) {

            console.log(error);

        }

    };




    const loadReport = async () => {

        try {

            const response = await getLabReportById(id);

            const data = response.data;


            setReport({

                patientId: data.patientId,

                doctorId: data.doctorId,

                labTestId: data.labTestId,

                result: data.result,

                remarks: data.remarks || ""

            });


        } catch (error) {

            console.log(error);

        }

    };




    const handleChange = (e) => {

        setReport({

            ...report,

            [e.target.name]: e.target.value

        });

    };




    const handleSubmit = async (e) => {

        e.preventDefault();


        try {


            const data = {

                patientId: Number(report.patientId),

                doctorId: Number(report.doctorId),

                labTestId: Number(report.labTestId),

                result: report.result,

                remarks: report.remarks

            };



            if (id) {


                await updateLabReport(
                    id,
                    data
                );


                alert(
                    "Lab Report Updated Successfully"
                );


            } else {


                await createLabReport(data);


                alert(
                    "Lab Report Created Successfully"
                );


            }


            navigate("/lab-reports");


        } catch (error) {


            console.log(error);


            alert(
                error.response?.data?.message ||
                "Operation Failed"
            );

        }


    };




    return (

        <div className="bg-white rounded-xl shadow p-8">


            <h1 className="text-3xl font-bold text-blue-700 mb-6">

                {id ? "Edit Lab Report" : "Add Lab Report"}

            </h1>



            <form

                onSubmit={handleSubmit}

                className="grid grid-cols-1 md:grid-cols-2 gap-5"

            >



                <div>

                    <label className="block mb-1 text-gray-600">
                        Patient
                    </label>


                    <select

                        name="patientId"

                        value={report.patientId}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    >

                        <option value="">
                            Select Patient
                        </option>


                        {
                            patients.map(patient => (

                                <option

                                    key={patient.id}

                                    value={patient.id}

                                >

                                    {patient.firstName} {patient.lastName}

                                </option>

                            ))
                        }


                    </select>

                </div>




                <div>

                    <label className="block mb-1 text-gray-600">
                        Doctor
                    </label>


                    <select

                        name="doctorId"

                        value={report.doctorId}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    >

                        <option value="">
                            Select Doctor
                        </option>


                        {
                            doctors.map(doctor => (

                                <option

                                    key={doctor.id}

                                    value={doctor.id}

                                >

                                    Dr. {doctor.firstName} {doctor.lastName}

                                </option>

                            ))
                        }


                    </select>

                </div>




                <div>

                    <label className="block mb-1 text-gray-600">
                        Lab Test
                    </label>


                    <select

                        name="labTestId"

                        value={report.labTestId}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    >

                        <option value="">
                            Select Lab Test
                        </option>


                        {
                            labTests.map(test => (

                                <option

                                    key={test.id}

                                    value={test.id}

                                >

                                    {test.testName}

                                </option>

                            ))
                        }


                    </select>

                </div>




                <div>

                    <label className="block mb-1 text-gray-600">
                        Result
                    </label>


                    <input

                        name="result"

                        value={report.result}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    />

                </div>




                <div className="md:col-span-2">


                    <label className="block mb-1 text-gray-600">
                        Remarks
                    </label>


                    <textarea

                        name="remarks"

                        value={report.remarks}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    />


                </div>




                <div className="md:col-span-2 flex gap-4">


                    <button

                        type="submit"

                        className="bg-blue-600 text-white px-6 py-3 rounded-lg"

                    >

                        {id ? "Update Report" : "Save Report"}

                    </button>



                    <button

                        type="button"

                        onClick={() => navigate("/lab-reports")}

                        className="bg-gray-500 text-white px-6 py-3 rounded-lg"

                    >

                        Cancel

                    </button>


                </div>



            </form>


        </div>

    );

}


export default AddLabReport;