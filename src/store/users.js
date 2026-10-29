import { createSlice } from "@reduxjs/toolkit";
import { getToken, setToken } from "../api/client";

// 새로고침해도 유지되도록 로그인 유저 정보를 sessionStorage 에 보관 (탭을 닫으면 로그아웃)
// 로그인 확인의 기준은 서버가 발급한 토큰이며, 이 값은 화면을 빨리 그리기 위한 사본입니다.
const LOGIN_USER_KEY = "gitnyang-login-user";

// 저장된 로그인 유저 읽기 (토큰이 없거나 형식이 잘못되면 null)
function loadLoginUser() {
  try {
    if (!getToken()) return null;
    const saved = JSON.parse(sessionStorage.getItem(LOGIN_USER_KEY));
    return saved && typeof saved.id === "string" ? saved : null;
  } catch {
    return null;
  }
}

// 로그인 유저가 바뀔 때마다 브라우저 저장소에 반영 (로그아웃이면 토큰도 삭제)
export function saveUserState(state) {
  try {
    if (state.loginUser) {
      // 프로필 사진은 크기가 커서 저장하지 않습니다. (로그인할 때마다 서버에서 불러옴)
      const saved = JSON.stringify(state.loginUser, (key, value) =>
        key === "avatar" ? undefined : value,
      );
      sessionStorage.setItem(LOGIN_USER_KEY, saved);
    } else {
      sessionStorage.removeItem(LOGIN_USER_KEY);
      setToken(null);
    }
  } catch {
    // 저장소를 쓸 수 없어도 Redux 상태는 그대로 동작합니다.
  }
}

// 수정 가능한 프로필 항목만 골라냄 (id, email 등은 바꿀 수 없음)
function pickProfile({ avatar, githubRepo }) {
  const profile = {};
  if (avatar !== undefined) profile.avatar = avatar;
  if (githubRepo !== undefined) profile.githubRepo = githubRepo;
  return profile;
}

// 서버가 계산한 EXP / 레벨 정보만 골라냄
function pickStats({ EXP, level, nextLevelExp }) {
  const stats = {};
  if (EXP !== undefined) stats.EXP = EXP;
  if (level !== undefined) stats.level = level;
  if (nextLevelExp !== undefined) stats.nextLevelExp = nextLevelExp;
  return stats;
}

// 현재 로그인한 유저 (없으면 null)
const loginUser = createSlice({
  name: "loginUser",
  initialState: loadLoginUser,
  reducers: {
    // 서버가 확인한 유저 정보 (비밀번호는 오지 않음)
    login(state, action) {
      return action.payload;
    },
    logout() {
      return null;
    },
    // 서버에서 다시 받은 최신 유저 정보 반영 (따로 불러오는 avatar 는 유지)
    refreshUser(state, action) {
      return state ? { ...state, ...action.payload } : state;
    },
    // 글/댓글 작성·삭제로 바뀐 EXP 와 레벨 반영 (refreshUser 와 달리 즐겨찾기 등을 다시 불러오지 않음)
    updateStats(state, action) {
      if (state) Object.assign(state, pickStats(action.payload));
    },
    // 마이페이지: 프로필 사진, GitHub 레포 주소 수정
    updateProfile(state, action) {
      if (state) Object.assign(state, pickProfile(action.payload));
    },
  },
});

export const { login, logout, refreshUser, updateProfile, updateStats } = loginUser.actions;
export const loginUserReducer = loginUser.reducer;
