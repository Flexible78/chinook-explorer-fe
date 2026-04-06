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

// Вот она, та самая строчка, которую искал сервер: export const useAuthStore
export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    setUserData: (user) => set({ user }),
    resetUserData: () => set({ user: null }),
}));