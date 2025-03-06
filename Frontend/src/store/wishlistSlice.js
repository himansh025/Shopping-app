import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: [],
  reducers: {
    addToWishlist: (state, action) => {
      if (!state.find((item) => item.id === action.payload.id)) {
        console.log(action.payload,"item");
        
        state.push(action.payload);
        // console.log(state.wishlist);
        
      }
    },
    removeFromWishlist: (state, action) => {
      return state.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
