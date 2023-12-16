import { createSlice } from "@reduxjs/toolkit";
import fetchApi from "./fetchApi";

const homeSlice = createSlice({
  name: "home",
  initialState: {
    genres: { tv: [], movie: [] },
    data: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApi.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(fetchApi.fulfilled, (state, action) => {
        if (action.meta.arg.includes("genre/tv")) {
          state.genres.tv =action.payload.genres;
        } else if (action.meta.arg.includes("genre/movie")) {
          state.genres.movie = action.payload.genres;
        } else {
          state.status = "Succeeded";
          state.data = action.payload.results;
        }
      })
      .addCase(fetchApi.rejected, (state) => {
        state.status = "Rejected";
      });
  },
});

export default homeSlice.reducer;
