import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAllPatients,
    deletePatient
} from "../../api/patientApi";


function PatientList() {


    const navigate = useNavigate();


    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);



    const fetchPatients = async () => {

        try {

            setLoading(true);

            const response = await getAllPatients();

            setPatients(response.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };



    useEffect(() => {

        fetchPatients();

    }, []);




    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this patient?"
        );


        if (!confirmDelete) return;


        try {

            await deletePatient(id);

            alert("Patient deleted successfully");

            fetchPatients();


        } catch (error) {

            console.log(error);

            alert("Failed to delete patient");

        }

    };



    return (

        <div className="bg-white rounded-xl shadow p-6">


            <div className="flex justify-between items-center mb-6">


                <div>

                    <h1 className="text-3xl font-bold text-blue-700">
                        Patients
                    </h1>

                    <p className="text-gray-500">
                        Manage hospital patients
                    </p>

                </div>



                <button
                    onClick={() => navigate("/patients/add")}
                    className="
                    bg-blue-600
                    text-white
                    px-5
                    py-2
                    rounded-lg
                    hover:bg-blue-700
                    "
                >
                    + Add Patient
                </button>


            </div>



            {
                loading ? (

                    <p className="text-center text-gray-500">
                        Loading patients...
                    </p>

                ) : (


                    <div className="overflow-x-auto">


                        <table className="w-full">


                            <thead>

                                <tr className="bg-blue-600 text-white">


                                    <th className="p-3 text-left">
                                        Patient ID
                                    </th>


                                    <th className="p-3 text-left">
                                        Name
                                    </th>


                                    <th className="p-3 text-left">
                                        Email
                                    </th>


                                    <th className="p-3 text-left">
                                        Phone
                                    </th>


                                    <th className="p-3 text-left">
                                        Gender
                                    </th>


                                    <th className="p-3 text-left">
                                        Blood Group
                                    </th>


                                    <th className="p-3 text-left">
                                        City
                                    </th>


                                    <th className="p-3 text-left">
                                        Action
                                    </th>


                                </tr>

                            </thead>



                            <tbody>


                                {
                                    patients.map((patient) => (


                                        <tr
                                            key={patient.id}
                                            className="border-b hover:bg-gray-50"
                                        >


                                            <td className="p-3 font-semibold">
                                                {patient.patientId}
                                            </td>


                                            <td className="p-3">
                                                {patient.firstName} {patient.lastName}
                                            </td>


                                            <td className="p-3">
                                                {patient.email}
                                            </td>


                                            <td className="p-3">
                                                {patient.phone}
                                            </td>


                                            <td className="p-3">
                                                {patient.gender}
                                            </td>


                                            <td className="p-3">
                                                {patient.bloodGroup}
                                            </td>


                                            <td className="p-3">
                                                {patient.city}
                                            </td>



                                            <td className="p-3 flex gap-2">


                                                <button
                                                    onClick={() =>
                                                        navigate(`/patients/profile/${patient.id}`)
                                                    }
                                                    className="
                                                    bg-blue-500
                                                    text-white
                                                    px-3
                                                    py-1
                                                    rounded-lg
                                                    hover:bg-blue-600
                                                    "
                                                >
                                                    Profile
                                                </button>



                                                <button
                                                    onClick={() =>
                                                        navigate(`/patients/edit/${patient.id}`)
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
                                                        handleDelete(patient.id)
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


export default PatientList;