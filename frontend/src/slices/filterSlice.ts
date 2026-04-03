import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type FilterState = {
  searchTerm: string;
};

const initialState: FilterState = {
  searchTerm: "",
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearchInput(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    clearSearchInput(state) {
      state.searchTerm = "";
    },
  },
});

export const { setSearchInput, clearSearchInput } = filterSlice.actions;

export default filterSlice.reducer;
