import { authApi } from "@/api/auth.api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { AuthState, ErrorData } from "./types/auth.types";
import { User } from "@/api/auth.api";

// Функция для загрузки начального состояния из localStorage
const loadInitialState = (): AuthState => {
  if (typeof window === 'undefined') {
    return {
      isOpenAuth: false,
      view: 'login',
      viewPassword: false,
      isLoading: false,
      error: null,
      isAuthenticating: false,
      user: null,
      accessToken: null,
      isAuthenticated: false,
    };
  }

  const savedState = localStorage.getItem('authState');
  if (savedState) {
    const parsedState = JSON.parse(savedState);
    return {
      ...parsedState,
      isOpenAuth: false,
      view: 'login',
      viewPassword: false,
      isLoading: false,
      error: null,
      isAuthenticating: false,
    };
  }

  return {
    isOpenAuth: false,
    view: 'login',
    viewPassword: false,
    isLoading: false,
    error: null,
    isAuthenticating: false,
    user: null,
    accessToken: null,
    isAuthenticated: false,
  };
};

const initialState: AuthState = loadInitialState();

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    openModalAuth: (state): void => {
      state.isOpenAuth = true;
      state.error = null;
    },
    closeModalAuth: (state): void => {
      state.isOpenAuth = false;
      state.error = null;
    },
    setView: (state, action: PayloadAction<'login' | 'signup' | 'resetPassword'>) => {
      state.view = action.payload;
      state.error = null;
    },
    toggleViewPassword: (state) => {
      state.viewPassword = !state.viewPassword;
    },
    setAuthenticating: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticating = action.payload;
    },
    setCredentials: (state, action: PayloadAction<{ user: User | null; accessToken: string }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.error = null;
      
      // Сохраняем состояние в localStorage
      localStorage.setItem('authState', JSON.stringify({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }));
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Очищаем состояние в localStorage
      localStorage.removeItem('authState');
      localStorage.removeItem('accessToken');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.isOpenAuth = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        
        // Сохраняем состояние в localStorage
        localStorage.setItem('authState', JSON.stringify({
          user: state.user,
          accessToken: state.accessToken,
          isAuthenticated: state.isAuthenticated,
        }));
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = ((action.error as FetchBaseQueryError)?.data as ErrorData)?.message || 'Ошибка при входе';
      })

      // Logout
      .addMatcher(authApi.endpoints.logout.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.isLoading = false;
        state.isOpenAuth = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        
        // Очищаем состояние в localStorage
        localStorage.removeItem('authState');
        localStorage.removeItem('accessToken');
      })
      .addMatcher(authApi.endpoints.logout.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = ((action.error as FetchBaseQueryError)?.data as ErrorData)?.message || 'Ошибка при выходе';
      })

      // Refresh Token
      .addMatcher(authApi.endpoints.refresh.matchFulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        
        // Обновляем состояние в localStorage
        localStorage.setItem('authState', JSON.stringify({
          user: state.user,
          accessToken: state.accessToken,
          isAuthenticated: state.isAuthenticated,
        }));
      })

      // Registration
      .addMatcher(authApi.endpoints.initiateRegistration.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.initiateRegistration.matchFulfilled, (state) => {
        state.isLoading = false;
      })
      .addMatcher(authApi.endpoints.initiateRegistration.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = ((action.error as FetchBaseQueryError)?.data as ErrorData)?.message || 'Ошибка при регистрации';
      })

      // Verify Code
      .addMatcher(authApi.endpoints.verifyCode.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.verifyCode.matchFulfilled, (state) => {
        state.isLoading = false;
      })
      .addMatcher(authApi.endpoints.verifyCode.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = ((action.error as FetchBaseQueryError)?.data as ErrorData)?.message || 'Ошибка при проверке кода';
      })

      // Complete Registration
      .addMatcher(authApi.endpoints.completeRegistration.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.completeRegistration.matchFulfilled, (state) => {
        state.isLoading = false;
        state.isOpenAuth = false;
      })
      .addMatcher(authApi.endpoints.completeRegistration.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = ((action.error as FetchBaseQueryError)?.data as ErrorData)?.message || 'Ошибка при завершении регистрации';
      })

      // Password Reset
      .addMatcher(authApi.endpoints.requestPasswordReset.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.requestPasswordReset.matchFulfilled, (state) => {
        state.isLoading = false;
      })
      .addMatcher(authApi.endpoints.requestPasswordReset.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = ((action.error as FetchBaseQueryError)?.data as ErrorData)?.message || 'Ошибка при запросе сброса пароля';
      })

      // Reset Password
      .addMatcher(authApi.endpoints.resetPassword.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.resetPassword.matchFulfilled, (state) => {
        state.isLoading = false;
        state.isOpenAuth = false;
      })
      .addMatcher(authApi.endpoints.resetPassword.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = ((action.error as FetchBaseQueryError)?.data as ErrorData)?.message || 'Ошибка при сбросе пароля';
      });
  }
});

export const {
  openModalAuth,
  closeModalAuth,
  setView,
  toggleViewPassword,
  setAuthenticating,
  setCredentials,
  logout,
} = authSlice.actions;

export const authReducer = authSlice.reducer;