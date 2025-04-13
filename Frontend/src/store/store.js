import { configureStore } from "@reduxjs/toolkit";
import wishReducer from "./wishlistSlice";
import authReducer from './authSlicer';
import productsReducer from './productsSlicer';
import cartReducer from './cartSlicer';

const store = configureStore({
  reducer: {
    wishlist: wishReducer,
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
  },
});

export default store;
