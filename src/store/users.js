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

// 새로고침해도 유지되도록 브라우저 저장소에 저장할 때 쓰는 키
const USERS_KEY = "gitnyang-users";
const LOGIN_USER_KEY = "gitnyang-login-user";

// 저장된 회원 목록 읽기 (없거나 형식이 잘못되면 데모 데이터 사용)
function loadUsers() {
  try {
    const saved = JSON.parse(localStorage.getItem(USERS_KEY));
    return Array.isArray(saved) ? saved : initialUsers;
  } catch {
    return initialUsers;
  }
}

// 저장된 로그인 유저 읽기 (탭을 닫으면 sessionStorage 가 비워져 로그아웃됨)
function loadLoginUser() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(LOGIN_USER_KEY));
    return saved && typeof saved.id === "string" ? saved : null;
  } catch {
    return null;
  }
}

// store 의 상태가 바뀔 때마다 브라우저 저장소에 저장
export function saveUserState(state) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(state.users));

    if (state.loginUser) {
      sessionStorage.setItem(LOGIN_USER_KEY, JSON.stringify(state.loginUser));
    } else {
      sessionStorage.removeItem(LOGIN_USER_KEY);
    }
  } catch {
    // 저장소를 쓸 수 없어도 Redux 상태는 그대로 동작합니다.
  }
}

// 수정 가능한 프로필 항목만 골라냄 (id, password 등은 바꿀 수 없음)
function pickProfile({ avatar, githubRepo }) {
  const profile = {};
  if (avatar !== undefined) profile.avatar = avatar;
  if (githubRepo !== undefined) profile.githubRepo = githubRepo;
  return profile;
}

// 회원 목록 (배열)
const users = createSlice({
  name: "users",
  initialState: loadUsers,
  reducers: {
    // 회원가입: 새 유저를 배열에 추가
    addUser(state, action) {
      state.push(action.payload);
    },
    // 마이페이지: 프로필 사진, GitHub 레포 주소 수정
    updateProfile(state, action) {
      const user = state.find((item) => item.id === action.payload.id);
      if (user) Object.assign(user, pickProfile(action.payload));
    },
  },
});

export const { addUser, updateProfile } = users.actions;

// 현재 로그인한 유저 (없으면 null)
const loginUser = createSlice({
  name: "loginUser",
  initialState: loadLoginUser,
  reducers: {
    // 비밀번호는 로그인 상태에 넣지 않습니다.
    login(state, action) {
      const { password, ...user } = action.payload;
      return user;
    },
    logout() {
      return null;
    },
  },
  extraReducers: (builder) => {
    // 로그인한 유저의 프로필이 수정되면 로그인 상태에도 반영
    builder.addCase(updateProfile, (state, action) => {
      if (state && state.id === action.payload.id) {
        Object.assign(state, pickProfile(action.payload));
      }
    });
  },
});

export const { login, logout } = loginUser.actions;

export const usersReducer = users.reducer;
export const loginUserReducer = loginUser.reducer;
