import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAllMedicines,
    deleteMedicine
} from "../../api/medicineApi";


function MedicineList() {


    const navigate = useNavigate();


    const [medicines, setMedicines] = useState([]);



    useEffect(() => {

        loadMedicines();

    }, []);




    const loadMedicines = async () => {

        try {

            const response = await getAllMedicines();

            setMedicines(response.data);


        } catch (error) {

            console.log(error);

        }

    };




    const handleDelete = async (id) => {


        if (!window.confirm("Delete this medicine?")) {

            return;

        }


        try {

            await deleteMedicine(id);

            alert("Medicine deleted successfully");

            loadMedicines();


        } catch (error) {

            console.log(error);

        }

    };




    return (

        <div className="bg-white rounded-xl shadow p-8">


            <div className="flex justify-between items-center mb-6">


                <h1 className="text-3xl font-bold text-blue-700">
                    Medicines
                </h1>



                <button

                    onClick={() => navigate("/medicines/add")}

                    className="
                    bg-blue-600
                    text-white
                    px-5
                    py-3
                    rounded-lg
                    "

                >

                    Add Medicine

                </button>


            </div>




            <div className="overflow-x-auto">


                <table className="w-full border">


                    <thead className="bg-blue-100">

                        <tr>

                            <th className="p-3 border">
                                ID
                            </th>

                            <th className="p-3 border">
                                Name
                            </th>

                            <th className="p-3 border">
                                Category
                            </th>

                            <th className="p-3 border">
                                Manufacturer
                            </th>

                            <th className="p-3 border">
                                Quantity
                            </th>

                            <th className="p-3 border">
                                Price
                            </th>

                            <th className="p-3 border">
                                Expiry
                            </th>

                            <th className="p-3 border">
                                Action
                            </th>

                        </tr>

                    </thead>




                    <tbody>


                        {
                            medicines.map((medicine) => (

                                <tr key={medicine.id}>


                                    <td className="p-3 border">
                                        {medicine.medicineId}
                                    </td>


                                    <td className="p-3 border">
                                        {medicine.name}
                                    </td>


                                    <td className="p-3 border">
                                        {medicine.category}
                                    </td>


                                    <td className="p-3 border">
                                        {medicine.manufacturer}
                                    </td>


                                    <td className="p-3 border">
                                        {medicine.stockQuantity}
                                    </td>


                                    <td className="p-3 border">
                                        ₹ {medicine.unitPrice}
                                    </td>


                                    <td className="p-3 border">
                                        {medicine.expiryDate}
                                    </td>



                                    <td className="p-3 border flex gap-2">


                                        <button

                                            onClick={() =>
                                                navigate(`/medicines/edit/${medicine.id}`)
                                            }

                                            className="
                                            bg-green-600
                                            text-white
                                            px-3
                                            py-1
                                            rounded
                                            "

                                        >

                                            Edit

                                        </button>



                                        <button

                                            onClick={() =>
                                                handleDelete(medicine.id)
                                            }

                                            className="
                                            bg-red-600
                                            text-white
                                            px-3
                                            py-1
                                            rounded
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


        </div>

    );

}


export default MedicineList;