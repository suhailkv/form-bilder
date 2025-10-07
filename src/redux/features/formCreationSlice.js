// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// const API_URL = "http://localhost:3000/api";

// // API call to fetch form data
// export const fetchFormData = createAsyncThunk(
//   "formCreation/fetchFormData",
//   async (formId, { rejectWithValue }) => {
//     try {
//       if (!formId) {
//         // Return default empty schema if no ID
//         return {
//           title: "",
//           description: "",
//           fields: [],
//           thankYouMessage: "",
//           bannerImage: "",
//         };
//       }

//       // Replace with your actual API endpoint
//       const response = await fetch(`${API_URL}/form/${formId}`);
      
//       if (!response.ok) {
//         throw new Error("Failed to fetch form data");
//       }
      
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // API call to save form data
// export const saveFormData = createAsyncThunk(
//   "formCreation/saveFormData",
//   async (formData, { rejectWithValue }) => {
//     try {
//       // Replace with your actual API endpoint
//       const response = await fetch(`${API_URL}/form`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });
      
//       if (!response.ok) {
//         throw new Error("Failed to save form data");
//       }
      
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const formCreationSlice = createSlice({
//   name: "formCreation",
//   initialState: {
//     schema: {
//       title: "",
//       description: "",
//       fields: [],
//       thankYouMessage: "",
//       bannerImage: "",
//     },
//     undoStack: [],
//     redoStack: [],
//     activeTab: 0,
//     showPreview: false,
//     loading: false,
//     error: null,
//     saveStatus: "idle", // idle | loading | succeeded | failed
//   },
//   reducers: {
//     setSchema: (state, action) => {
//       // Push current schema to undo stack before updating
//       state.undoStack.push(JSON.parse(JSON.stringify(state.schema)));
//       state.redoStack = [];
//       state.schema = action.payload;
//     },
    
//     updateFields: (state, action) => {
//       state.undoStack.push(JSON.parse(JSON.stringify(state.schema)));
//       state.redoStack = [];
//       state.schema.fields = action.payload.fields;
//       state.schema.thankYouMessage = action.payload.thankYouMessage;
//     },
    
//     updateTitle: (state, action) => {
//       state.schema.title = action.payload;
//     },
    
//     updateDescription: (state, action) => {
//       state.schema.description = action.payload;
//     },
    
//     updateThankYouMessage: (state, action) => {
//       state.schema.thankYouMessage = action.payload;
//     },
    
//     updateBannerImage: (state, action) => {
//       state.undoStack.push(JSON.parse(JSON.stringify(state.schema)));
//       state.redoStack = [];
//       state.schema.bannerImage = action.payload;
//     },
    
//     undo: (state) => {
//       if (state.undoStack.length === 0) return;
      
//       const previous = state.undoStack[state.undoStack.length - 1];
//       state.redoStack.unshift(JSON.parse(JSON.stringify(state.schema)));
//       state.undoStack = state.undoStack.slice(0, -1);
//       state.schema = previous;
//     },
    
//     redo: (state) => {
//       if (state.redoStack.length === 0) return;
      
//       const next = state.redoStack[0];
//       state.undoStack.push(JSON.parse(JSON.stringify(state.schema)));
//       state.redoStack = state.redoStack.slice(1);
//       state.schema = next;
//     },
    
//     setActiveTab: (state, action) => {
//       state.activeTab = action.payload;
//     },
    
//     togglePreview: (state) => {
//       state.showPreview = !state.showPreview;
//     },
    
//     resetSaveStatus: (state) => {
//       state.saveStatus = "idle";
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch form data
//       .addCase(fetchFormData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchFormData.fulfilled, (state, action) => {
//         state.loading = false;
//         state.schema = action.payload;
//         state.undoStack = [];
//         state.redoStack = [];
//       })
//       .addCase(fetchFormData.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Save form data
//       .addCase(saveFormData.pending, (state) => {
//         state.saveStatus = "loading";
//         state.error = null;
//       })
//       .addCase(saveFormData.fulfilled, (state) => {
//         state.saveStatus = "succeeded";
//       })
//       .addCase(saveFormData.rejected, (state, action) => {
//         state.saveStatus = "failed";
//         state.error = action.payload;
//       });
//   },
// });

// export const {
//   setSchema,
//   updateFields,
//   updateTitle,
//   updateDescription,
//   updateThankYouMessage,
//   updateBannerImage,
//   undo,
//   redo,
//   setActiveTab,
//   togglePreview,
//   resetSaveStatus,
// } = formCreationSlice.actions;

// export default formCreationSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// const initialState = {
//   schema: {
//     title: "",
//     description: "",
//     fields: [],
//     thankYouMessage: "",
//     bannerImage: "",
//   },
//   undoStack: [],
//   redoStack: [],
//   showPreview: false,
//   focusedQuestion: null,
//   menuAnchor: null,
//   menuQuestionId: null,
//   mobileMenuOpen: false,
//   conditionalLogicOpen: null,
//   draggedId: null,
//   uploadError: null,
//   loading: false,
//   error: null,
// };

// export const fetchForm = createAsyncThunk(
//   "formCreation/fetchForm",
//   async (formId, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`http://172.16.3.210:5000/api/forms/${formId}`);
//       if (!response.ok) {
//         throw new Error("Form not found");
//       }
//       const data = await response.json();
//       return data.data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const createForm = createAsyncThunk(
//   "formCreation/createForm",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const response = await fetch("http://172.16.3.210:5000/api/forms", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to create form");
//       }
//       const data = await response.json();
//       return data.data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const formCreationSlice = createSlice({
//   name: "formCreation",
//   initialState,
//   reducers: {
//     setSchema: (state, action) => {
//       state.schema = action.payload;
//     },
//     setUndoStack: (state, action) => {
//       state.undoStack = action.payload;
//     },
//     setRedoStack: (state, action) => {
//       state.redoStack = action.payload;
//     },
//     setShowPreview: (state, action) => {
//       state.showPreview = action.payload;
//     },
//     setFocusedQuestion: (state, action) => {
//       state.focusedQuestion = action.payload;
//     },
//     setMenuAnchor: (state, action) => {
//       state.menuAnchor = action.payload;
//     },
//     setMenuQuestionId: (state, action) => {
//       state.menuQuestionId = action.payload;
//     },
//     setMobileMenuOpen: (state, action) => {
//       state.mobileMenuOpen = action.payload;
//     },
//     setConditionalLogicOpen: (state, action) => {
//       state.conditionalLogicOpen = action.payload;
//     },
//     setDraggedId: (state, action) => {
//       state.draggedId = action.payload;
//     },
//     setUploadError: (state, action) => {
//       state.uploadError = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchForm.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchForm.fulfilled, (state, action) => {
//         state.loading = false;
//         state.schema = action.payload;
//       })
//       .addCase(fetchForm.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(createForm.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createForm.fulfilled, (state, action) => {
//         state.loading = false;
//         state.schema = action.payload;
//       })
//       .addCase(createForm.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const {
//   setSchema,
//   setUndoStack,
//   setRedoStack,
//   setShowPreview,
//   setFocusedQuestion,
//   setMenuAnchor,
//   setMenuQuestionId,
//   setMobileMenuOpen,
//   setConditionalLogicOpen,
//   setDraggedId,
//   setUploadError,
// } = formCreationSlice.actions;

// export default formCreationSlice.reducer;





// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// export const fetchForm = createAsyncThunk(
//   "formCreation/fetchForm",
//   async (formId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`http://172.16.3.210:5000/api/forms/${formId}`);
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || error.message || "Form not found"
//       );
//     }
//   }
// );

// export const createForm = createAsyncThunk(
//   "formCreation/createForm",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const response = await axios.post("http://172.16.3.210:5000/api/forms", payload);
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || error.message || "Failed to create form"
//       );
//     }
//   }
// );

// // (Your existing initial state stays the same)
// const initialState = {
//   schema: { title: "", description: "", fields: [], thankYouMessage: "", bannerImage: null },
//   undoStack: [],
//   redoStack: [],
//   showPreview: false,
//   focusedQuestion: null,
//   menuAnchor: null,
//   menuQuestionId: null,
//   mobileMenuOpen: false,
//   conditionalLogicOpen: null,
//   draggedId: null,
//   uploadError: null,
//   loading: false,
//   error: null,
// };

// const formCreationSlice = createSlice({
//   name: "formCreation",
//   initialState,
//   reducers: {
//     setSchema: (state, action) => { state.schema = action.payload; },
//     setUndoStack: (state, action) => { state.undoStack = action.payload; },
//     setRedoStack: (state, action) => { state.redoStack = action.payload; },
//     setShowPreview: (state, action) => { state.showPreview = action.payload; },
//     setFocusedQuestion: (state, action) => { state.focusedQuestion = action.payload; },
//     setMenuAnchor: (state, action) => { state.menuAnchor = action.payload; },
//     setMenuQuestionId: (state, action) => { state.menuQuestionId = action.payload; },
//     setMobileMenuOpen: (state, action) => { state.mobileMenuOpen = action.payload; },
//     setConditionalLogicOpen: (state, action) => { state.conditionalLogicOpen = action.payload; },
//     setDraggedId: (state, action) => { state.draggedId = action.payload; },
//     setUploadError: (state, action) => { state.uploadError = action.payload; },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchForm.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchForm.fulfilled, (state, action) => {
//         state.loading = false;
//         state.schema = action.payload;
//       })
//       .addCase(fetchForm.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(createForm.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createForm.fulfilled, (state, action) => {
//         state.loading = false;
//         state.schema = action.payload;
//       })
//       .addCase(createForm.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const {
//   setSchema,
//   setUndoStack,
//   setRedoStack,
//   setShowPreview,
//   setFocusedQuestion,
//   setMenuAnchor,
//   setMenuQuestionId,
//   setMobileMenuOpen,
//   setConditionalLogicOpen,
//   setDraggedId,
//   setUploadError,
// } = formCreationSlice.actions;

// export default formCreationSlice.reducer;




// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// export const fetchForm = createAsyncThunk(
//   "formCreation/fetchForm",
//   async (formId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`http://172.16.3.210:5000/api/forms/${formId}`);
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || error.message || "Form not found"
//       );
//     }
//   }
// );

// export const createForm = createAsyncThunk(
//   "formCreation/createForm",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const response = await axios.post("http://172.16.3.210:5000/api/forms", payload);
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || error.message || "Failed to create form"
//       );
//     }
//   }
// );

// // Updated initial state with emailVerification
// const initialState = {
//   schema: { 
//     title: "", 
//     description: "", 
//     fields: [], 
//     thankYouMessage: "", 
//     bannerImage: null,
//     emailVerification: false // Added emailVerification field
//   },
//   undoStack: [],
//   redoStack: [],
//   showPreview: false,
//   focusedQuestion: null,
//   menuAnchor: null,
//   menuQuestionId: null,
//   mobileMenuOpen: false,
//   conditionalLogicOpen: null,
//   draggedId: null,
//   uploadError: null,
//   loading: false,
//   error: null,
// };

// const formCreationSlice = createSlice({
//   name: "formCreation",
//   initialState,
//   reducers: {
//     setSchema: (state, action) => { state.schema = action.payload; },
//     setUndoStack: (state, action) => { state.undoStack = action.payload; },
//     setRedoStack: (state, action) => { state.redoStack = action.payload; },
//     setShowPreview: (state, action) => { state.showPreview = action.payload; },
//     setFocusedQuestion: (state, action) => { state.focusedQuestion = action.payload; },
//     setMenuAnchor: (state, action) => { state.menuAnchor = action.payload; },
//     setMenuQuestionId: (state, action) => { state.menuQuestionId = action.payload; },
//     setMobileMenuOpen: (state, action) => { state.mobileMenuOpen = action.payload; },
//     setConditionalLogicOpen: (state, action) => { state.conditionalLogicOpen = action.payload; },
//     setDraggedId: (state, action) => { state.draggedId = action.payload; },
//     setUploadError: (state, action) => { state.uploadError = action.payload; },
  
//     setEmailVerification: (state, action) => { 
//       state.schema.emailVerification = action.payload; 
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchForm.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchForm.fulfilled, (state, action) => {
//         state.loading = false;
//         state.schema = action.payload;
//       })
//       .addCase(fetchForm.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(createForm.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createForm.fulfilled, (state, action) => {
//         state.loading = false;
//         state.schema = action.payload;
//       })
//       .addCase(createForm.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const {
//   setSchema,
//   setUndoStack,
//   setRedoStack,
//   setShowPreview,
//   setFocusedQuestion,
//   setMenuAnchor,
//   setMenuQuestionId,
//   setMobileMenuOpen,
//   setConditionalLogicOpen,
//   setDraggedId,
//   setUploadError,
//   setEmailVerification, // Export the new action
// } = formCreationSlice.actions;

// export default formCreationSlice.reducer;





// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// export const fetchForm = createAsyncThunk(
//   "formCreation/fetchForm",
//   async (formId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`http://172.16.3.210:5000/api/forms/${formId}`);
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || error.message || "Form not found"
//       );
//     }
//   }
// );

// export const createForm = createAsyncThunk(
//   "formCreation/createForm",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const response = await axios.post("http://172.16.3.210:5000/api/forms", payload);
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || error.message || "Failed to create form"
//       );
//     }
//   }
// );

// export const publishForm  = createAsyncThunk(
//   "formCreation/publishForm",
//   async(formId, {rejectWithValue})=>{
//     try {
//       const response = await axios.post (`http://172.16.3.209:5000/api/forms/${formId}/publish`)
//       return response.data.data
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || error.message || "Failed to publish form"
//       )
//     }
//   }
// )

// export const uploadFile  =  createAsyncThunk(
//   "formCreation/uploadFile",
//   async (_, {rejectWithValue})=>{
//     try {
//       const response = await axios.post("http://172.16.3.209:5000/api/upload")
//       return response.data.data
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || error.message || "Failed to upload file"
//       )
//     }
//   }
// )
// // Updated initial state with emailVerification
// const initialState = {
//   schema: { 
//     title: "", 
//     description: "", 
//     fields: [], 
//     thankYouMessage: "", 
//     bannerImage: null,
//     emailVerification: false 
//   },
//   undoStack: [],
//   redoStack: [],
//   showPreview: false,
//   focusedQuestion: null,
//   menuAnchor: null,
//   menuQuestionId: null,
//   mobileMenuOpen: false,
//   conditionalLogicOpen: null,
//   draggedId: null,
//   uploadError: null,
//   loading: false,
//   error: null,
// };

// const formCreationSlice = createSlice({
//   name: "formCreation",
//   initialState,
//   reducers: {
//     setSchema: (state, action) => { state.schema = action.payload; },
//     setUndoStack: (state, action) => { state.undoStack = action.payload; },
//     setRedoStack: (state, action) => { state.redoStack = action.payload; },
//     setShowPreview: (state, action) => { state.showPreview = action.payload; },
//     setFocusedQuestion: (state, action) => { state.focusedQuestion = action.payload; },
//     setMenuAnchor: (state, action) => { state.menuAnchor = action.payload; },
//     setMenuQuestionId: (state, action) => { state.menuQuestionId = action.payload; },
//     setMobileMenuOpen: (state, action) => { state.mobileMenuOpen = action.payload; },
//     setConditionalLogicOpen: (state, action) => { state.conditionalLogicOpen = action.payload; },
//     setDraggedId: (state, action) => { state.draggedId = action.payload; },
//     setUploadError: (state, action) => { state.uploadError = action.payload; },
  
//     setEmailVerification: (state, action) => { 
//       state.schema.emailVerification = action.payload; 
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchForm.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchForm.fulfilled, (state, action) => {
//         state.loading = false;
//         state.schema = {
//           ...action.payload,
//           emailVerification: action.payload.emailVerification ?? false, // Ensure it's set if missing from fetched data
//         };
//       })
//       .addCase(fetchForm.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(createForm.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createForm.fulfilled, (state, action) => {
//         state.loading = false;
//         state.schema = {
//           ...action.payload,
//           emailVerification: action.payload.emailVerification ?? false, // Ensure it's set if missing from response
//         };
//       })
//       .addCase(createForm.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// const publishFormSlice = createSlice({
//   name: "formCreation",
//   initialState,
//   reducers: {},
// })

// export const {
//   setSchema,
//   setUndoStack,
//   setRedoStack,
//   setShowPreview,
//   setFocusedQuestion,
//   setMenuAnchor,
//   setMenuQuestionId,
//   setMobileMenuOpen,
//   setConditionalLogicOpen,
//   setDraggedId,
//   setUploadError,
//   setEmailVerification, // Export the new action
// } = formCreationSlice.actions;

// export default formCreationSlice.reducer;








import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* --------------------------------------------
   1. FETCH FORM BY ID
--------------------------------------------- */
export const fetchForm = createAsyncThunk(
  "formCreation/fetchForm",
  async (formId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://172.16.3.224:5000/api/forms/${formId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Form not found"
      );
    }
  }
);

/* --------------------------------------------
   2. CREATE NEW FORM
--------------------------------------------- */
export const createForm = createAsyncThunk(
  "formCreation/createForm",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://172.16.3.224:5000/api/forms", payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to create form"
      );
    }
  }
);

/* --------------------------------------------
   3. UPLOAD BANNER IMAGE
--------------------------------------------- */
export const uploadBannerImage = createAsyncThunk(
  "formCreation/uploadBannerImage",
  async (file, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("http://172.16.3.224:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success && response.data.files?.length > 0) {
        const storedName = response.data.files[0].storedName;

        // Chain the next thunk to get image blob as Base64
        const imageResult = await dispatch(getBannerImage(storedName)).unwrap();

        return {
          success: true,
          storedName,
          imageDataUrl: imageResult.imageDataUrl,
        };
      } else {
        return rejectWithValue("Upload failed: No files returned");
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
   4. GET BANNER IMAGE (FETCH & CONVERT TO BASE64)
--------------------------------------------- */
export const getBannerImage = createAsyncThunk(
  "formCreation/getBannerImage",
  async (storedName, { rejectWithValue }) => {
    try {
      const imageUrl = `http://172.16.3.224:5000/uploads/temp/${storedName}`;
      const response = await axios.get(imageUrl, { responseType: "blob" });

      // Convert blob to base64 data URL
      const reader = new FileReader();
      reader.readAsDataURL(response.data);

      return new Promise((resolve, reject) => {
        reader.onloadend = () => {
          if (reader.result) {
            resolve({
              success: true,
              imageDataUrl: reader.result,
              storedName,
              mimeType: response.headers["content-type"] || "image/png",
            });
          } else {
            reject(new Error("Failed to read image data"));
          }
        };
        reader.onerror = () => reject(new Error("Error reading image file"));
      });
    } catch (error) {
      console.error("Error fetching banner image:", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch banner image"
      );
    }
  }
);

/* --------------------------------------------
   5. INITIAL STATE
--------------------------------------------- */
const initialState = {
  schema: {
    title: "",
    description: "",
    fields: [],
    thankYouMessage: "",
    bannerImage: null,
    emailVerification: false,
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
  uploadError: null,
};

/* --------------------------------------------
   6. SLICE
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
    setUploadError: (state, action) => {
      state.uploadError = action.payload;
    },
    setEmailVerification: (state, action) => {
      state.schema.emailVerification = action.payload;
    },
    removeBannerImage: (state) => {
      state.schema.bannerImage = null;
      state.bannerImageError = null;
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
        state.schema = action.payload;
      })
      .addCase(fetchForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---- CREATE FORM ---- */
      .addCase(createForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createForm.fulfilled, (state, action) => {
        state.loading = false;
        state.schema = action.payload;
      })
      .addCase(createForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---- UPLOAD BANNER ---- */
      .addCase(uploadBannerImage.pending, (state) => {
        state.loadingBannerImage = true;
        state.bannerImageError = null;
        state.uploadError = null;
      })
      .addCase(uploadBannerImage.fulfilled, (state, action) => {
        state.loadingBannerImage = false;
        if (action.payload.success) {
          state.schema.bannerImage = action.payload.imageDataUrl;
        }
      })
      .addCase(uploadBannerImage.rejected, (state, action) => {
        state.loadingBannerImage = false;
        state.bannerImageError = action.payload || "Banner upload failed";
      })

      /* ---- GET BANNER ---- */
      .addCase(getBannerImage.pending, (state) => {
        state.loadingBannerImage = true;
        state.bannerImageError = null;
      })
      .addCase(getBannerImage.fulfilled, (state, action) => {
        state.loadingBannerImage = false;
        if (action.payload.success) {
          state.schema.bannerImage = action.payload.imageDataUrl;
        }
      })
      .addCase(getBannerImage.rejected, (state, action) => {
        state.loadingBannerImage = false;
        state.bannerImageError = action.payload || "Failed to load banner image";
      });
  },
});

/* --------------------------------------------
   7. EXPORTS
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
  setUploadError,
  setEmailVerification,
  removeBannerImage,
} = formCreationSlice.actions;

export default formCreationSlice.reducer;
