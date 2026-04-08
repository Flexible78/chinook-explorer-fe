import { apiClient } from "./api-client.js";
import { useAuthStore } from "../state-management/auth-store";

export interface LoginCredentials {
    email: string;
    password: string;
}

export const loginUser = async (credentials: LoginCredentials) => {
    const response = await apiClient.post("/accounts/login", credentials);
    const { token, role, message } = response.data;

    useAuthStore.getState().setAuth({
        email: credentials.email,
        role,
        token,
    });

    return message;
};
