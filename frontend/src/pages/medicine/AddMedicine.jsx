import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    createMedicine,
    getMedicineById,
    updateMedicine
} from "../../api/medicineApi";


function AddMedicine() {


    const navigate = useNavigate();

    const { id } = useParams();



    const [medicine, setMedicine] = useState({

        name: "",
        category: "",
        manufacturer: "",
        description: "",
        quantity: "",
        price: "",
        expiryDate: ""

    });



    useEffect(() => {

        if (id) {

            loadMedicine();

        }

    }, [id]);




    const loadMedicine = async () => {

        try {

            const response = await getMedicineById(id);

            const data = response.data;


            console.log(
                "EDIT MEDICINE DATA:",
                data
            );


            setMedicine({

                name: data.name,

                category: data.category,

                manufacturer: data.manufacturer,

                description: data.description || "",

                quantity: data.stockQuantity,

                price: data.unitPrice,

                expiryDate: data.expiryDate

            });


        } catch (error) {

            console.log(error);

        }

    };




    const handleChange = (e) => {

        setMedicine({

            ...medicine,

            [e.target.name]: e.target.value

        });

    };




    const handleSubmit = async (e) => {

        e.preventDefault();


        try {


            const data = {


                name: medicine.name,

                manufacturer: medicine.manufacturer,

                category: medicine.category,

                description: medicine.description,

                stockQuantity: Number(
                    medicine.quantity
                ),

                unitPrice: Number(
                    medicine.price
                ),

                expiryDate: medicine.expiryDate


            };



            console.log(
                "Medicine Data:",
                data
            );



            if (id) {


                await updateMedicine(
                    id,
                    data
                );


                alert(
                    "Medicine Updated Successfully"
                );


            }
            else {


                await createMedicine(data);


                alert(
                    "Medicine Created Successfully"
                );


            }



            navigate("/medicines");



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

                {id ? "Edit Medicine" : "Add Medicine"}

            </h1>



            <form

                onSubmit={handleSubmit}

                className="grid grid-cols-1 md:grid-cols-2 gap-5"

            >



                <div>

                    <label className="block text-gray-600 mb-1">
                        Medicine Name
                    </label>


                    <input

                        name="name"

                        value={medicine.name}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    />

                </div>




                <div>

                    <label className="block text-gray-600 mb-1">
                        Category
                    </label>


                    <input

                        name="category"

                        value={medicine.category}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    />

                </div>




                <div>

                    <label className="block text-gray-600 mb-1">
                        Manufacturer
                    </label>


                    <input

                        name="manufacturer"

                        value={medicine.manufacturer}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    />

                </div>




                <div>

                    <label className="block text-gray-600 mb-1">
                        Stock Quantity
                    </label>


                    <input

                        type="number"

                        name="quantity"

                        value={medicine.quantity}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    />

                </div>




                <div>

                    <label className="block text-gray-600 mb-1">
                        Unit Price
                    </label>


                    <input

                        type="number"

                        name="price"

                        value={medicine.price}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    />

                </div>




                <div>

                    <label className="block text-gray-600 mb-1">
                        Expiry Date
                    </label>


                    <input

                        type="date"

                        name="expiryDate"

                        value={medicine.expiryDate}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    />

                </div>




                <div className="md:col-span-2">


                    <label className="block text-gray-600 mb-1">
                        Description
                    </label>


                    <textarea

                        name="description"

                        value={medicine.description}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    />


                </div>




                <div className="md:col-span-2 flex gap-4">


                    <button

                        type="submit"

                        className="bg-blue-600 text-white px-6 py-3 rounded-lg"

                    >

                        {id ? "Update Medicine" : "Save Medicine"}

                    </button>



                    <button

                        type="button"

                        onClick={() => navigate("/medicines")}

                        className="bg-gray-500 text-white px-6 py-3 rounded-lg"

                    >

                        Cancel

                    </button>


                </div>


            </form>


        </div>

    );

}


export default AddMedicine;