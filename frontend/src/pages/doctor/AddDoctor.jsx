import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    createDoctor,
    getDoctorById,
    updateDoctor
} from "../../api/doctorApi";


function AddDoctor() {


    const navigate = useNavigate();

    const { id } = useParams();



    const [doctor, setDoctor] = useState({

        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "MALE",
        specialization: "",
        qualification: "",
        experience: "",
        consultationFee: "",
        address: "",
        city: "",
        state: "",
        country: "",
        available: true

    });



    useEffect(() => {

        if (id) {

            loadDoctor();

        }

    }, [id]);



    const loadDoctor = async () => {

        try {

            const response = await getDoctorById(id);

            setDoctor(response.data);


        } catch (error) {

            console.log(error);

        }

    };



    const handleChange = (e) => {

        const { name, value } = e.target;

        setDoctor({
            ...doctor,
            [name]: value
        });

    };



    const handleSubmit = async (e) => {

        e.preventDefault();


        try {


            if (id) {

                await updateDoctor(id, doctor);

                alert("Doctor Updated Successfully");


            } else {


                await createDoctor(doctor);

                alert("Doctor Added Successfully");


            }



            navigate("/doctors");


        } catch (error) {


            console.log(error);

            alert("Operation Failed");


        }

    };



    return (

        <div className="bg-white rounded-xl shadow p-8">


            <h1 className="text-3xl font-bold text-blue-700 mb-6">

                {id ? "Edit Doctor" : "Add Doctor"}

            </h1>



            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >


                {
                    [
                        ["firstName", "First Name"],
                        ["lastName", "Last Name"],
                        ["email", "Email"],
                        ["phone", "Phone"],
                        ["specialization", "Specialization"],
                        ["qualification", "Qualification"],
                        ["experience", "Experience"],
                        ["consultationFee", "Consultation Fee"],
                        ["address", "Address"],
                        ["city", "City"],
                        ["state", "State"],
                        ["country", "Country"]

                    ].map(([name, label]) => (

                        <div key={name}>


                            <label className="block text-gray-600 mb-1">
                                {label}
                            </label>


                            <input

                                type={
                                    name === "experience" ||
                                        name === "consultationFee"
                                        ? "number"
                                        : "text"
                                }

                                name={name}

                                value={doctor[name] || ""}

                                onChange={handleChange}

                                className="
                                w-full
                                border
                                rounded-lg
                                p-3
                                focus:ring-2
                                focus:ring-blue-500
                                "

                            />


                        </div>

                    ))
                }



                <div>

                    <label className="block text-gray-600 mb-1">
                        Gender
                    </label>


                    <select

                        name="gender"

                        value={doctor.gender}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    >

                        <option value="MALE">
                            Male
                        </option>


                        <option value="FEMALE">
                            Female
                        </option>


                    </select>


                </div>




                <div>

                    <label className="block text-gray-600 mb-1">
                        Available
                    </label>


                    <select

                        name="available"

                        value={doctor.available}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    >

                        <option value={true}>
                            Yes
                        </option>


                        <option value={false}>
                            No
                        </option>


                    </select>


                </div>




                <div className="md:col-span-2 flex gap-4">


                    <button

                        type="submit"

                        className="
                        bg-blue-600
                        text-white
                        px-6
                        py-3
                        rounded-lg
                        hover:bg-blue-700
                        "

                    >

                        {id ? "Update Doctor" : "Save Doctor"}

                    </button>



                    <button

                        type="button"

                        onClick={() => navigate("/doctors")}

                        className="
                        bg-gray-500
                        text-white
                        px-6
                        py-3
                        rounded-lg
                        "

                    >

                        Cancel

                    </button>


                </div>


            </form>


        </div>

    );

}


export default AddDoctor;