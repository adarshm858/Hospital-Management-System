import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAllBills,
    deleteBill,
    downloadInvoice
} from "../../api/billApi";


function BillList() {


    const navigate = useNavigate();


    const [bills, setBills] = useState([]);



    useEffect(() => {

        loadBills();

    }, []);




    const loadBills = async () => {

        try {

            const response = await getAllBills();

            console.log(
                "BILL DATA:",
                response.data
            );

            setBills(response.data);


        } catch (error) {

            console.log(error);

        }

    };





    const handleDelete = async (id) => {


        if (!window.confirm("Delete this bill?")) {

            return;

        }


        try {

            await deleteBill(id);

            alert("Bill deleted successfully");

            loadBills();


        } catch (error) {

            console.log(error);

        }

    };





    const handleInvoice = async (id, billId) => {

        try {


            const response = await downloadInvoice(id);


            const url = window.URL.createObjectURL(
                new Blob(
                    [response.data],
                    {
                        type: "application/pdf"
                    }
                )
            );


            const link = document.createElement("a");

            link.href = url;

            link.download = `${billId}.pdf`;

            document.body.appendChild(link);

            link.click();

            link.remove();


        } catch (error) {


            console.log(error);

            alert("Invoice download failed");


        }

    };





    return (

        <div className="bg-white rounded-xl shadow p-8">


            <div className="flex justify-between items-center mb-6">


                <h1 className="text-3xl font-bold text-blue-700">
                    Bills
                </h1>



                <button
                    onClick={() => navigate("/bills/add")}
                    className="bg-blue-600 text-white px-5 py-3 rounded-lg"
                >

                    Add Bill

                </button>


            </div>





            <div className="overflow-x-auto">


                <table className="w-full border">


                    <thead className="bg-blue-100">


                        <tr>

                            <th className="p-3 border">
                                Bill ID
                            </th>

                            <th className="p-3 border">
                                Patient
                            </th>

                            <th className="p-3 border">
                                Doctor
                            </th>

                            <th className="p-3 border">
                                Total Amount
                            </th>

                            <th className="p-3 border">
                                Status
                            </th>

                            <th className="p-3 border">
                                Payment
                            </th>

                            <th className="p-3 border">
                                Action
                            </th>

                        </tr>


                    </thead>




                    <tbody>


                        {
                            bills.map((bill) => (


                                <tr key={bill.id}>


                                    <td className="p-3 border">
                                        {bill.billId}
                                    </td>


                                    <td className="p-3 border">
                                        {bill.patientName}
                                    </td>


                                    <td className="p-3 border">
                                        Dr. {bill.doctorName}
                                    </td>


                                    <td className="p-3 border">
                                        ₹ {bill.totalAmount}
                                    </td>


                                    <td className="p-3 border">
                                        {bill.paymentStatus}
                                    </td>


                                    <td className="p-3 border">
                                        {bill.paymentMethod}
                                    </td>



                                    <td className="p-3 border flex gap-2">


                                        <button

                                            onClick={() =>
                                                navigate(`/bills/edit/${bill.id}`)
                                            }

                                            className="bg-green-600 text-white px-3 py-1 rounded"
                                        >

                                            Edit

                                        </button>




                                        <button

                                            onClick={() =>
                                                handleInvoice(
                                                    bill.id,
                                                    bill.billId
                                                )
                                            }

                                            className="bg-blue-600 text-white px-3 py-1 rounded"
                                        >

                                            Invoice

                                        </button>




                                        <button

                                            onClick={() =>
                                                handleDelete(bill.id)
                                            }

                                            className="bg-red-600 text-white px-3 py-1 rounded"
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


export default BillList;