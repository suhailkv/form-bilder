import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL for API - Update this to match your backend URL
const API_BASE_URL = "http://172.16.3.224:5000/api";
// Alternative: Use localhost if on same machine
// const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  withCredentials: true,
});

// Async thunk to fetch forms list with token
export const fetchFormsList = createAsyncThunk(
  "adminForm/fetchFormsList",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/forms", {
        params: { token }, // Pass token as query parameter
      });
      
      console.log("API Response:", response.data); // Debug log
      
      // API returns { status: "success", message: "OK", data: [...], meta: {...} }
      // Return both data and meta
      return {
        data: response.data.data,
        meta: response.data.meta
      };
    } catch (error) {
      // Better error handling
      console.error("API Error:", error); // Debug log
      
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue("Request timeout - Server is not responding");
      }
      if (error.code === 'ERR_NETWORK') {
        return rejectWithValue("Network error - Cannot connect to server");
      }
      const message =
        error.response?.data?.message || error.message || "Something went wrong";
      return rejectWithValue(message);
    }
  }
);

export const softDeleteForm = createAsyncThunk(
  "adminForm/softDeleteForm",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/forms/${id}`, {
        params: { token },
      });
      // Backend should return { success: true, message: "Deleted successfully" }
      return id; // Return deleted ID to update state
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Delete failed"
      );
    }
  }
);



// Initial state
const initialState = {
  forms: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

// Create slice
const adminFormSlice = createSlice({
  name: "adminForm",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetForms: (state) => {
      state.forms = [];
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch forms list
      .addCase(fetchFormsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFormsList.fulfilled, (state, action) => {
        state.loading = false;
        // The API returns { data: [...], meta: {...} }
        state.forms = action.payload.data || [];
        state.pagination = {
          page: action.payload.meta?.currentPage || 1,
          limit: 10,
          total: action.payload.meta?.totalRecords || 0,
          totalPages: action.payload.meta?.totalPages || 1,
        };
        console.log("Forms stored in Redux:", state.forms); // Debug log
      })
      .addCase(fetchFormsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Redux Error:", action.payload); // Debug log
      })

 .addCase(softDeleteForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(softDeleteForm.fulfilled, (state, action) => {
        state.loading = false;
        // Remove deleted form from state
        state.forms = state.forms.filter((f) => f.id !== action.payload);
        state.pagination.total -= 1;
      })
      .addCase(softDeleteForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


  },
});

// Export actions
export const { clearError, resetForms } = adminFormSlice.actions;

// Export reducer
export default adminFormSlice.reducer;