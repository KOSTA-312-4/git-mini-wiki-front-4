import { configureStore } from "@reduxjs/toolkit";
import { usersReducer, loginUserReducer, saveUserState } from "./users";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    loginUser: loginUserReducer,
  },
});

// 상태가 바뀔 때마다 회원 목록과 로그인 유저를 저장 (새로고침해도 유지)
store.subscribe(() => saveUserState(store.getState()));
