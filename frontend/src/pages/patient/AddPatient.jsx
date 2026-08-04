import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    createPatient,
    getPatientById,
    updatePatient
} from "../../api/patientApi";


function AddPatient() {


    const navigate = useNavigate();

    const { id } = useParams();


    const [patient, setPatient] = useState({

        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "MALE",
        dateOfBirth: "",
        bloodGroup: "",
        address: "",
        city: "",
        state: "",
        country: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        allergies: "",
        medicalHistory: ""

    });



    useEffect(() => {

        if (id) {

            loadPatient();

        }

    }, [id]);



    const loadPatient = async () => {

        try {

            const response = await getPatientById(id);

            setPatient(response.data);

        }
        catch (error) {

            console.log(error);

        }

    };




    const handleChange = (e) => {

        setPatient({
            ...patient,
            [e.target.name]: e.target.value
        });

    };



    const handleSubmit = async (e) => {

        e.preventDefault();


        try {


            if (id) {

                await updatePatient(id, patient);

                alert("Patient Updated Successfully");

            }
            else {

                await createPatient(patient);

                alert("Patient Added Successfully");

            }



            navigate("/patients");


        }
        catch (error) {

            console.log(error);

            alert("Operation Failed");

        }

    };



    return (

        <div className="bg-white rounded-xl shadow p-8">


            <h1 className="text-3xl font-bold text-blue-700 mb-6">
                {id ? "Edit Patient" : "Add Patient"}
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
                        ["dateOfBirth", "Date Of Birth"],
                        ["bloodGroup", "Blood Group"],
                        ["address", "Address"],
                        ["city", "City"],
                        ["state", "State"],
                        ["country", "Country"],
                        ["emergencyContactName", "Emergency Contact Name"],
                        ["emergencyContactPhone", "Emergency Contact Phone"],
                        ["allergies", "Allergies"],
                        ["medicalHistory", "Medical History"]

                    ].map(([name, label]) => (

                        <div key={name}>

                            <label className="block text-gray-600 mb-1">
                                {label}
                            </label>


                            <input

                                type={
                                    name === "dateOfBirth"
                                        ? "date"
                                        : "text"
                                }

                                name={name}

                                value={patient[name] || ""}

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

                        value={patient.gender}

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

                        {id ? "Update Patient" : "Save Patient"}

                    </button>



                    <button

                        type="button"

                        onClick={() => navigate("/patients")}

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


export default AddPatient;