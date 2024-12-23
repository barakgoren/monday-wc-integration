import { create } from 'zustand';

interface AuthState {
    token: string | null;
    checkToken: () => void;
    setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    setToken: (token) => {
        localStorage.setItem('token', token);
        set({ token });
    },
    checkToken: () => {
        const token = localStorage.getItem('token');
        set({ token });
    },
}));