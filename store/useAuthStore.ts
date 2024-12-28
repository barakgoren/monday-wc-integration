import { create } from 'zustand';

interface AuthState {
    user: { name: string } | null;
    token: string | null;
    login: (user: { name: string }) => void;
    checkToken: () => void;
    setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,
    login: (user) => {
        set({ user });
    },
    setToken: (token) => {
        localStorage.setItem('token', token);
        set({ token });
    },
    checkToken: () => {
        const token = localStorage.getItem('token');
        set({ token });
    },
}));