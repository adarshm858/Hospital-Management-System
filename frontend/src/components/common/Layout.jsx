import { Outlet, NavLink, useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    Users,
    Stethoscope,
    CalendarCheck,
    FileText,
    Pill,
    FlaskConical,
    Receipt,
    LogOut,
    ClipboardCheck
} from "lucide-react";


function Layout() {


    const navigate = useNavigate();



    const menu = [

        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard
        },

        {
            name: "Patients",
            path: "/patients",
            icon: Users
        },

        {
            name: "Doctors",
            path: "/doctors",
            icon: Stethoscope
        },

        {
            name: "Appointments",
            path: "/appointments",
            icon: CalendarCheck
        },

        {
            name: "Prescriptions",
            path: "/prescriptions",
            icon: FileText
        },

        {
            name: "Medicines",
            path: "/medicines",
            icon: Pill
        },

        {
            name: "Lab Tests",
            path: "/lab-tests",
            icon: FlaskConical
        },

        {
            name: "Lab Reports",
            path: "/lab-reports",
            icon: ClipboardCheck
        },

        {
            name: "Bills",
            path: "/bills",
            icon: Receipt
        }

    ];




    const logout = () => {

        localStorage.removeItem("token");

        navigate("/login");

    };




    return (


        <div className="min-h-screen bg-gray-100 flex">


            {/* Sidebar */}

            <aside className="
                w-72
                bg-blue-700
                text-white
                min-h-screen
                p-6
                shadow-xl
                overflow-y-auto
            ">


                <div className="mb-10">


                    <h1 className="text-4xl font-bold">
                        HMS
                    </h1>


                    <p className="text-blue-200 mt-1">
                        Hospital Management System
                    </p>


                </div>




                <nav className="space-y-3">


                    {
                        menu.map((item, index) => {


                            const Icon = item.icon;



                            return (

                                <NavLink

                                    key={index}

                                    to={item.path}

                                    className={({ isActive }) =>

                                        `flex items-center gap-3 px-4 py-3 rounded-lg transition duration-300
                                        ${isActive
                                            ?
                                            "bg-white text-blue-700 shadow-md font-bold"
                                            :
                                            "hover:bg-blue-600"
                                        }`

                                    }

                                >


                                    <Icon size={21} />


                                    <span>
                                        {item.name}
                                    </span>


                                </NavLink>

                            );


                        })
                    }


                </nav>





                <button

                    onClick={logout}

                    className="
                    mt-10
                    w-full
                    flex
                    items-center
                    justify-center
                    gap-3
                    bg-red-500
                    hover:bg-red-600
                    px-4
                    py-3
                    rounded-lg
                    transition
                    "

                >

                    <LogOut size={20} />

                    Logout


                </button>



            </aside>






            {/* Main Content */}


            <main className="flex-1 p-8">


                <div className="
                    bg-white
                    rounded-xl
                    shadow
                    p-5
                    mb-6
                ">


                    <h2 className="text-2xl font-bold text-gray-800">

                        Hospital Management System

                    </h2>


                    <p className="text-gray-500">

                        Admin Dashboard

                    </p>


                </div>




                <Outlet />


            </main>



        </div>


    );

}


export default Layout;