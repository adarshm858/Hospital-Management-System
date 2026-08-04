import axios from "axios";


const API_URL = "http://localhost:8080/api/lab-tests";


const authConfig = () => {

    const token = localStorage.getItem("token");


    return {

        headers: {

            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json"

        }

    };

};



export const getAllLabTests = () => {

    return axios.get(
        API_URL,
        authConfig()
    );

};



export const getLabTestById = (id) => {

    return axios.get(
        `${API_URL}/${id}`,
        authConfig()
    );

};



export const createLabTest = (data) => {

    return axios.post(
        API_URL,
        data,
        authConfig()
    );

};



export const updateLabTest = (id, data) => {

    return axios.put(
        `${API_URL}/${id}`,
        data,
        authConfig()
    );

};



export const deleteLabTest = (id) => {

    return axios.delete(
        `${API_URL}/${id}`,
        authConfig()
    );

};