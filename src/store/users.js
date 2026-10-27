import { createSlice } from "@reduxjs/toolkit";

// 프론트엔드 전용 데모 데이터입니다.
export const initialUsers = [
  {
    email: "demo@gitnyang.com",
    id: "demo",
    password: "demo1234",
    githubRepo: "https://github.com/demo/git-mini-wiki",
  },
  {
    email: "cat@gitnyang.com",
    id: "nyang",
    password: "nyang1234",
    githubRepo: "https://github.com/nyang/cat-basket",
  },
];

// 회원 목록 (배열)
const users = createSlice({
  name: "users",
  initialState: initialUsers,
  reducers: {
    // 회원가입: 새 유저를 배열에 추가
    addUser(state, action) {
      state.push(action.payload);
    },
  },
});

// 현재 로그인한 유저 (없으면 null)
const loginUser = createSlice({
  name: "loginUser",
  initialState: null,
  reducers: {
    login(state, action) {
      return action.payload;
    },
    logout() {
      return null;
    },
  },
});

export const { addUser } = users.actions;
export const { login, logout } = loginUser.actions;

export const usersReducer = users.reducer;
export const loginUserReducer = loginUser.reducer;
