// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// export const fetchSubmissions = createAsyncThunk("submissions/fetch", async () => {
//   const res = await axios.get("http://localhost:5000/api/submissions");
//   return res.data;
// });

// export const deleteSubmission = createAsyncThunk("submissions/delete", async (id) => {
//   await axios.delete(`http://localhost:5000/api/submissions/${id}`);
//   return id;
// });

// const submissionSlice = createSlice({
//   name: "submissions",
//   initialState: { data: [], loading: false },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchSubmissions.pending, (state) => { state.loading = true; })
//       .addCase(fetchSubmissions.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = action.payload;
//       })
//       .addCase(deleteSubmission.fulfilled, (state, action) => {
//         state.data = state.data.filter((sub) => sub._id !== action.payload);
//       });
//   },
// });

// export default submissionSlice.reducer;
