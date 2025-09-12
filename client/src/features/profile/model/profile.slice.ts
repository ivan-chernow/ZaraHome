import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { profileApi } from '@/entities/user/api/profile.api';
import {
  ProfileDto,
  ChangeDeliveryAddressDto,
} from '@/entities/user/model/profile.types';

type ProfileView =
  | 'my-orders'
  | 'delivery-address'
  | 'change-password'
  | 'change-email';

interface ProfileState {
  activeView: ProfileView;
}

const initialState: ProfileState = {
  activeView: 'my-orders', // SSR-safe
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setActiveView: (state, action: PayloadAction<ProfileView>) => {
      state.activeView = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('profileActiveView', action.payload);
      }
    },
  },
});

export const { setActiveView } = profileSlice.actions;
export default profileSlice.reducer;
