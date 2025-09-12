import { createSlice } from '@reduxjs/toolkit';
import { promocodesApi } from '@/entities/promocode/api/promocodes.api';

interface AppliedPromocode {
  code: string;
  discount: number;
  finalAmount: number;
}

interface PromocodesState {
  currentPromocode: AppliedPromocode | null;
}

const initialState: PromocodesState = {
  currentPromocode: null,
};

const promocodesSlice = createSlice({
  name: 'promocodes',
  initialState,
  reducers: {
    clearCurrentPromocode: state => {
      state.currentPromocode = null;
    },
  },
  extraReducers: builder => {
    builder
      // Обработка применения промокода
      .addMatcher(
        promocodesApi.endpoints.applyPromocode.matchFulfilled,
        (state, action) => {
          if (action.payload.isValid) {
            state.currentPromocode = {
              code: action.payload.code,
              discount: action.payload.discount,
              finalAmount: action.payload.finalAmount,
            };
          }
        }
      )
      .addMatcher(
        promocodesApi.endpoints.applyPromocode.matchRejected,
        state => {
          state.currentPromocode = null;
        }
      );
  },
});

export const { clearCurrentPromocode } = promocodesSlice.actions;
export default promocodesSlice.reducer;
