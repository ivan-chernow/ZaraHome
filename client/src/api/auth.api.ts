import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginRequest, RegistrationRequest, VerifyCodeRequest, CompleteRegistrationRequest, PasswordResetRequest, ResetPasswordRequest } from './types/auth.types';
import { RootState } from '@/store/store';

export interface User {
    id: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
    permissions?: string[];
}

export interface LoginResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface RefreshResponse {
    accessToken: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

const baseQuery = fetchBaseQuery({
        baseUrl: 'http://localhost:3001',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.accessToken;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
        credentials: 'include',
});

export const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        try {
            const refreshResult = await api.dispatch(authApi.endpoints.refresh.initiate());

            if (refreshResult.data) {
                api.dispatch({
                    type: 'auth/setCredentials',
                    payload: refreshResult.data
                });

                // Повторяем исходный запрос с новым токеном
                result = await baseQuery(args, api, extraOptions);
            } else {
                // Если refresh не удался, выходим из системы
                api.dispatch({
                    type: 'auth/logout'
                });
            }
        } catch {
            // Если произошла ошибка при обновлении токена, выходим из системы
            api.dispatch({
                type: 'auth/logout'
            });
        }
    }

    return result;
};

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Auth'],
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
                credentials: 'include',
            }),
            invalidatesTags: ['Auth'],
        }),

        refresh: builder.mutation<RefreshResponse, void>({
            query: () => ({
                url: '/auth/refresh',
                method: 'POST',
                credentials: 'include',
            }),
        }),

        changePassword: builder.mutation<{ success: boolean; message: string }, ChangePasswordRequest>({
            query: (data) => ({
                url: '/user/change-password',
                method: 'PATCH',
                body: data,
            }),
        }),

        initiateRegistration: builder.mutation<{ success: boolean; message: string }, RegistrationRequest>({
            query: (data) => ({
                url: '/auth/registration/initiate',
                method: 'POST',
                body: data,
            }),
        }),

        verifyCode: builder.mutation<{ success: boolean; sessionToken: string }, VerifyCodeRequest>({
            query: (data) => ({
                url: '/auth/registration/verify-code',
                method: 'POST',
                body: data,
            }),
        }),

        completeRegistration: builder.mutation<{ success: boolean; userId: string }, CompleteRegistrationRequest>({
            query: (data) => ({
                url: '/auth/registration/complete',
                method: 'POST',
                body: data,
            }),
        }),

        requestPasswordReset: builder.mutation<{ success: boolean; message: string }, PasswordResetRequest>({
            query: (data) => ({
                url: '/auth/reset-password/request',
                method: 'POST',
                body: data,
            }),
        }),

        verifyResetToken: builder.mutation<{ success: boolean }, { token: string }>({
            query: (data) => ({
                url: '/auth/reset-password/verify',
                method: 'POST',
                body: data,
            }),
        }),

        resetPassword: builder.mutation<{ success: boolean; message: string }, ResetPasswordRequest>({
            query: (data) => ({
                url: '/auth/reset-password/set',
                method: 'POST',
                body: data,
            }),
        }),

        getUser: builder.query<User, void>({
            query: () => '/user/profile',
            providesTags: ['Auth'],
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useInitiateRegistrationMutation,
    useVerifyCodeMutation,
    useCompleteRegistrationMutation,
    useRequestPasswordResetMutation,
    useVerifyResetTokenMutation,
    useResetPasswordMutation,
    useRefreshMutation,
    useChangePasswordMutation,
    useLazyGetUserQuery,
} = authApi;
