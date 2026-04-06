import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type FilterState = {
  searchInput: string;
};

const initialState: FilterState = {
  searchInput: "",
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearchInput(state, action: PayloadAction<string>) {
      state.searchInput = action.payload;
    },
    clearSearchInput(state) {
      state.searchInput = "";
    },
  },
});

export const { setSearchInput, clearSearchInput } = filterSlice.actions;

export default filterSlice.reducer;
