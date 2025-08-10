import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SelectedItem {
  id: string;
  name: string;
  description?: string;
  detailsUrl?: string;
}

const initialState: SelectedItem[] = [];
const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<SelectedItem>) => {
      if (!state.find((item) => item.id === action.payload.id)) {
        state.push(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      return state.filter((item) => item.id !== action.payload);
    },
    clearItems: () => {
      return [];
    },
  },
});

export const { addItem, removeItem, clearItems } = selectedItemsSlice.actions;
export default selectedItemsSlice.reducer;
