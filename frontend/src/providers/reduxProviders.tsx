"use client";

import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "@/slices/filterSlice";
import { Provider } from "react-redux";
import { ReactNode } from "react";
    
export const store = configureStore({
  reducer: {
    filters: filterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default function ReduxProviders({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
