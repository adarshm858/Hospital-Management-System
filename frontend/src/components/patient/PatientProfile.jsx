import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";


function PatientProfile() {


    const { id } = useParams();


    const [patient, setPatient] = useState(null);



    useEffect(() => {

        loadProfile();

    }, []);



    const loadProfile = async () => {


        try {


            const token = localStorage.getItem("token");


            const response = await axios.get(

                `http://localhost:8080/api/patients/${id}/profile`,

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );


            console.log(
                "PATIENT PROFILE:",
                response.data
            );


            setPatient(response.data);



        } catch (error) {


            console.log(error);


        }


    };




    if (!patient) {

        return (

            <div className="text-center text-gray-500">

                Loading Patient Profile...

            </div>

        );

    }





    return (


        <div className="
            bg-white
            rounded-xl
            shadow
            p-8
        ">


            <h1 className="
                text-3xl
                font-bold
                text-blue-700
                mb-6
            ">

                Patient Profile

            </h1>




            <div className="
                grid
                md:grid-cols-2
                gap-5
            ">


                <div>
                    <b>Name:</b>
                    <p>{patient.name}</p>
                </div>



                <div>
                    <b>Phone:</b>
                    <p>{patient.phone}</p>
                </div>



                <div>
                    <b>Email:</b>
                    <p>{patient.email}</p>
                </div>



                <div>
                    <b>Gender:</b>
                    <p>{patient.gender}</p>
                </div>



                <div>
                    <b>Age:</b>
                    <p>{patient.age ?? "N/A"}</p>
                </div>



                <div>
                    <b>Blood Group:</b>
                    <p>{patient.bloodGroup}</p>
                </div>



                <div className="md:col-span-2">

                    <b>Address:</b>

                    <p>
                        {patient.address}
                    </p>

                </div>



            </div>



        </div>


    );

}


export default PatientProfile;