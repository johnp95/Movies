import axios from "axios";
import { API_BASE_URL } from "../config";

const AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",
    },
});

AxiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Token ${token}`;
    return config;
});

export default AxiosInstance;
