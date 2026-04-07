import { apiClient } from "./api-client.js";
import { type UserData, useAuthStore } from "../state-management/auth-store";

export interface LoginCredentials {
    email: string;
    password: string;
}

export const loginUser = async (credentials: LoginCredentials) => {
    const response = await apiClient.post("/accounts/login", credentials);
    const { token, role, message } = response.data;

    const userData: UserData = {
        email: credentials.email,
        role,
        token,
    };

    useAuthStore.getState().setUserData(userData);

    return message;
};
