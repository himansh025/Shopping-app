// redux/productsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
  },
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload; // for initial loading
    },
    addProduct: (state, action) => {
      state.items.push(action.payload); // add new product
    },
    updateProduct: (state, action) => {
      const index = state.items.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload; // update existing product
      }
    },
    removeProduct: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload); // remove by id
    },
  },
});

export const { setProducts, addProduct, updateProduct, removeProduct } = productsSlice.actions;

export default productsSlice.reducer;
