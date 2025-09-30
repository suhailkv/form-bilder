import { configureStore } from "@reduxjs/toolkit";
import formSlice from "./features/formSlice";
import formCreationSlice from "./features/formCreationSlice"

export default configureStore({
    reducer:{
        form:formSlice,
        formCreation: formCreationSlice
    }
})