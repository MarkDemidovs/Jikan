import axios from "axios";

const API = axios.create({
    baseURL: "https://animated-goldfish-69rv4v446p762qq7-3001.app.github.dev/jikans",
    headers: {
        "Content-Type": "application/json"
    }
});

API.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default API;
