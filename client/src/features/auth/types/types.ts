import { User } from '../api/auth.api';

export type View = 'login' | 'signup' | 'resetPassword';

export interface AuthState {
  isOpenAuth: boolean;
  view: View;
  viewPassword: boolean;
  isLoading: boolean;
  error: string | null;
  isAuthenticating: boolean;
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}
export interface ErrorData {
  message?: string;
}
