import { createSlice } from '@reduxjs/toolkit';
import { profileApi } from '@/api/profile.api';
import { ProfileDto, ChangeDeliveryAddressDto } from '@/api/types/profile.types';

interface ProfileState {
    data: ProfileDto | null;
    isLoading: boolean;
    error: string | null;
    deliveryAddresses: ChangeDeliveryAddressDto[];
}

const initialState: ProfileState = {
    data: null,
    isLoading: false,
    error: null,
    deliveryAddresses: []
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
       
    },
    extraReducers: (builder) => {
        // Get Profile
        builder
            .addMatcher(profileApi.endpoints.getProfile.matchPending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addMatcher(profileApi.endpoints.getProfile.matchFulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addMatcher(profileApi.endpoints.getProfile.matchRejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Ошибка при загрузке профиля';
            })

        // Change Password
            .addMatcher(profileApi.endpoints.changePassword.matchPending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addMatcher(profileApi.endpoints.changePassword.matchFulfilled, (state) => {
                state.isLoading = false;
            })
            .addMatcher(profileApi.endpoints.changePassword.matchRejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Ошибка при смене пароля';
            })

        // Change Email
            .addMatcher(profileApi.endpoints.changeEmail.matchPending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addMatcher(profileApi.endpoints.changeEmail.matchFulfilled, (state) => {
                state.isLoading = false;
            })
            .addMatcher(profileApi.endpoints.changeEmail.matchRejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Ошибка при смене email';
            })

        // Change Delivery Address
            .addMatcher(profileApi.endpoints.changeDeliveryAddress.matchPending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addMatcher(profileApi.endpoints.changeDeliveryAddress.matchFulfilled, (state) => {
                state.isLoading = false;
            })
            .addMatcher(profileApi.endpoints.changeDeliveryAddress.matchRejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Ошибка при изменении адреса доставки';
            })

        // Get Delivery Addresses
            .addMatcher(profileApi.endpoints.getDeliveryAddresses.matchPending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addMatcher(profileApi.endpoints.getDeliveryAddresses.matchFulfilled, (state, action) => {
                state.isLoading = false;
                state.deliveryAddresses = action.payload;
            })
            .addMatcher(profileApi.endpoints.getDeliveryAddresses.matchRejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Ошибка при загрузке адресов доставки';
            })

        // Add Delivery Address
            .addMatcher(profileApi.endpoints.addDeliveryAddress.matchPending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addMatcher(profileApi.endpoints.addDeliveryAddress.matchFulfilled, (state, action) => {
                state.isLoading = false;
                state.deliveryAddresses.push(action.payload);
            })
            .addMatcher(profileApi.endpoints.addDeliveryAddress.matchRejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Ошибка при добавлении адреса доставки';
            })

        // Update Delivery Address
            .addMatcher(profileApi.endpoints.updateDeliveryAddress.matchPending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addMatcher(profileApi.endpoints.updateDeliveryAddress.matchFulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.deliveryAddresses.findIndex(addr => addr.id === action.payload.id);
                if (index !== -1) {
                    state.deliveryAddresses[index] = action.payload;
                }
            })
            .addMatcher(profileApi.endpoints.updateDeliveryAddress.matchRejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Ошибка при обновлении адреса доставки';
            });
    }
});

export const {  } = profileSlice.actions;
export const profileReducer = profileSlice.reducer;