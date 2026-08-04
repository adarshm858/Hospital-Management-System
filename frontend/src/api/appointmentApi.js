import axios from "axios";


const API_URL = "http://localhost:8080/api/appointments";


const authConfig = () => {

    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };

};



export const getAllAppointments = () => {

    return axios.get(
        API_URL,
        authConfig()
    );

};



export const getAppointmentById = (id) => {

    return axios.get(
        `${API_URL}/${id}`,
        authConfig()
    );

};



export const createAppointment = (data) => {

    return axios.post(
        API_URL,
        data,
        authConfig()
    );

};



export const updateAppointment = (id, data) => {

    return axios.put(
        `${API_URL}/${id}`,
        data,
        authConfig()
    );

};



export const deleteAppointment = (id) => {

    return axios.delete(
        `${API_URL}/${id}`,
        authConfig()
    );

};