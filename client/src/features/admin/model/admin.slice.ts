import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AdminView = 'add-product' | 'change-password' | 'promocodes';

interface AdminState {
  activeView: AdminView;
}

const initialState: AdminState = {
  activeView: 'add-product', // SSR-safe
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdminActiveView: (state, action: PayloadAction<AdminView>) => {
      state.activeView = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('adminActiveView', action.payload);
      }
    },
  },
});

export const { setAdminActiveView } = adminSlice.actions;
export default adminSlice.reducer;
