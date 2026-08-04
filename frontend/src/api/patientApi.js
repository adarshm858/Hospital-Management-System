import axios from "axios";


const API_URL = "http://localhost:8080/api/patients";


const authConfig = () => {

    const token = localStorage.getItem("token");

    console.log("JWT TOKEN:", token);

    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };

};



export const getAllPatients = () => {

    return axios.get(
        API_URL,
        authConfig()
    );

};



export const getPatientById = (id) => {

    return axios.get(
        `${API_URL}/${id}`,
        authConfig()
    );

};



export const createPatient = (data) => {

    return axios.post(
        API_URL,
        data,
        authConfig()
    );

};



export const updatePatient = (id, data) => {

    return axios.put(
        `${API_URL}/${id}`,
        data,
        authConfig()
    );

};



export const deletePatient = (id) => {

    return axios.delete(
        `${API_URL}/${id}`,
        authConfig()
    );

};