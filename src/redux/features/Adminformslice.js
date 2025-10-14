import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  timeout: 10000,
  withCredentials: true,
});

// ✅ Fetch forms list (with pagination)
export const fetchFormsList = createAsyncThunk(
  "adminForm/fetchFormsList",
  async ({ token, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/forms", {
        params: { token, page, limit },withCredentials:true
      },);

      console.log("API Response:", response.data);

      return {
        data: response.data.data,
        meta: response.data.meta,
      };
    } catch (error) {
      console.error("API Error:", error);
      const message =
        error.response?.data?.message || error.message || "Failed to load forms";
      return rejectWithValue(message);
    }
  }
);

// ✅ Soft delete form
export const softDeleteForm = createAsyncThunk(
  "adminForm/softDeleteForm",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/forms/${id}`, { params: { token } });
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Delete failed"
      );
    }
  }
);

// ✅ Fetch responses for a specific form (WITH ERROR HANDLING)
export const fetchFormResponses = createAsyncThunk(
  "adminForm/fetchFormResponses",
  async ({ formId, token }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/forms/${formId}/submissions`, {
        params: { token },
      });

      console.log("Form Responses API Response:", response.data);

      // ✅ Updated structure
      return {
        answers: response.data.data || [],
        meta: response.data.meta || {},
        schema: response.data.schema || null, // optional
      };
    } catch (error) {
      console.error("Form Responses API Error:", error);
      const message =
        error.response?.data?.message || error.message || "Failed to load responses";
      return rejectWithValue(message);
    }
  }
);

// ✅ Export form responses (NEW)
export const exportFormResponses = createAsyncThunk(
  "adminForm/exportFormResponses",
  async ({ formId, token }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/forms/${formId}/submissions/all`, {
        params: { token },
      });

      console.log("Export API Response:", response.data);

      return {
        data: response.data.data,
        meta: response.data.meta,
      };
    } catch (error) {
      console.error("Export API Error:", error);
      const message =
        error.response?.data?.message || error.message || "Failed to export responses";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  forms: [],
  formResponses: [],
  currentSchema: null,
  exportData: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  loading: false,
  exportLoading: false,
  error: null,
  exportError: null,
};

const adminFormSlice = createSlice({
  name: "adminForm",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.exportError = null;
    },
    resetForms: (state) => {
      state.forms = [];
      state.pagination = initialState.pagination;
    },
    clearExportData: (state) => {
      state.exportData = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch forms
      .addCase(fetchFormsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFormsList.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = action.payload.data || [];
        state.pagination = {
          page: action.payload.meta?.currentPage || 1,
          limit: action.payload.meta?.limit || 10,
          total: action.payload.meta?.totalRecords || 0,
          totalPages: action.payload.meta?.totalPages || 1,
        };
      })
      .addCase(fetchFormsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Soft delete
      .addCase(softDeleteForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(softDeleteForm.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = state.forms.filter((f) => f.id !== action.payload);
        state.pagination.total -= 1;
      })
      .addCase(softDeleteForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch form responses
      .addCase(fetchFormResponses.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.formResponses = [];
      })
      .addCase(fetchFormResponses.fulfilled, (state, action) => {
        state.loading = false;
        state.formResponses = action.payload.answers || [];
        state.currentSchema = action.payload.schema || null;
        state.pagination.total = action.payload.meta?.totalRecords || 0;
      })
      .addCase(fetchFormResponses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Export form responses
      .addCase(exportFormResponses.pending, (state) => {
        state.exportLoading = true;
        state.exportError = null;
      })
      .addCase(exportFormResponses.fulfilled, (state, action) => {
        state.exportLoading = false;
        state.exportData = action.payload.data || [];
      })
      .addCase(exportFormResponses.rejected, (state, action) => {
        state.exportLoading = false;
        state.exportError = action.payload;
      });
  },
});

export const { clearError, resetForms, clearExportData } = adminFormSlice.actions;
export default adminFormSlice.reducer;
