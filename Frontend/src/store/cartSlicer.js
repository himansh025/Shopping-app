import { createSlice } from "@reduxjs/toolkit";

const cartSlicer = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      if (!state.find((item) => item.id === action.payload._id)) {
        state.push(action.payload);        
      }
    },
    removeFromCart: (state, action) => {
      return state.filter((item) => item._id !== action.payload);
    },
    setToCart: (state, action) => {
      return action.payload;
    },

  },
});

export const { addToCart, removeFromCart,setToCart } = cartSlicer.actions;
export default cartSlicer.reducer;
