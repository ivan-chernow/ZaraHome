import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeliveryAddressDto } from '@/entities/user/model/profile.types';

interface DeliveryState {
  selectedAddress: DeliveryAddressDto | null;
  selectedAddressIndex: number | null;
}

// Получаем сохраненный адрес из localStorage безопасно
const getSavedAddress = (): DeliveryAddressDto | null => {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem('selectedDeliveryAddress');
    const parsed = saved ? JSON.parse(saved) : null;
    if (parsed && typeof parsed === 'object' && 'city' in parsed && 'region' in parsed) {
      return parsed as DeliveryAddressDto;
    }
    return null;
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
