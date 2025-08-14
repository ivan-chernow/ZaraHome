import { createApi } from '@reduxjs/toolkit/query/react';
import { LoginRequest, RegistrationRequest, VerifyCodeRequest, CompleteRegistrationRequest, PasswordResetRequest, ResetPasswordRequest } from './model/auth.types';
import { baseQueryWithReauth } from './baseQueryWithReauth';

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
