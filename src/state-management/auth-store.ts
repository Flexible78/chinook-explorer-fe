import { create } from "zustand";

export type UserData = {
    email: string;
    role: string;
    token: string;
};

type AuthStore = {
    user: UserData | null;
    setUserData: (user: UserData) => void;
    resetUserData: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    setUserData: (user) => set({ user }),
    resetUserData: () => set({ user: null }),
}));