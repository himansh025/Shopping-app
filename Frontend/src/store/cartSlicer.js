import { createSlice } from "@reduxjs/toolkit";

const cartSlicer = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      if (!state.find((item) => item.id === action.payload._id)) {
        // console.log(action.payload,"item");
        state.push(action.payload);
        // console.log(state.wishlist);
        
      }
    },
    removeFromCart: (state, action) => {
      return state.filter((item) => item._id !== action.payload);
    },
  },
});

export const { addToCart, removeFromCart } = cartSlicer.actions;
export default cartSlicer.reducer;
