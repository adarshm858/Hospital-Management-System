import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAllLabTests,
    deleteLabTest
} from "../../api/labTestApi";


function LabTestList() {


    const navigate = useNavigate();


    const [labTests, setLabTests] = useState([]);



    useEffect(() => {

        loadLabTests();

    }, []);




    const loadLabTests = async () => {

        try {

            const response = await getAllLabTests();

            setLabTests(response.data);


        } catch (error) {

            console.log(error);

        }

    };




    const handleDelete = async (id) => {


        if (!window.confirm("Delete this lab test?")) {

            return;

        }


        try {

            await deleteLabTest(id);

            alert("Lab Test deleted successfully");

            loadLabTests();


        } catch (error) {

            console.log(error);

        }

    };




    return (

        <div className="bg-white rounded-xl shadow p-8">


            <div className="flex justify-between items-center mb-6">


                <h1 className="text-3xl font-bold text-blue-700">

                    Lab Tests

                </h1>



                <button

                    onClick={() => navigate("/lab-tests/add")}

                    className="
                    bg-blue-600
                    text-white
                    px-5
                    py-3
                    rounded-lg
                    "

                >

                    Add Lab Test

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
                                Test Name
                            </th>


                            <th className="p-3 border">
                                Category
                            </th>


                            <th className="p-3 border">
                                Description
                            </th>


                            <th className="p-3 border">
                                Fee
                            </th>


                            <th className="p-3 border">
                                Status
                            </th>


                            <th className="p-3 border">
                                Action
                            </th>


                        </tr>


                    </thead>




                    <tbody>


                        {
                            labTests.map((test) => (

                                <tr key={test.id}>


                                    <td className="p-3 border">
                                        {test.testId}
                                    </td>


                                    <td className="p-3 border">
                                        {test.testName}
                                    </td>


                                    <td className="p-3 border">
                                        {test.category}
                                    </td>


                                    <td className="p-3 border">
                                        {test.description}
                                    </td>


                                    <td className="p-3 border">
                                        ₹  {test.testFee}
                                    </td>


                                    <td className="p-3 border">

                                        {
                                            test.available
                                                ? "Available"
                                                : "Not Available"
                                        }

                                    </td>


                                    <td className="p-3 border flex gap-2">


                                        <button

                                            onClick={() =>
                                                navigate(`/lab-tests/edit/${test.id}`)
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
                                                handleDelete(test.id)
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


export default LabTestList;