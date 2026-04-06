import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "@/store/config/configSlice";

export const store = configureStore({
  reducer: {
    filters: filterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const selectFilters = (state: RootState) => state.filters;
export const selectSearchInput = (state: RootState) => state.filters.searchInput;
