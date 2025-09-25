import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState={
    loading:false,
    formData:{}
}

const API_URL = "http://localhost:5000/goals";
export const fetchForm = createAsyncThunk("form/fetchForm   ", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});


const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
       setFormData: (state, action) => {
      state.formData = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchForm.pending, (state) => { state.loading = true; })
      .addCase(fetchForm.fulfilled, (state, action) => { state.loading = false; state.formData = action.payload.data; })
      .addCase(fetchForm.rejected, (state, action) => { state.loading = false; })    
  }
});

export const { setFormData } = formSlice.actions;
export default formSlice.reducer
