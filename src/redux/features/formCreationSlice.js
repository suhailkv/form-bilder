import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AUTH_TOKEN, BACKEND_URL } from "../../utils/const";

// Dynamic token getter
const getToken = () => localStorage.getItem("authToken") || AUTH_TOKEN;
/* --------------------------------------------
   1. FETCH FORM BY ID
--------------------------------------------- */
export const fetchForm = createAsyncThunk(
  "formCreation/fetchForm",
  async (formId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/forms/${formId}?token=${getToken()}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Form not found"
      );
    }
  }
);

/* --------------------------------------------
   2. CREATE NEW FORM (Fixed to send filename only)
--------------------------------------------- */
export const createForm = createAsyncThunk(
  "formCreation/createForm",
  async (payload, { rejectWithValue }) => {
    try {
      // Clean payload: Remove base64 data, keep only filename reference
      const cleanPayload = {
        ...payload,
        bannerImage: payload.bannerImageFilename || null, // Send only filename
      };

      // Remove temporary fields
      delete cleanPayload.bannerImageFilename;

      console.log("Creating form with payload:", cleanPayload);
      const response = await axios.post(
        `${BACKEND_URL}/api/forms?token=${getToken()}`,
        cleanPayload
      );
      return response.data.data;
    } catch (error) {
      console.error("Create form error:", error.response?.data || error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create form"
      );
    }
  }
);

/* --------------------------------------------
   3. UPDATE FORM (Fixed to send filename only)
--------------------------------------------- */
export const updateForm = createAsyncThunk(
  "formCreation/updateForm",
  async ({ formId, payload }, { rejectWithValue }) => {
    try {
      // Clean payload: Remove base64 data, keep only filename reference
      const cleanPayload = {
        ...payload,
        bannerImage: payload.bannerImageFilename || null,
      };

      delete cleanPayload.bannerImageFilename;

      console.log("Updating form with payload:", cleanPayload);
      const response = await axios.put(
        `${BACKEND_URL}/api/forms/${formId}?token=${getToken()}`,
        cleanPayload
      );
      return response.data.data;
    } catch (error) {
      console.error("Update form error:", error.response?.data || error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update form"
      );
    }
  }
);

/* --------------------------------------------
   4. UPLOAD BANNER IMAGE (Fixed response handling)
--------------------------------------------- */
export const uploadBannerImage = createAsyncThunk(
  "formCreation/uploadBannerImage",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(`${BACKEND_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Upload response:", response.data);

      // Handle multiple response formats from backend
      let storedName = null;

      // Format 1: { success: true, files: [{ storedName: "..." }] }
      if (response.data?.files?.length > 0) {
        storedName = response.data.files[0].storedName;
      }
      // Format 2: { success: true, fileName: "uploads/..." }
      else if (response.data?.fileName) {
        storedName = response.data.fileName.replace("uploads/", "");
      }
      // Format 3: { success: true, file: { filename: "..." } }
      else if (response.data?.file?.filename) {
        storedName = response.data.file.filename;
      }

      if (response.data.success && storedName) {
        // Create preview URL for display
        const imageUrl = `${BACKEND_URL}/uploads/temp/${storedName}`;

        return {
          success: true,
          storedName,
          imagePreviewUrl: imageUrl, // URL for display only
        };
      } else {
        return rejectWithValue(
          "Upload failed: No file information returned from server"
        );
      }
    } catch (error) {
      console.error("Upload error:", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Image upload failed"
      );
    }
  }
);

/* --------------------------------------------
   5. DELETE BANNER IMAGE (New thunk)
--------------------------------------------- */
export const deleteBannerImage = createAsyncThunk(
  "formCreation/deleteBannerImage",
  async (filename, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${BACKEND_URL}/api/upload/${filename}?token=${getToken()}`
      );
      return { success: true };
    } catch (error) {
      console.error("Delete banner error:", error);
      // Non-critical error - file might already be deleted
      return { success: true }; // Still return success to clear frontend state
    }
  }
);

export const publishForm = createAsyncThunk(
  "formCreation/publishForm",
  async (formId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/forms/${formId}/publish?token=${getToken()}`
      );

      // Return the full response data
      return {
        success: true,
        formToken:
          response.data?.formToken || response.data?.data?.formToken || formId,
        ...response.data,
      };
    } catch (error) {
      console.error("Publish error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to publish form"
      );
    }
  }
);
/* --------------------------------------------
   6. INITIAL STATE
--------------------------------------------- */
const initialState = {
  schema: {
    title: "",
    description: "",
    fields: [],
    thankYouMessage: "",
    bannerImage: null, // Stores filename only (not base64)
    bannerImageFilename: null, // Temp storage for filename
    emailVerification: true,
  },
  undoStack: [],
  redoStack: [],
  showPreview: false,
  focusedQuestion: null,
  menuAnchor: null,
  menuQuestionId: null,
  mobileMenuOpen: false,
  conditionalLogicOpen: null,
  draggedId: null,

  loading: false,
  error: null,

  // Banner image states
  loadingBannerImage: false,
  bannerImageError: null,
  bannerImagePreviewUrl: null, // For displaying image preview
};

/* --------------------------------------------
   7. SLICE
--------------------------------------------- */
const formCreationSlice = createSlice({
  name: "formCreation",
  initialState,
  reducers: {
    setSchema: (state, action) => {
      state.schema = action.payload;
    },
    setUndoStack: (state, action) => {
      state.undoStack = action.payload;
    },
    setRedoStack: (state, action) => {
      state.redoStack = action.payload;
    },
    setShowPreview: (state, action) => {
      state.showPreview = action.payload;
    },
    setFocusedQuestion: (state, action) => {
      state.focusedQuestion = action.payload;
    },
    setMenuAnchor: (state, action) => {
      state.menuAnchor = action.payload;
    },
    setMenuQuestionId: (state, action) => {
      state.menuQuestionId = action.payload;
    },
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },
    setConditionalLogicOpen: (state, action) => {
      state.conditionalLogicOpen = action.payload;
    },
    setDraggedId: (state, action) => {
      state.draggedId = action.payload;
    },
    setEmailVerification: (state, action) => {
      state.schema.emailVerification = action.payload;
    },
    removeBannerImage: (state) => {
      state.schema.bannerImage = null;
      state.schema.bannerImageFilename = null;
      state.bannerImagePreviewUrl = null;
      state.bannerImageError = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearBannerError: (state) => {
      state.bannerImageError = null;
    },
    resetSchema: (state) => {
      state.schema = initialState.schema;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---- FETCH FORM ---- */
      .addCase(fetchForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForm.fulfilled, (state, action) => {
        state.loading = false;
        state.schema = {
          ...initialState.schema,
          ...action.payload?.schema,
          // fields: action.payload?.fields || [],
          // bannerImageFilename: action.payload?.bannerImage || null,
        };

        // Set preview URL if banner exists
        if (action.payload?.bannerImage) {
          state.bannerImagePreviewUrl = `${BACKEND_URL}/uploads/temp/${action.payload.bannerImage}`;
        }
      })
      .addCase(fetchForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.schema = initialState.schema;
      })

      /* ---- CREATE FORM ---- */
      .addCase(createForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createForm.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // state.schema = {
        //   ...initialState.schema,
        //   ...action.payload,
        //   // fields: action.payload?.fields ||,
        //   bannerImageFilename: action.payload?.bannerImage || null,
        // };

        // Set preview URL if banner exists
        if (action.payload?.bannerImage) {
          state.bannerImagePreviewUrl = `${BACKEND_URL}/uploads/temp/${action.payload.bannerImage}`;
        }
      })
      .addCase(createForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---- UPDATE FORM ---- */
      .addCase(updateForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateForm.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // state.schema = {
        //   ...initialState.schema,
        //   ...action.payload,
        //   // fields: action.payload?.fields || [],
        //   // bannerImageFilename: action.payload?.bannerImage || null,
        // };

        if (action.payload?.bannerImage) {
          state.bannerImagePreviewUrl = `${BACKEND_URL}/uploads/temp/${action.payload.bannerImage}`;
        }
      })
      .addCase(updateForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---- UPLOAD BANNER ---- */
      .addCase(uploadBannerImage.pending, (state) => {
        state.loadingBannerImage = true;
        state.bannerImageError = null;
      })
      .addCase(uploadBannerImage.fulfilled, (state, action) => {
        state.loadingBannerImage = false;
        state.bannerImageError = null;

        if (action.payload.success) {
          // Store filename for form submission
          state.schema.bannerImageFilename = action.payload.storedName;
          // Store preview URL for display
          state.bannerImagePreviewUrl = action.payload.imagePreviewUrl;
        }
      })
      .addCase(uploadBannerImage.rejected, (state, action) => {
        state.loadingBannerImage = false;
        state.bannerImageError = action.payload || "Banner upload failed";
      })

      /* ---- DELETE BANNER ---- */
      .addCase(deleteBannerImage.pending, (state) => {
        state.loadingBannerImage = true;
      })
      .addCase(deleteBannerImage.fulfilled, (state) => {
        state.loadingBannerImage = false;
        state.schema.bannerImage = null;
        state.schema.bannerImageFilename = null;
        state.bannerImagePreviewUrl = null;
        state.bannerImageError = null;
      })
      .addCase(deleteBannerImage.rejected, (state) => {
        state.loadingBannerImage = false;
        // Still clear the image even if delete failed
        state.schema.bannerImage = null;
        state.schema.bannerImageFilename = null;
        state.bannerImagePreviewUrl = null;
      })
      /* ---- PUBLISH FORM ---- */
      .addCase(publishForm.pending, (state) => {
        state.loading = true;
      })
      .addCase(publishForm.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(publishForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

/* --------------------------------------------
   8. EXPORTS
--------------------------------------------- */
export const {
  setSchema,
  setUndoStack,
  setRedoStack,
  setShowPreview,
  setFocusedQuestion,
  setMenuAnchor,
  setMenuQuestionId,
  setMobileMenuOpen,
  setConditionalLogicOpen,
  setDraggedId,
  setEmailVerification,
  removeBannerImage,
  clearError,
  clearBannerError,
  resetSchema
} = formCreationSlice.actions;

export default formCreationSlice.reducer;
