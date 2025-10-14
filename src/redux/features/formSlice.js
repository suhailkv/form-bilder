import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const initialState = {
  formLoading: false,
  loading: false,
  formData: {},
  error: null,
  email: "",
  otpSent: false,
  otpVerified: false,
};

// 1️⃣ Fetch form
export const fetchForm = createAsyncThunk("form/fetchForm", async (formId, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/forms/${formId}`, { withCredentials: true });
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});
console.log("fetchForm", fetchForm);
// 2️⃣ Request OTP
export const requestOtp = createAsyncThunk("form/requestOtp", async ({ formId, email }, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/forms/${formId}/request-otp`, { email }, { withCredentials: true });
    return { email, message: res.data.message };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 3️⃣ Verify OTP
export const verifyOtp = createAsyncThunk("form/verifyOtp", async ({ email, otp, formToken }, { rejectWithValue }) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/forms/${formToken}/verify-otp`,
      {
        email,
        otp,
        formToken,
      },
      { withCredentials: true }
    );
    return res.data.message;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 4️⃣ Submit form
export const submitForm = createAsyncThunk("form/submitForm", async ({ formId, email, data }, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/api/submissions/forms/${formId}/submit`, { email, data }, { withCredentials: true });
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
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    resetOtp: (state) => {
      state.otpSent = false;
      state.otpVerified = false;
    },
    setOtpVerified: (state, action) => {
      state.otpVerified = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch form (controls skeleton)
      .addCase(fetchForm.pending, (state) => {
        state.formLoading = true;
        state.error = null;
      })
      .addCase(fetchForm.fulfilled, (state, action) => {
        state.formLoading = false;
        state.formData = action.payload;
      })
      .addCase(fetchForm.rejected, (state, action) => {
        state.formLoading = false;
        state.error = action.payload || "Failed to fetch form";
      })

      // request OTP
      .addCase(requestOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.email = action.payload.email;
        state.otpSent = true;
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpVerified = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // submit form
      .addCase(submitForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitForm.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFormData, setEmail, resetOtp, setOtpVerified, clearError } = formSlice.actions;
export default formSlice.reducer;
