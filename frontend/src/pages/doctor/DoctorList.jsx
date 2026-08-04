import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAllDoctors,
    deleteDoctor
} from "../../api/doctorApi";


function DoctorList() {


    const navigate = useNavigate();


    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);



    const fetchDoctors = async () => {

        try {

            setLoading(true);

            const response = await getAllDoctors();

            setDoctors(response.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };



    useEffect(() => {

        fetchDoctors();

    }, []);




    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this doctor?"
        );


        if (!confirmDelete) return;


        try {

            await deleteDoctor(id);

            alert("Doctor deleted successfully");

            fetchDoctors();


        } catch (error) {

            console.log(error);

            alert("Failed to delete doctor");

        }

    };



    return (

        <div className="bg-white rounded-xl shadow p-6">


            <div className="flex justify-between items-center mb-6">

                <div>

                    <h1 className="text-3xl font-bold text-blue-700">
                        Doctors
                    </h1>

                    <p className="text-gray-500">
                        Manage hospital doctors
                    </p>

                </div>


                <button
                    onClick={() => navigate("/doctors/add")}
                    className="
                    bg-blue-600
                    text-white
                    px-5
                    py-2
                    rounded-lg
                    hover:bg-blue-700
                    "
                >
                    + Add Doctor
                </button>


            </div>



            {
                loading ? (

                    <p className="text-center text-gray-500">
                        Loading doctors...
                    </p>

                ) : (


                    <div className="overflow-x-auto">

                        <table className="w-full">


                            <thead>

                                <tr className="bg-blue-600 text-white">


                                    <th className="p-3 text-left">
                                        Doctor ID
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
                                        Specialization
                                    </th>


                                    <th className="p-3 text-left">
                                        Experience
                                    </th>


                                    <th className="p-3 text-left">
                                        Available
                                    </th>


                                    <th className="p-3 text-left">
                                        Action
                                    </th>


                                </tr>

                            </thead>



                            <tbody>


                                {
                                    doctors.map((doctor) => (

                                        <tr
                                            key={doctor.id}
                                            className="border-b hover:bg-gray-50"
                                        >


                                            <td className="p-3 font-semibold">
                                                {doctor.doctorId}
                                            </td>


                                            <td className="p-3">
                                                {doctor.firstName} {doctor.lastName}
                                            </td>


                                            <td className="p-3">
                                                {doctor.email}
                                            </td>


                                            <td className="p-3">
                                                {doctor.phone}
                                            </td>


                                            <td className="p-3">
                                                {doctor.specialization}
                                            </td>


                                            <td className="p-3">
                                                {doctor.experience} Years
                                            </td>


                                            <td className="p-3">
                                                {doctor.available ? "Yes" : "No"}
                                            </td>



                                            <td className="p-3 flex gap-2">


                                                <button
                                                    onClick={() =>
                                                        navigate(`/doctors/edit/${doctor.id}`)
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
                                                        handleDelete(doctor.id)
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


export default DoctorList;