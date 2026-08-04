import axios from "axios";


const API_URL = "http://localhost:8080/api/doctors";


const authConfig = () => {

    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };

};



export const getAllDoctors = () => {

    return axios.get(
        API_URL,
        authConfig()
    );

};



export const getDoctorById = (id) => {

    return axios.get(
        `${API_URL}/${id}`,
        authConfig()
    );

};



export const createDoctor = (data) => {

    return axios.post(
        API_URL,
        data,
        authConfig()
    );

};



export const updateDoctor = (id, data) => {

    return axios.put(
        `${API_URL}/${id}`,
        data,
        authConfig()
    );

};



export const deleteDoctor = (id) => {

    return axios.delete(
        `${API_URL}/${id}`,
        authConfig()
    );

};