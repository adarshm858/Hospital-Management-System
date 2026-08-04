import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    createBill,
    getBillById,
    updateBill
} from "../../api/billApi";

import { getAllAppointments } from "../../api/appointmentApi";


function AddBill() {


    const navigate = useNavigate();

    const { id } = useParams();


    const [appointments, setAppointments] = useState([]);



    const [bill, setBill] = useState({

        appointmentId: "",
        medicineCharge: "",
        labCharge: "",
        otherCharge: "",
        discount: "",
        paymentMethod: "CASH"

    });



    useEffect(() => {

        loadAppointments();

        if (id) {

            loadBill();

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



    const loadBill = async () => {

        try {

            const response = await getBillById(id);

            const data = response.data;


            setBill({

                appointmentId: data.appointmentId,

                medicineCharge: data.medicineCharge ?? "",

                labCharge: data.labCharge ?? "",

                otherCharge: data.otherCharge ?? "",

                discount: data.discount ?? "",

                paymentMethod: data.paymentMethod ?? "CASH"

            });


        } catch (error) {

            console.log(error);

        }

    };



    const handleChange = (e) => {

        setBill({

            ...bill,

            [e.target.name]: e.target.value

        });

    };



    const handleSubmit = async (e) => {

        e.preventDefault();



        if (!bill.appointmentId) {

            alert("Please select appointment");

            return;

        }



        try {


            const data = {

                appointmentId: Number(
                    bill.appointmentId
                ),

                medicineCharge: Number(
                    bill.medicineCharge || 0
                ),

                labCharge: Number(
                    bill.labCharge || 0
                ),

                otherCharge: Number(
                    bill.otherCharge || 0
                ),

                discount: Number(
                    bill.discount || 0
                ),

                paymentMethod: bill.paymentMethod

            };



            console.log(
                "BILL DATA:",
                data
            );



            if (id) {


                await updateBill(
                    id,
                    data
                );


                alert(
                    "Bill Updated Successfully"
                );


            } else {


                await createBill(data);


                alert(
                    "Bill Created Successfully"
                );


            }



            navigate("/bills");



        } catch (error) {


            console.log(error);


            console.log(
                error.response?.data
            );


            alert(
                error.response?.data?.message ||
                "Operation Failed"
            );


        }

    };



    return (

        <div className="bg-white rounded-xl shadow p-8">


            <h1 className="text-3xl font-bold text-blue-700 mb-6">

                {id ? "Edit Bill" : "Add Bill"}

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

                        value={bill.appointmentId}

                        onChange={handleChange}

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




                {
                    [
                        ["medicineCharge", "Medicine Charge"],
                        ["labCharge", "Lab Charge"],
                        ["otherCharge", "Other Charge"],
                        ["discount", "Discount"]

                    ].map(([name, label]) => (


                        <div key={name}>


                            <label className="block text-gray-600 mb-1">

                                {label}

                            </label>



                            <input

                                type="number"

                                name={name}

                                value={bill[name]}

                                onChange={handleChange}

                                className="w-full border rounded-lg p-3"

                            />


                        </div>


                    ))
                }





                <div>

                    <label className="block text-gray-600 mb-1">
                        Payment Method
                    </label>


                    <select

                        name="paymentMethod"

                        value={bill.paymentMethod}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    >

                        <option value="CASH">
                            CASH
                        </option>


                        <option value="CARD">
                            CARD
                        </option>


                        <option value="UPI">
                            UPI
                        </option>


                        <option value="NET_BANKING">
                            NET BANKING
                        </option>


                        <option value="INSURANCE">
                            INSURANCE
                        </option>


                    </select>


                </div>





                <div className="md:col-span-2 flex gap-4">


                    <button

                        type="submit"

                        className="bg-blue-600 text-white px-6 py-3 rounded-lg"

                    >

                        {id ? "Update Bill" : "Save Bill"}

                    </button>



                    <button

                        type="button"

                        onClick={() => navigate("/bills")}

                        className="bg-gray-500 text-white px-6 py-3 rounded-lg"

                    >

                        Cancel

                    </button>


                </div>



            </form>


        </div>

    );

}


export default AddBill;