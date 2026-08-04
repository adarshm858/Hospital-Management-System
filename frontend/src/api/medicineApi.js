import axios from "axios";


const API_URL = "http://localhost:8080/api/medicines";


const authConfig = () => {

    const token = localStorage.getItem("token");

    return {

        headers: {

            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json"

        }

    };

};



export const getAllMedicines = () => {

    return axios.get(
        API_URL,
        authConfig()
    );

};



export const getMedicineById = (id) => {

    return axios.get(
        `${API_URL}/${id}`,
        authConfig()
    );

};



export const createMedicine = (data) => {

    return axios.post(
        API_URL,
        data,
        authConfig()
    );

};



export const updateMedicine = (id, data) => {

    return axios.put(
        `${API_URL}/${id}`,
        data,
        authConfig()
    );

};



export const deleteMedicine = (id) => {

    return axios.delete(
        `${API_URL}/${id}`,
        authConfig()
    );

};