import { configureStore } from '@reduxjs/toolkit'
import userDetailsReducer from "./userDetailsReducer";

export const store = configureStore({
    reducer: {
        userDetails: userDetailsReducer,
    },
})