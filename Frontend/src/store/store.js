import { configureStore } from "@reduxjs/toolkit";
import wishlistReducer from "./slices/wishlistSlice";
import authReducer from "./slices/authSlice";
import productsReducer from "./slices/productsSlice";
import cartReducer from "./slices/cartSlice";

export const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
  },
});

export default store;
