import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: [],
  reducers: {
    addToWishlist: (state, action) => {
      if (!state.find((item) => item.id === action.payload.id)) { 
        state.push(action.payload);

      }
    },
    removeFromWishlist: (state, action) => {
      return state.filter((item) => item._id !== action.payload);
    },
    setWishlist: (state, action) => {
      return action.payload;
    },
  },
});

export const { addToWishlist, removeFromWishlist,setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
