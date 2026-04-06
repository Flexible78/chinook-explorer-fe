import axios from "axios";
import { useAuthStore } from "../state-management/auth-store";

// Создаем базового курьера, который знает адрес сервера
export const apiClient = axios.create({
    baseURL: "http://localhost:3000",
});

// Хитрый перехватчик (Interceptor):
// Перед отправкой ЛЮБОГО запроса он проверяет, есть ли токен в "сейфе" (Zustand).
// Если токен есть — он приклеивает его к заголовкам (как Охранник и просил).
apiClient.interceptors.request.use((config) => {
    const user = useAuthStore.getState().user;
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});