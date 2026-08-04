import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Users,
    Stethoscope,
    CalendarCheck,
    Pill,
    FileText,
    Receipt,
    FlaskConical,
    Activity,
    UserPlus,
    CalendarPlus,
    DollarSign
} from "lucide-react";


import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";


import {
    getDashboardCount,
    getRecentActivity
} from "../../api/dashboardApi";



function Dashboard() {


    const navigate = useNavigate();



    const [counts, setCounts] = useState({

        patients: 0,
        doctors: 0,
        appointments: 0,
        medicines: 0,
        labTests: 0,
        labReports: 0,
        bills: 0,
        revenue: 0

    });



    const [activities, setActivities] = useState([]);





    useEffect(() => {


        const fetchDashboard = async () => {

            try {


                const response = await getDashboardCount();


                console.log(
                    "DASHBOARD DATA:",
                    response.data
                );


                setCounts({

                    patients: response.data.patients || 0,

                    doctors: response.data.doctors || 0,

                    appointments: response.data.appointments || 0,

                    medicines: response.data.medicines || 0,

                    labTests: response.data.labTests || 0,

                    labReports: response.data.labReports || 0,

                    bills: response.data.bills || 0,

                    revenue: response.data.revenue || 0

                });


            } catch (error) {

                console.log(error);

            }

        };





        const fetchActivity = async () => {

            try {


                const response = await getRecentActivity();


                console.log(
                    "ACTIVITY DATA:",
                    response.data
                );


                setActivities(response.data);


            } catch (error) {

                console.log(error);

            }

        };



        fetchDashboard();

        fetchActivity();



    }, []);






    const cards = [

        {
            title: "Total Patients",
            value: counts.patients,
            icon: Users
        },

        {
            title: "Total Doctors",
            value: counts.doctors,
            icon: Stethoscope
        },

        {
            title: "Appointments",
            value: counts.appointments,
            icon: CalendarCheck
        },

        {
            title: "Medicines",
            value: counts.medicines,
            icon: Pill
        },

        {
            title: "Lab Tests",
            value: counts.labTests,
            icon: FlaskConical
        },

        {
            title: "Lab Reports",
            value: counts.labReports,
            icon: FileText
        },

        {
            title: "Bills",
            value: counts.bills,
            icon: Receipt
        },

        {
            title: "Revenue",
            value: `₹ ${counts.revenue}`,
            icon: DollarSign,
            revenue: true
        }

    ];





    const chartData = [

        {
            name: "Patients",
            value: counts.patients
        },

        {
            name: "Doctors",
            value: counts.doctors
        },

        {
            name: "Appointments",
            value: counts.appointments
        },

        {
            name: "Bills",
            value: counts.bills
        },

        {
            name: "Reports",
            value: counts.labReports
        }

    ];





    const revenueData = [

        {
            name: "Revenue",
            amount: counts.revenue
        }

    ];






    return (


        <div className="space-y-8">



            <div className="
                bg-gradient-to-r
                from-blue-700
                to-blue-500
                rounded-2xl
                p-8
                text-white
                shadow-lg
            ">


                <h1 className="text-4xl font-bold">
                    HMS Dashboard
                </h1>


                <p className="mt-2 text-blue-100">
                    Hospital Management System Overview
                </p>


            </div>






            <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-4
                gap-6
            ">


                {
                    cards.map((card, index) => {


                        const Icon = card.icon;


                        return (

                            <div
                                key={index}
                                className={`
                                rounded-2xl
                                p-6
                                shadow-md
                                flex
                                justify-between
                                items-center
                                hover:shadow-xl
                                transition

                                ${card.revenue
                                        ?
                                        "bg-green-50 border border-green-200"
                                        :
                                        "bg-white"
                                    }

                                `}
                            >


                                <div>

                                    <p className="text-gray-500">
                                        {card.title}
                                    </p>


                                    <h2 className="
                                    text-3xl
                                    font-bold
                                    text-blue-700
                                    mt-3
                                    ">
                                        {card.value}
                                    </h2>


                                </div>



                                <Icon
                                    size={32}
                                    className="text-blue-700"
                                />


                            </div>

                        );


                    })
                }


            </div>






            <div className="
                grid
                md:grid-cols-2
                gap-6
            ">



                <div className="
                    bg-white
                    rounded-2xl
                    shadow-md
                    p-6
                ">


                    <h2 className="text-xl font-bold mb-5">
                        HMS Overview
                    </h2>



                    <ResponsiveContainer width="100%" height={300}>

                        <BarChart data={chartData}>

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="name" />

                            <YAxis />

                            <Tooltip />

                            <Bar
                                dataKey="value"
                                fill="#2563eb"
                            />

                        </BarChart>

                    </ResponsiveContainer>


                </div>






                <div className="
                    bg-white
                    rounded-2xl
                    shadow-md
                    p-6
                ">


                    <h2 className="text-xl font-bold mb-5">
                        Revenue Overview
                    </h2>



                    <ResponsiveContainer width="100%" height={300}>


                        <BarChart data={revenueData}>


                            <CartesianGrid strokeDasharray="3 3" />


                            <XAxis dataKey="name" />


                            <YAxis />


                            <Tooltip />


                            <Bar
                                dataKey="amount"
                                fill="#16a34a"
                            />


                        </BarChart>


                    </ResponsiveContainer>


                </div>



            </div>







            <div className="
                bg-white
                rounded-2xl
                shadow-md
                p-6
            ">


                <h2 className="text-2xl font-bold mb-5">
                    Quick Actions
                </h2>



                <div className="
                    grid
                    md:grid-cols-3
                    gap-5
                ">


                    <button
                        onClick={() => navigate("/patients/add")}
                        className="border rounded-xl p-5 flex gap-3 hover:bg-blue-50"
                    >

                        <UserPlus className="text-blue-600" />

                        Add Patient

                    </button>



                    <button
                        onClick={() => navigate("/appointments/add")}
                        className="border rounded-xl p-5 flex gap-3 hover:bg-green-50"
                    >

                        <CalendarPlus className="text-green-600" />

                        Appointment

                    </button>



                    <button
                        onClick={() => navigate("/lab-reports")}
                        className="border rounded-xl p-5 flex gap-3 hover:bg-red-50"
                    >

                        <Activity className="text-red-600" />

                        Reports

                    </button>


                </div>


            </div>







            <div className="
                bg-white
                rounded-2xl
                shadow-md
                p-6
            ">


                <h2 className="text-2xl font-bold">
                    Recent Activity
                </h2>



                <div className="mt-5 space-y-3">


                    {
                        activities.length === 0 ? (

                            <p className="text-gray-500">
                                No recent activity available
                            </p>

                        ) : (

                            activities.map((activity, index) => (

                                <div
                                    key={index}
                                    className="
                                    bg-gray-50
                                    border
                                    rounded-xl
                                    p-4
                                    "
                                >

                                    <p className="font-semibold text-gray-700">
                                        {activity.message}
                                    </p>


                                    <p className="text-sm text-gray-500">
                                        {activity.time}
                                    </p>


                                </div>

                            ))

                        )
                    }


                </div>


            </div>





        </div>


    );

}


export default Dashboard;