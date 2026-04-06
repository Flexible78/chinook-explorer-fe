// src/state-management/auth-store.ts
import { create } from "zustand";

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
    setAuth: (token: string, role: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    userData: null,
    token: null,
    role: null,
    setUserData: (userData) => set({
        userData,
        token: userData.token,
        role: userData.role,
    }),
    setAuth: (token, role) => set({ token, role }),
    logout: () => set({ userData: null, token: null, role: null }),
}));
