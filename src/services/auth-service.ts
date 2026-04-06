import { apiClient } from "./api-client";
import { UserData, useAuthStore } from "../state-management/auth-store";

// Данные, которые вводит пользователь
export interface LoginCredentials {
    email: string;
    password: string;
}

export const loginUser = async (credentials: LoginCredentials) => {
    // 1. Отправляем запрос на наш Бэкенд
    const response = await apiClient.post("/accounts/login", credentials);

    // 2. Сервер возвращает токен и роль (мы помним это из тестов в Postman)
    const { token, role, message } = response.data;

    // 3. Формируем объект юзера
    const userData: UserData = {
        email: credentials.email,
        role: role,
        token: token,
    };

    // 4. Кладем юзера в "сейф" (Zustand)
    useAuthStore.getState().setUserData(userData);

    return message; // "Login successful"
};