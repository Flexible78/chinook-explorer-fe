// src/services/api-client.ts
import axios from "axios";
import { useAuthStore } from "../state-management/auth-store.js";

export const apiClient = axios.create({
    baseURL: "http://localhost:3000",
});

apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;

    if (token) {
        // ОБЯЗАТЕЛЬНО обратные апострофы ` ` и ${token}
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});