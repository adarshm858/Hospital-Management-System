import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    createAppointment,
    getAppointmentById,
    updateAppointment
} from "../../api/appointmentApi";

import { getAllPatients } from "../../api/patientApi";
import { getAllDoctors } from "../../api/doctorApi";


function AddAppointment() {

    const navigate = useNavigate();

    const { id } = useParams();


    const [patients, setPatients] = useState([]);

    const [doctors, setDoctors] = useState([]);



    const [appointment, setAppointment] = useState({

        patientId: "",
        doctorId: "",
        appointmentDate: "",
        appointmentTime: "",
        reason: "",
        status: "PENDING"

    });



    useEffect(() => {

        const loadData = async () => {

            await loadPatients();

            await loadDoctors();


            if (id) {

                await loadAppointment();

            }

        };


        loadData();


    }, [id]);




    const loadPatients = async () => {

        try {

            const response = await getAllPatients();

            setPatients(response.data);

            return response.data;


        } catch (error) {

            console.log(error);

        }

    };




    const loadDoctors = async () => {

        try {

            const response = await getAllDoctors();

            setDoctors(response.data);

            return response.data;


        } catch (error) {

            console.log(error);

        }

    };




    const loadAppointment = async () => {

        try {

            const response = await getAppointmentById(id);

            const data = response.data;


            console.log("EDIT APPOINTMENT DATA:", data);



            setAppointment({

                patientId: Number(data.patientId),

                doctorId: Number(data.doctorId),

                appointmentDate: data.appointmentDate,

                appointmentTime: data.appointmentTime
                    ? data.appointmentTime.substring(0, 5)
                    : "",

                reason: data.reason,

                status: data.status

            });


        } catch (error) {

            console.log(error);

        }

    };




    const handleChange = (e) => {

        setAppointment({

            ...appointment,

            [e.target.name]: e.target.value

        });

    };




    const handleSubmit = async (e) => {

        e.preventDefault();


        try {


            if (id) {


                await updateAppointment(id, {

                    appointmentDate: appointment.appointmentDate,

                    appointmentTime: appointment.appointmentTime,

                    reason: appointment.reason,

                    status: appointment.status

                });


                alert("Appointment Updated Successfully");


            }
            else {


                await createAppointment({

                    patientId: Number(appointment.patientId),

                    doctorId: Number(appointment.doctorId),

                    appointmentDate: appointment.appointmentDate,

                    appointmentTime: appointment.appointmentTime,

                    reason: appointment.reason

                });


                alert("Appointment Created Successfully");


            }


            navigate("/appointments");


        }
        catch (error) {

            console.log(error);

            alert("Operation Failed");

        }

    };



    return (

        <div className="bg-white rounded-xl shadow p-8">


            <h1 className="text-3xl font-bold text-blue-700 mb-6">

                {id ? "Edit Appointment" : "Add Appointment"}

            </h1>



            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >


                <div>

                    <label>Select Patient</label>

                    <select

                        name="patientId"

                        value={appointment.patientId}

                        onChange={handleChange}

                        disabled={id}

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

                    <label>Select Doctor</label>

                    <select

                        name="doctorId"

                        value={appointment.doctorId}

                        onChange={handleChange}

                        disabled={id}

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

                    <label>Appointment Date</label>

                    <input

                        type="date"

                        name="appointmentDate"

                        value={appointment.appointmentDate}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    />

                </div>




                <div>

                    <label>Appointment Time</label>

                    <input

                        type="time"

                        name="appointmentTime"

                        value={appointment.appointmentTime}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    />

                </div>




                <div className="md:col-span-2">

                    <label>Reason</label>

                    <textarea

                        name="reason"

                        value={appointment.reason}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    />

                </div>




                {
                    id &&

                    <div>

                        <label>Status</label>

                        <select

                            name="status"

                            value={appointment.status}

                            onChange={handleChange}

                            className="w-full border rounded-lg p-3"

                        >

                            <option value="PENDING">
                                Pending
                            </option>

                            <option value="CONFIRMED">
                                Confirmed
                            </option>

                            <option value="COMPLETED">
                                Completed
                            </option>

                            <option value="CANCELLED">
                                Cancelled
                            </option>


                        </select>

                    </div>

                }




                <div className="md:col-span-2 flex gap-4">


                    <button

                        type="submit"

                        className="bg-blue-600 text-white px-6 py-3 rounded-lg"

                    >

                        {id ? "Update Appointment" : "Save Appointment"}

                    </button>



                    <button

                        type="button"

                        onClick={() => navigate("/appointments")}

                        className="bg-gray-500 text-white px-6 py-3 rounded-lg"

                    >

                        Cancel

                    </button>


                </div>


            </form>


        </div>

    );

}


export default AddAppointment;