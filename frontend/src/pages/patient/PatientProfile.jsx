import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


function PatientProfile() {


    const { id } = useParams();

    const [patient, setPatient] = useState(null);



    useEffect(() => {

        loadProfile();

    }, []);



    const loadProfile = async () => {

        try {

            const token = localStorage.getItem("token");


            const response = await axios.get(

                `http://localhost:8080/api/patients/${id}/profile`,

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );


            console.log(
                "PATIENT PROFILE:",
                response.data
            );


            setPatient(response.data);


        } catch (error) {

            console.log(error);

        }

    };



    if (!patient) {

        return (

            <div className="text-center text-gray-500">

                Loading Patient Profile...

            </div>

        );

    }




    return (

        <div className="space-y-6">



            {/* Patient Details */}

            <div className="bg-white rounded-xl shadow p-8">


                <h1 className="text-3xl font-bold text-blue-700 mb-6">

                    Patient Profile

                </h1>



                <div className="grid md:grid-cols-2 gap-6">


                    <div>
                        <b>Name</b>
                        <p>{patient.name}</p>
                    </div>


                    <div>
                        <b>Phone</b>
                        <p>{patient.phone}</p>
                    </div>


                    <div>
                        <b>Email</b>
                        <p>{patient.email}</p>
                    </div>


                    <div>
                        <b>Gender</b>
                        <p>{patient.gender}</p>
                    </div>


                    <div>
                        <b>Age</b>
                        <p>{patient.age ?? "N/A"}</p>
                    </div>


                    <div>
                        <b>Blood Group</b>
                        <p>{patient.bloodGroup}</p>
                    </div>


                    <div className="md:col-span-2">

                        <b>Address</b>

                        <p>
                            {patient.address || "N/A"}
                        </p>

                    </div>


                </div>


            </div>





            {/* Appointment History */}


            <div className="bg-white rounded-xl shadow p-8">


                <div className="flex justify-between mb-5">


                    <h2 className="text-2xl font-bold text-blue-700">

                        Appointment History

                    </h2>


                    <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full">

                        {patient.appointments?.length || 0} Records

                    </span>


                </div>




                {
                    patient.appointments &&
                        patient.appointments.length > 0

                        ?

                        (

                            <div className="overflow-x-auto">


                                <table className="w-full border">


                                    <thead className="bg-blue-600 text-white">


                                        <tr>

                                            <th className="p-3 border">
                                                Appointment ID
                                            </th>

                                            <th className="p-3 border">
                                                Doctor
                                            </th>

                                            <th className="p-3 border">
                                                Date
                                            </th>

                                            <th className="p-3 border">
                                                Time
                                            </th>

                                            <th className="p-3 border">
                                                Status
                                            </th>

                                        </tr>


                                    </thead>



                                    <tbody>


                                        {
                                            patient.appointments.map((appointment) => (


                                                <tr key={appointment.id}>


                                                    <td className="p-3 border">
                                                        {appointment.appointmentId}
                                                    </td>


                                                    <td className="p-3 border">
                                                        Dr. {appointment.doctorName}
                                                    </td>


                                                    <td className="p-3 border">
                                                        {appointment.appointmentDate}
                                                    </td>


                                                    <td className="p-3 border">
                                                        {appointment.appointmentTime}
                                                    </td>


                                                    <td className="p-3 border">
                                                        {appointment.status}
                                                    </td>


                                                </tr>


                                            ))
                                        }


                                    </tbody>


                                </table>


                            </div>

                        )

                        :

                        <p className="text-gray-500">
                            No appointments found
                        </p>

                }


            </div>








            {/* Prescription History */}


            <div className="bg-white rounded-xl shadow p-8">


                <div className="flex justify-between items-center mb-5">


                    <h2 className="text-2xl font-bold text-green-700">

                        Prescription History

                    </h2>



                    <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full">

                        {patient.prescriptions?.length || 0} Records

                    </span>


                </div>





                {
                    patient.prescriptions &&
                        patient.prescriptions.length > 0


                        ?

                        (

                            <div className="overflow-x-auto">


                                <table className="w-full border">


                                    <thead className="bg-green-600 text-white">


                                        <tr>


                                            <th className="p-3 border">
                                                Prescription ID
                                            </th>


                                            <th className="p-3 border">
                                                Doctor
                                            </th>


                                            <th className="p-3 border">
                                                Diagnosis
                                            </th>


                                            <th className="p-3 border">
                                                Medicines
                                            </th>


                                            <th className="p-3 border">
                                                Dosage
                                            </th>


                                            <th className="p-3 border">
                                                Instructions
                                            </th>


                                            <th className="p-3 border">
                                                Date
                                            </th>


                                        </tr>


                                    </thead>




                                    <tbody>


                                        {
                                            patient.prescriptions.map((prescription) => (


                                                <tr
                                                    key={prescription.id}
                                                    className="hover:bg-gray-50"
                                                >



                                                    <td className="p-3 border font-semibold">

                                                        {prescription.prescriptionId}

                                                    </td>



                                                    <td className="p-3 border">

                                                        Dr. {prescription.doctorName}

                                                    </td>




                                                    <td className="p-3 border">

                                                        {prescription.diagnosis}

                                                    </td>




                                                    <td className="p-3 border">

                                                        {prescription.medicines}

                                                    </td>




                                                    <td className="p-3 border">

                                                        {prescription.dosage}

                                                    </td>




                                                    <td className="p-3 border">

                                                        {
                                                            prescription.instructions || "N/A"
                                                        }

                                                    </td>




                                                    <td className="p-3 border">

                                                        {
                                                            prescription.createdAt
                                                                ?
                                                                new Date(
                                                                    prescription.createdAt
                                                                ).toLocaleDateString()
                                                                :
                                                                "N/A"
                                                        }

                                                    </td>




                                                </tr>


                                            ))
                                        }



                                    </tbody>


                                </table>


                            </div>

                        )


                        :

                        <p className="text-gray-500">

                            No prescriptions found

                        </p>

                }



            </div>




        </div>


    );

}


export default PatientProfile;