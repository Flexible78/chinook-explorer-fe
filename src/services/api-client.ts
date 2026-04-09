// src/services/api-client.ts
import axios, { AxiosError } from "axios";
import { useAuthStore } from "../state-management/auth-store.js";

export const apiClient = axios.create({
    baseURL: "http://localhost:3000",
});

const sensitiveKeys = new Set(["password", "token", "authorization"]);

const sanitizeForLog = (value: unknown): unknown => {
    if (Array.isArray(value)) {
        return value.map(sanitizeForLog);
    }

    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value as Record<string, unknown>).map(([key, item]) => [
                key,
                sensitiveKeys.has(key.toLowerCase()) ? "***" : sanitizeForLog(item),
            ]),
        );
    }

    return value;
};

const getRequestUrl = (url?: string) => url ?? "unknown endpoint";

apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    const method = config.method?.toUpperCase() ?? "GET";
    const url = getRequestUrl(config.url);

    if (token) {
        // Use a Bearer token for authenticated API requests.
        config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`[API] Sending ${method} request to ${url}`, {
        params: sanitizeForLog(config.params),
        data: sanitizeForLog(config.data),
    });

    return config;
}, (error) => {
    console.error("[API] Failed to prepare request:", error);
    return Promise.reject(error);
});

apiClient.interceptors.response.use((response) => {
    const method = response.config.method?.toUpperCase() ?? "GET";
    const url = getRequestUrl(response.config.url);

    console.log(`[API] Response received from ${method} ${url}:`, sanitizeForLog(response.data));

    return response;
}, (error: AxiosError) => {
    const method = error.config?.method?.toUpperCase() ?? "GET";
    const url = getRequestUrl(error.config?.url);

    console.error(`[API] Request failed for ${method} ${url}:`, {
        message: error.message,
        status: error.response?.status,
        data: sanitizeForLog(error.response?.data),
    });

    return Promise.reject(error);
});
