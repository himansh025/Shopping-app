// redux/productsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    searchActive: false,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  },
  reducers: {
    setLoading: (state) => {
      state.status = 'loading';
    },
    setProducts: (state, action) => {
      state.items = action.payload;
      state.searchActive = true;
      state.status = 'succeeded';
    },
    loadAllProducts: (state, action) => {
      state.items = action.payload;
      state.searchActive = false;
      state.status = 'succeeded';
    },
    clearSearch: (state) => {
      state.searchActive = false;
    }
  },
});

export const { setProducts, clearSearch, loadAllProducts, setLoading } = productsSlice.actions;

export default productsSlice.reducer;
