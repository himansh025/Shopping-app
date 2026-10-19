import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const payload = action.payload;
      if (!payload) return;

      const pId = (payload._id || payload.productId || payload.id || '').toString();
      const pSize = payload.size || '';
      const addQty = Math.max(1, parseInt(payload.quantity, 10) || 1);
      const maxStock = typeof payload.stock === 'number' ? payload.stock : 99;

      const existingIndex = state.findIndex(
        (item) =>
          (item._id || item.productId || item.id || '').toString() === pId &&
          (item.size || '') === pSize
      );

      if (existingIndex > -1) {
        const currentQty = state[existingIndex].quantity || 1;
        state[existingIndex].quantity = Math.min(currentQty + addQty, maxStock);
      } else {
        state.push({
          ...payload,
          _id: pId,
          productId: pId,
          quantity: Math.min(addQty, maxStock),
          size: pSize,
        });
      }
    },

    updateQuantity: (state, action) => {
      const { id, size, quantity } = action.payload;
      const pId = (id || '').toString();
      const pSize = size || '';
      const newQty = parseInt(quantity, 10);

      if (isNaN(newQty) || newQty < 1) return;

      const target = state.find(
        (item) =>
          (item._id || item.productId || item.id || '').toString() === pId &&
          (item.size || '') === pSize
      );

      if (target) {
        const maxStock = typeof target.stock === 'number' ? target.stock : 99;
        target.quantity = Math.min(newQty, maxStock);
      }
    },

    removeFromCart: (state, action) => {
      const payload = action.payload;
      if (!payload) return state;

      // Handle object { id, size } or direct string id
      if (typeof payload === 'object') {
        const pId = (payload.id || payload._id || payload.productId || '').toString();
        const pSize = payload.size;
        return state.filter((item) => {
          const itemId = (item._id || item.productId || item.id || '').toString();
          if (pSize !== undefined) {
            return !(itemId === pId && (item.size || '') === (pSize || ''));
          }
          return itemId !== pId;
        });
      }

      const pId = payload.toString();
      return state.filter(
        (item) => (item._id || item.productId || item.id || '').toString() !== pId
      );
    },

    clearCart: () => {
      return [];
    },

    setToCart: (_state, action) => {
      if (!Array.isArray(action.payload)) return [];
      return action.payload.map((item) => {
        const pId = (item._id || item.productId || item.id || '').toString();
        return {
          ...item,
          _id: pId,
          productId: pId,
          quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
          size: item.size || '',
        };
      });
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart, setToCart } = cartSlice.actions;
export default cartSlice.reducer;
