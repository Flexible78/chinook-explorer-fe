import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthData {
    email: string;
    role: string;
    token: string;
}

interface AuthStore {
    email: string | null;
    token: string | null;
    role: string | null;
    setAuth: (authData: AuthData) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            email: null,
            token: null,
            role: null,
            setAuth: (authData) => set({
                email: authData.email,
                token: authData.token,
                role: authData.role,
            }),
            logout: () => set({ email: null, token: null, role: null }),
        }),
        {
            name: "auth-storage",
        }
    )
);
