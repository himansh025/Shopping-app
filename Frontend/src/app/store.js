import { configureStore } from "@reduxjs/toolkit";
import builderReducer from "../features/page-builder/store/builderSlice";

export const store = configureStore({
  reducer: {
    builder: builderReducer,
  },
});
