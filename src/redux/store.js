import { configureStore } from "@reduxjs/toolkit";
import formSlice from "./features/formSlice";

export default configureStore({
    reducer:{
        form:formSlice
    }
})