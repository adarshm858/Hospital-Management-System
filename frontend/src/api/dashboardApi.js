import axios from "axios";


const API_URL = "http://localhost:8080/api/dashboard";


const authConfig = () => {

    const token = localStorage.getItem("token");


    return {

        headers: {

            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json"

        }

    };

};




export const getDashboardCount = () => {

    return axios.get(

        `${API_URL}/count`,

        authConfig()

    );

};





export const getRecentActivity = () => {

    return axios.get(

        `${API_URL}/activity`,

        authConfig()

    );

};