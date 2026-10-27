import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { usersReducer, loginUserReducer } from "./users";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    loginUser: loginUserReducer,
  },
});
