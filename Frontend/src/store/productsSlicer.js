// redux/productsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    searchActive: false, // <-- New flag
  },
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
      state.searchActive = true;
    },
    loadAllProducts: (state, action) => {
      state.items = action.payload;
      state.searchActive = false;
    },
    clearSearch: (state) => {
      state.searchActive = false;
    }
  },
});

export const { setProducts,clearSearch,loadAllProducts } = productsSlice.actions;

export default productsSlice.reducer;
