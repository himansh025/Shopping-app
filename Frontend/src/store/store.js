import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // Uses localStorage
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import wishReducer from "./wishlistSlice.js";
import authReducer from './authSlicer.js'

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  wishlist: wishReducer,
  auth:authReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ✅ Fix the error
    }),
});

export const persistor = persistStore(store);
