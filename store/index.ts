import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import projectReducer from "./slices/projectSlice";
import type { RootState, AppDispatch } from "../types/redux.types";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        projects: projectReducer,
    },
});

export type { RootState, AppDispatch };