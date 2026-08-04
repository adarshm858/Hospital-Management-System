import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAllAppointments,
    deleteAppointment
} from "../../api/appointmentApi";


function AppointmentList() {


    const navigate = useNavigate();


    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);



    const fetchAppointments = async () => {

        try {

            setLoading(true);

            const response = await getAllAppointments();

            setAppointments(response.data);


        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };



    useEffect(() => {

        fetchAppointments();

    }, []);




    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this appointment?"
        );


        if (!confirmDelete) return;


        try {

            await deleteAppointment(id);

            alert("Appointment deleted successfully");

            fetchAppointments();


        } catch (error) {

            console.log(error);

            alert("Failed to delete appointment");

        }

    };



    return (

        <div className="bg-white rounded-xl shadow p-6">


            <div className="flex justify-between items-center mb-6">


                <div>

                    <h1 className="text-3xl font-bold text-blue-700">
                        Appointments
                    </h1>

                    <p className="text-gray-500">
                        Manage patient appointments
                    </p>

                </div>



                <button

                    onClick={() => navigate("/appointments/add")}

                    className="
                    bg-blue-600
                    text-white
                    px-5
                    py-2
                    rounded-lg
                    hover:bg-blue-700
                    "

                >

                    + Add Appointment

                </button>


            </div>



            {
                loading ? (

                    <p className="text-center text-gray-500">
                        Loading appointments...
                    </p>

                ) : (


                    <div className="overflow-x-auto">


                        <table className="w-full">


                            <thead>

                                <tr className="bg-blue-600 text-white">


                                    <th className="p-3 text-left">
                                        Appointment ID
                                    </th>


                                    <th className="p-3 text-left">
                                        Patient
                                    </th>


                                    <th className="p-3 text-left">
                                        Doctor
                                    </th>


                                    <th className="p-3 text-left">
                                        Date
                                    </th>


                                    <th className="p-3 text-left">
                                        Time
                                    </th>


                                    <th className="p-3 text-left">
                                        Reason
                                    </th>


                                    <th className="p-3 text-left">
                                        Status
                                    </th>


                                    <th className="p-3 text-left">
                                        Action
                                    </th>


                                </tr>


                            </thead>



                            <tbody>


                                {
                                    appointments.map((appointment) => (


                                        <tr

                                            key={appointment.id}

                                            className="border-b hover:bg-gray-50"

                                        >


                                            <td className="p-3 font-semibold">
                                                {appointment.appointmentId}
                                            </td>


                                            <td className="p-3">
                                                {appointment.patientName}
                                            </td>


                                            <td className="p-3">
                                                {appointment.doctorName}
                                            </td>


                                            <td className="p-3">
                                                {appointment.appointmentDate}
                                            </td>


                                            <td className="p-3">
                                                {appointment.appointmentTime}
                                            </td>


                                            <td className="p-3">
                                                {appointment.reason}
                                            </td>


                                            <td className="p-3">
                                                {appointment.status}
                                            </td>



                                            <td className="p-3 flex gap-2">


                                                <button

                                                    onClick={() =>
                                                        navigate(`/appointments/edit/${appointment.id}`)
                                                    }

                                                    className="
                                                    bg-green-500
                                                    text-white
                                                    px-3
                                                    py-1
                                                    rounded-lg
                                                    hover:bg-green-600
                                                    "

                                                >

                                                    Edit

                                                </button>



                                                <button

                                                    onClick={() =>
                                                        handleDelete(appointment.id)
                                                    }

                                                    className="
                                                    bg-red-500
                                                    text-white
                                                    px-3
                                                    py-1
                                                    rounded-lg
                                                    hover:bg-red-600
                                                    "

                                                >

                                                    Delete

                                                </button>


                                            </td>


                                        </tr>


                                    ))
                                }


                            </tbody>


                        </table>


                    </div>

                )
            }


        </div>

    );

}


export default AppointmentList;