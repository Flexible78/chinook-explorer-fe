// src/state-management/auth-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

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

// Persist auth state so the session survives page refreshes.
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
                localStorage.removeItem("auth-storage");
            },
        }),
        {
            name: "auth-storage",
        }
    )
);
