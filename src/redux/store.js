import { configureStore } from "@reduxjs/toolkit";
import formSlice from "./features/formSlice";
import formCreationSlice from "./features/formCreationSlice";
import adminFormSlice from "./features/Adminformslice"

export default configureStore({
    reducer:{
        form:formSlice,
        formCreation: formCreationSlice,
        adminForm: adminFormSlice
    }
})