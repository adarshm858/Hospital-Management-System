import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    createPrescription,
    getPrescriptionById,
    updatePrescription
} from "../../api/prescriptionApi";

import { getAllAppointments } from "../../api/appointmentApi";


function AddPrescription() {


    const navigate = useNavigate();

    const { id } = useParams();



    const [appointments, setAppointments] = useState([]);



    const [prescription, setPrescription] = useState({

        appointmentId: "",
        diagnosis: "",
        medicines: "",
        dosage: "",
        instructions: "",
        notes: ""

    });



    useEffect(() => {

        loadAppointments();


        if (id) {

            loadPrescription();

        }


    }, [id]);




    const loadAppointments = async () => {

        try {

            const response = await getAllAppointments();

            setAppointments(response.data);


        } catch (error) {

            console.log(error);

        }

    };




    const loadPrescription = async () => {

        try {


            const response = await getPrescriptionById(id);

            const data = response.data;


            console.log(
                "EDIT PRESCRIPTION DATA:",
                data
            );


            setPrescription({

                appointmentId: data.appointmentId,

                diagnosis: data.diagnosis,

                medicines: data.medicines,

                dosage: data.dosage,

                instructions: data.instructions || "",

                notes: data.notes || ""

            });


        } catch (error) {

            console.log(error);

        }

    };




    const handleChange = (e) => {

        setPrescription({

            ...prescription,

            [e.target.name]: e.target.value

        });

    };




    const handleSubmit = async (e) => {

        e.preventDefault();


        try {


            const data = {


                diagnosis: prescription.diagnosis,

                medicines: prescription.medicines,

                dosage: prescription.dosage,

                instructions: prescription.instructions,

                notes: prescription.notes

            };



            if (id) {


                await updatePrescription(
                    id,
                    data
                );


                alert(
                    "Prescription Updated Successfully"
                );


            }
            else {


                await createPrescription({

                    appointmentId:
                        Number(prescription.appointmentId),

                    ...data

                });


                alert(
                    "Prescription Created Successfully"
                );


            }



            navigate("/prescriptions");



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

                {id ? "Edit Prescription" : "Add Prescription"}

            </h1>



            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >



                <div className="md:col-span-2">

                    <label className="block text-gray-600 mb-1">
                        Select Appointment
                    </label>


                    <select

                        name="appointmentId"

                        value={prescription.appointmentId}

                        onChange={handleChange}

                        disabled={id}

                        className="w-full border rounded-lg p-3"

                    >

                        <option value="">
                            Select Appointment
                        </option>


                        {
                            appointments.map((appointment) => (

                                <option
                                    key={appointment.id}
                                    value={appointment.id}
                                >

                                    {appointment.appointmentId}
                                    {" - "}
                                    {appointment.patientName}
                                    {" - "}
                                    Dr. {appointment.doctorName}

                                </option>

                            ))
                        }


                    </select>


                </div>




                <div>

                    <label className="block text-gray-600 mb-1">
                        Diagnosis
                    </label>

                    <input

                        name="diagnosis"

                        value={prescription.diagnosis}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    />

                </div>




                <div>

                    <label className="block text-gray-600 mb-1">
                        Medicines
                    </label>

                    <input

                        name="medicines"

                        value={prescription.medicines}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    />

                </div>




                <div>

                    <label className="block text-gray-600 mb-1">
                        Dosage
                    </label>

                    <input

                        name="dosage"

                        value={prescription.dosage}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    />

                </div>




                <div>

                    <label className="block text-gray-600 mb-1">
                        Instructions
                    </label>

                    <input

                        name="instructions"

                        value={prescription.instructions}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    />

                </div>




                <div className="md:col-span-2">

                    <label className="block text-gray-600 mb-1">
                        Notes
                    </label>

                    <textarea

                        name="notes"

                        value={prescription.notes}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    />

                </div>




                <div className="md:col-span-2 flex gap-4">


                    <button

                        type="submit"

                        className="bg-blue-600 text-white px-6 py-3 rounded-lg"

                    >

                        {id ? "Update Prescription" : "Save Prescription"}

                    </button>



                    <button

                        type="button"

                        onClick={() => navigate("/prescriptions")}

                        className="bg-gray-500 text-white px-6 py-3 rounded-lg"

                    >

                        Cancel

                    </button>


                </div>


            </form>


        </div>

    );

}


export default AddPrescription;