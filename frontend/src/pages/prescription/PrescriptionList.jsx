import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAllPrescriptions,
    deletePrescription
} from "../../api/prescriptionApi";


function PrescriptionList() {


    const navigate = useNavigate();


    const [prescriptions, setPrescriptions] = useState([]);

    const [loading, setLoading] = useState(false);



    const fetchPrescriptions = async () => {

        try {

            setLoading(true);


            const response = await getAllPrescriptions();


            setPrescriptions(response.data);


        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };




    useEffect(() => {

        fetchPrescriptions();

    }, []);





    const handleDelete = async (id) => {


        const confirmDelete = window.confirm(
            "Are you sure you want to delete this prescription?"
        );


        if (!confirmDelete) return;



        try {


            await deletePrescription(id);


            alert("Prescription deleted successfully");


            fetchPrescriptions();



        } catch (error) {


            console.log(error);


            alert("Failed to delete prescription");


        }

    };





    return (

        <div className="bg-white rounded-xl shadow p-6">


            <div className="flex justify-between items-center mb-6">


                <div>

                    <h1 className="text-3xl font-bold text-blue-700">
                        Prescriptions
                    </h1>


                    <p className="text-gray-500">
                        Manage patient prescriptions
                    </p>

                </div>



                <button

                    onClick={() => navigate("/prescriptions/add")}

                    className="
                    bg-blue-600
                    text-white
                    px-5
                    py-2
                    rounded-lg
                    hover:bg-blue-700
                    "

                >

                    + Add Prescription

                </button>


            </div>




            {
                loading ?

                    (

                        <p className="text-center text-gray-500">
                            Loading prescriptions...
                        </p>

                    )

                    :

                    (

                        <div className="overflow-x-auto">


                            <table className="w-full">


                                <thead>

                                    <tr className="bg-blue-600 text-white">


                                        <th className="p-3 text-left">
                                            Prescription ID
                                        </th>


                                        <th className="p-3 text-left">
                                            Patient
                                        </th>


                                        <th className="p-3 text-left">
                                            Doctor
                                        </th>


                                        <th className="p-3 text-left">
                                            Diagnosis
                                        </th>


                                        <th className="p-3 text-left">
                                            Date
                                        </th>


                                        <th className="p-3 text-left">
                                            Action
                                        </th>


                                    </tr>


                                </thead>



                                <tbody>


                                    {
                                        prescriptions.map((prescription) => (


                                            <tr

                                                key={prescription.id}

                                                className="border-b hover:bg-gray-50"

                                            >


                                                <td className="p-3 font-semibold">

                                                    {prescription.prescriptionId}

                                                </td>


                                                <td className="p-3">

                                                    {prescription.patientName}

                                                </td>


                                                <td className="p-3">

                                                    {prescription.doctorName}

                                                </td>


                                                <td className="p-3">

                                                    {prescription.diagnosis}

                                                </td>


                                                <td className="p-3">

                                                    {prescription.date}

                                                </td>



                                                <td className="p-3 flex gap-2">


                                                    <button

                                                        onClick={() =>
                                                            navigate(
                                                                `/prescriptions/edit/${prescription.id}`
                                                            )
                                                        }

                                                        className="
                                                    bg-green-500
                                                    text-white
                                                    px-3
                                                    py-1
                                                    rounded-lg
                                                    "

                                                    >

                                                        Edit

                                                    </button>



                                                    <button

                                                        onClick={() =>
                                                            handleDelete(
                                                                prescription.id
                                                            )
                                                        }

                                                        className="
                                                    bg-red-500
                                                    text-white
                                                    px-3
                                                    py-1
                                                    rounded-lg
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


export default PrescriptionList;