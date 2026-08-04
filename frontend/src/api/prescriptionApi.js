import axios from "axios";


const API_URL = "http://localhost:8080/api/prescriptions";



const authConfig = () => {

    const token = localStorage.getItem("token");


    return {

        headers: {

            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json"

        }

    };

};





export const getAllPrescriptions = () => {

    return axios.get(

        API_URL,

        authConfig()

    );

};





export const getPrescriptionById = (id) => {

    return axios.get(

        `${API_URL}/${id}`,

        authConfig()

    );

};





export const createPrescription = (data) => {

    return axios.post(

        API_URL,

        data,

        authConfig()

    );

};





export const updatePrescription = (id, data) => {

    return axios.put(

        `${API_URL}/${id}`,

        data,

        authConfig()

    );

};





export const deletePrescription = (id) => {

    return axios.delete(

        `${API_URL}/${id}`,

        authConfig()

    );

};