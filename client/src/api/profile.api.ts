import { createApi } from '@reduxjs/toolkit/query/react';
import { ProfileDto, ChangePasswordDto, ChangeDeliveryAddressDto, DeliveryAddressDto, UpdateProfileDto } from './types/profile.types';
import { baseQueryWithReauth } from './auth.api';

export const profileApi = createApi({
    reducerPath: 'profileApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Profile', 'DeliveryAddress'],
    endpoints: (builder) => ({
        getProfile: builder.query<ProfileDto, void>({
            query: () => ({
                url: '/user/profile',
                method: 'GET',
            }),
            providesTags: ['Profile'],
        }),
        updateProfile: builder.mutation<void, UpdateProfileDto>({
            query: (dto) => ({
                url: '/user/profile',
                method: 'PATCH',
                body: dto,
            }),
            invalidatesTags: ['Profile'],
        }),
        changePassword: builder.mutation<void, ChangePasswordDto>({
            query: (dto) => ({
                url: '/user/change-password',
                method: 'PATCH',
                body: dto,
            }),
        }),
        changeEmail: builder.mutation<{ message: string }, { newEmail: string }>({
            query: (data) => ({
                url: '/user/change-email',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Profile'],
        }),
        changeDeliveryAddress: builder.mutation<{ message: string }, ChangeDeliveryAddressDto>({
            query: (data) => ({
                url: '/user/change-delivery-address',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Profile'],
        }),
        getDeliveryAddresses: builder.query<DeliveryAddressDto[], void>({
            query: () => ({
                url: '/user/delivery-addresses',
                method: 'GET',
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'DeliveryAddress' as const, id })),
                        { type: 'DeliveryAddress', id: 'LIST' },
                    ]
                    : [{ type: 'DeliveryAddress', id: 'LIST' }],
        }),
        addDeliveryAddress: builder.mutation<DeliveryAddressDto, ChangeDeliveryAddressDto>({
            query: (address) => ({
                url: '/user/delivery-addresses',
                method: 'POST',
                body: address,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            invalidatesTags: [{ type: 'DeliveryAddress', id: 'LIST' }],
        }),
        updateDeliveryAddress: builder.mutation<DeliveryAddressDto, { id: number; address: ChangeDeliveryAddressDto }>({
            query: ({ id, address }) => ({
                url: `/user/delivery-addresses/${id}`,
                method: 'PUT',
                body: address,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'DeliveryAddress', id },
                { type: 'DeliveryAddress', id: 'LIST' }
            ],
        }),
    }),
});

export const {
    useGetProfileQuery,
    useUpdateProfileMutation,
    useChangePasswordMutation,
    useChangeEmailMutation,
    useChangeDeliveryAddressMutation,
    useGetDeliveryAddressesQuery,
    useAddDeliveryAddressMutation,
    useUpdateDeliveryAddressMutation,
} = profileApi;



