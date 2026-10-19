import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: [],
  reducers: {
    addToWishlist: (state, action) => {
      const payload = action.payload;
      if (!payload) return;
      const pId = (payload._id || payload.id || '').toString();

      const exists = state.some(
        (item) => (item._id || item.id || '').toString() === pId
      );

      if (!exists) {
        state.push({
          ...payload,
          _id: pId,
          id: pId,
        });
      }
    },

    removeFromWishlist: (state, action) => {
      const targetId = (action.payload || '').toString();
      return state.filter(
        (item) => (item._id || item.id || '').toString() !== targetId
      );
    },

    setWishlist: (_state, action) => {
      if (!Array.isArray(action.payload)) return [];
      return action.payload.filter(Boolean).map((item) => {
        const pId = (item._id || item.id || '').toString();
        return {
          ...item,
          _id: pId,
          id: pId,
        };
      });
    },

    clearWishlist: () => {
      return [];
    },
  },
});

export const { addToWishlist, removeFromWishlist, setWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
