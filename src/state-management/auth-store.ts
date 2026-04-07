// src/state-management/auth-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware"; // 1. Импортируем магию памяти

export interface UserData {
    email: string;
    role: string;
    token: string;
}

interface AuthStore {
    userData: UserData | null;
    token: string | null;
    role: string | null;
    setUserData: (userData: UserData) => void;
    logout: () => void;
}

// 2. Оборачиваем весь стор в persist(...)
export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            userData: null,
            token: null,
            role: null,
            setUserData: (userData) => set({
                userData,
                token: userData.token,
                role: userData.role,
            }),
            logout: () => {
                set({ userData: null, token: null, role: null });
                localStorage.removeItem("auth-storage"); // На всякий случай чистим руками
            },
        }),
        {
            name: "auth-storage", // Имя ключа в браузере
        }
    )
);