import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeliveryAddressDto } from '@/api/types/profile.types';

interface DeliveryState {
  selectedAddress: DeliveryAddressDto | null;
  selectedAddressIndex: number | null;
}

// Получаем сохраненный адрес из localStorage
const getSavedAddress = () => {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem('selectedDeliveryAddress');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const initialState: DeliveryState = {
  selectedAddress: getSavedAddress(),
  selectedAddressIndex: null,
};

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    setSelectedAddress: (state, action: PayloadAction<{ address: DeliveryAddressDto; index: number }>) => {
      state.selectedAddress = action.payload.address;
      state.selectedAddressIndex = action.payload.index;
      
      // Сохраняем в localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedDeliveryAddress', JSON.stringify(action.payload.address));
      }
    },
    clearSelectedAddress: (state) => {
      state.selectedAddress = null;
      state.selectedAddressIndex = null;
      
      // Удаляем из localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('selectedDeliveryAddress');
      }
    },
  },
});

export const { setSelectedAddress, clearSelectedAddress } = deliverySlice.actions;
export default deliverySlice.reducer;
