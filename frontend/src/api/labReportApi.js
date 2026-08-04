import axios from "axios";


const API_URL = "http://localhost:8080/api/lab-reports";


const authConfig = () => {

    const token = localStorage.getItem("token");

    return {

        headers: {

            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json"

        }

    };

};



export const getAllLabReports = () => {

    return axios.get(
        API_URL,
        authConfig()
    );

};



export const getLabReportById = (id) => {

    return axios.get(
        `${API_URL}/${id}`,
        authConfig()
    );

};



export const createLabReport = (data) => {

    return axios.post(
        API_URL,
        data,
        authConfig()
    );

};



export const updateLabReport = (id, data) => {

    return axios.put(
        `${API_URL}/${id}`,
        data,
        authConfig()
    );

};



export const deleteLabReport = (id) => {

    return axios.delete(
        `${API_URL}/${id}`,
        authConfig()
    );

};