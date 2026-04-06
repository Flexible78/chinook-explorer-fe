import { apiClient } from "./api-client";
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
        role: role,
        token: token,
    };

    useAuthStore.getState().setUserData(userData);

    return message;
};