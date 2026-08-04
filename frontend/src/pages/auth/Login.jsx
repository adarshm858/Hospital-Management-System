import { useState } from "react";
import { loginUser } from "../../api/authApi";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {

            const response = await loginUser({
                email,
                password
            });


            console.log("LOGIN RESPONSE:", response.data);


            localStorage.setItem(
                "token",
                response.data.token
            );


            console.log(
                "SAVED TOKEN:",
                localStorage.getItem("token")
            );


            alert("Login Successful");

            window.location.href = "/dashboard";


        } catch (error) {

            console.log(error);
            console.log(error.response);

            alert(
                error.response?.data?.message ||
                "Login Failed"
            );

        }

    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white shadow-xl rounded-xl p-8 w-96">

                <h1 className="text-3xl font-bold text-center text-blue-600">
                    HMS
                </h1>

                <p className="text-center mb-6 text-gray-500">
                    Hospital Management System
                </p>


                <form onSubmit={handleLogin}>

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full border p-3 rounded-lg mb-4"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />


                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border p-3 rounded-lg mb-4"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />


                    <button
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                    >
                        Login
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;