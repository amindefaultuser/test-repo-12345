import { create } from "zustand";
import axios, { AxiosError } from "axios";
import api from "../api";

interface AuthResponse {
    token: string;
    message?: string;
}

interface ApiError {
    message: string;
    statusCode?: number;
}

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<AuthResponse>;
    logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),

    login: async (email: string, password: string): Promise<AuthResponse> => {
        try {
            const res = await api.post<AuthResponse>("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            set({ token: res.data.token, isAuthenticated: true });
            return res.data;
        } catch (error) {
            const loginError = error as AxiosError<ApiError>;

            if (axios.isAxiosError(loginError)) {
                console.error("Помилка API:", loginError.response?.data);
                throw new Error(loginError.response?.data?.message || "Incorrect email or password");
            }

            throw new Error("Something went wrong, try again.");
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        set({ token: null, isAuthenticated: false });
    },
}));

export default useAuthStore;
