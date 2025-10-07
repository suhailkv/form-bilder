import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  formData: {},
  error: null,
};

const API_URL = "http://172.16.3.224:5000/form";

// ✅ Fetch form from backend
export const fetchForm = createAsyncThunk(
  "form/fetchForm",
  async (formId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/${formId}`);
      console.log("API Response:", res.data); 
      return res.data.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForm.fulfilled, (state, action) => {
        state.loading = false;
        state.formData = action.payload;
      })
      .addCase(fetchForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch form";
        console.error("Fetch form error:", action.payload);
      });
  },
});

export const { setFormData } = formSlice.actions;
export default formSlice.reducer;
