import { User } from "@/api/auth.api";

export interface ErrorData {
    message: string;
}

export interface AuthState {
    isOpenAuth: boolean;
    view: 'login' | 'signup' | 'resetPassword';
    viewPassword: boolean;
    isLoading: boolean;
    error: string | null;
    isAuthenticating: boolean;
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
}
