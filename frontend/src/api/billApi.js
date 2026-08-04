import axios from "axios";


const API_URL = "http://localhost:8080/api/bills";



const authConfig = () => {

    const token = localStorage.getItem("token");

    return {

        headers: {

            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json"

        }

    };

};





export const getAllBills = () => {

    return axios.get(
        API_URL,
        authConfig()
    );

};





export const getBillById = (id) => {

    return axios.get(
        `${API_URL}/${id}`,
        authConfig()
    );

};





export const createBill = (data) => {

    return axios.post(
        API_URL,
        data,
        authConfig()
    );

};





export const updateBill = (id, data) => {

    return axios.put(
        `${API_URL}/${id}`,
        data,
        authConfig()
    );

};





export const deleteBill = (id) => {

    return axios.delete(
        `${API_URL}/${id}`,
        authConfig()
    );

};





// Download Invoice PDF

export const downloadInvoice = (id) => {

    return axios.get(

        `${API_URL}/${id}/invoice`,

        {
            ...authConfig(),

            responseType: "blob"

        }

    );

};