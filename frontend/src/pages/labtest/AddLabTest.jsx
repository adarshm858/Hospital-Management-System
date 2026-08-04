import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    createLabTest,
    getLabTestById,
    updateLabTest
} from "../../api/labTestApi";


function AddLabTest() {


    const navigate = useNavigate();

    const { id } = useParams();



    const [labTest, setLabTest] = useState({

        testName: "",
        category: "",
        description: "",
        testFee: ""

    });



    useEffect(() => {

        if (id) {

            loadLabTest();

        }

    }, [id]);




    const loadLabTest = async () => {

        try {

            const response = await getLabTestById(id);

            const data = response.data;


            console.log(
                "EDIT LAB TEST DATA:",
                data
            );


            setLabTest({

                testName: data.testName,

                category: data.category,

                description: data.description || "",

                testFee: data.testFee

            });


        } catch (error) {

            console.log(error);

        }

    };




    const handleChange = (e) => {

        setLabTest({

            ...labTest,

            [e.target.name]: e.target.value

        });

    };




    const handleSubmit = async (e) => {

        e.preventDefault();


        try {


            const data = {

                testName: labTest.testName,

                category: labTest.category,

                description: labTest.description,

                testFee: Number(
                    labTest.testFee
                )

            };



            console.log(
                "Lab Test Data:",
                data
            );



            if (id) {


                await updateLabTest(
                    id,
                    data
                );


                alert(
                    "Lab Test Updated Successfully"
                );


            }
            else {


                await createLabTest(data);


                alert(
                    "Lab Test Created Successfully"
                );


            }



            navigate("/lab-tests");


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

                {id ? "Edit Lab Test" : "Add Lab Test"}

            </h1>



            <form

                onSubmit={handleSubmit}

                className="grid grid-cols-1 md:grid-cols-2 gap-5"

            >



                <div>

                    <label className="block text-gray-600 mb-1">
                        Test Name
                    </label>


                    <input

                        name="testName"

                        value={labTest.testName}

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

                        value={labTest.category}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    />

                </div>




                <div>

                    <label className="block text-gray-600 mb-1">
                        Test Fee
                    </label>


                    <input

                        type="number"

                        name="testFee"

                        value={labTest.testFee}

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

                        value={labTest.description}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    />


                </div>




                <div className="md:col-span-2 flex gap-4">


                    <button

                        type="submit"

                        className="bg-blue-600 text-white px-6 py-3 rounded-lg"

                    >

                        {id ? "Update Lab Test" : "Save Lab Test"}

                    </button>



                    <button

                        type="button"

                        onClick={() => navigate("/lab-tests")}

                        className="bg-gray-500 text-white px-6 py-3 rounded-lg"

                    >

                        Cancel

                    </button>


                </div>


            </form>


        </div>

    );

}


export default AddLabTest;