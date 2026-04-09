import type { AxiosError } from "axios";
import { apiClient } from "./api-client.js";
import { useAuthStore } from "../state-management/auth-store";

export interface LoginCredentials {
    email: string;
    password: string;
}

export const loginUser = async (credentials: LoginCredentials) => {
    try {
        const response = await apiClient.post("/accounts/login", credentials);
        const { token, role, message } = response.data;

        useAuthStore.getState().setAuth({
            email: credentials.email,
            role,
            token,
        });

        console.log("Login successful:", {
            email: credentials.email,
            role,
        });

        return message;
    } catch (error) {
        const loginError = error as AxiosError<{ error?: string }>;

        console.error("Login failed:", {
            email: credentials.email,
            message: loginError.response?.data?.error ?? loginError.message,
        });

        throw error;
    }
};
