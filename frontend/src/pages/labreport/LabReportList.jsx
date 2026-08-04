import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAllLabReports,
    deleteLabReport
} from "../../api/labReportApi";


function LabReportList() {


    const navigate = useNavigate();


    const [reports, setReports] = useState([]);



    useEffect(() => {

        loadReports();

    }, []);




    const loadReports = async () => {

        try {

            const response = await getAllLabReports();

            console.log(
                "LAB REPORT DATA:",
                response.data
            );

            setReports(response.data);


        } catch (error) {

            console.log(error);

        }

    };




    const handleDelete = async (id) => {


        if (!window.confirm("Delete this lab report?")) {

            return;

        }


        try {

            await deleteLabReport(id);

            alert("Lab Report deleted successfully");

            loadReports();


        } catch (error) {

            console.log(error);

        }

    };




    return (

        <div className="bg-white rounded-xl shadow p-8">


            <div className="flex justify-between items-center mb-6">


                <h1 className="text-3xl font-bold text-blue-700">
                    Lab Reports
                </h1>



                <button

                    onClick={() => navigate("/lab-reports/add")}

                    className="
                    bg-blue-600
                    text-white
                    px-5
                    py-3
                    rounded-lg
                    "

                >

                    Add Lab Report

                </button>


            </div>




            <div className="overflow-x-auto">


                <table className="w-full border">


                    <thead className="bg-blue-100">


                        <tr>


                            <th className="p-3 border">
                                Report ID
                            </th>


                            <th className="p-3 border">
                                Patient
                            </th>


                            <th className="p-3 border">
                                Doctor
                            </th>


                            <th className="p-3 border">
                                Lab Test
                            </th>


                            <th className="p-3 border">
                                Result
                            </th>


                            <th className="p-3 border">
                                Status
                            </th>


                            <th className="p-3 border">
                                Date
                            </th>


                            <th className="p-3 border">
                                Action
                            </th>


                        </tr>


                    </thead>




                    <tbody>


                        {
                            reports.map((report) => (


                                <tr key={report.id}>


                                    <td className="p-3 border">
                                        {report.reportId}
                                    </td>



                                    <td className="p-3 border">
                                        {report.patientName}
                                    </td>



                                    <td className="p-3 border">
                                        {report.doctorName}
                                    </td>



                                    <td className="p-3 border">
                                        {report.labTestName}
                                    </td>



                                    <td className="p-3 border">
                                        {report.result}
                                    </td>



                                    <td className="p-3 border">
                                        {report.status}
                                    </td>



                                    <td className="p-3 border">
                                        {
                                            report.reportDate
                                                ?
                                                report.reportDate.split("T")[0]
                                                :
                                                "-"
                                        }
                                    </td>



                                    <td className="p-3 border flex gap-2">


                                        <button

                                            onClick={() =>
                                                navigate(`/lab-reports/edit/${report.id}`)
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
                                                handleDelete(report.id)
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


export default LabReportList;