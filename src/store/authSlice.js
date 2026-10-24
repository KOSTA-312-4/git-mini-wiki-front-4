import { createSlice } from "@reduxjs/toolkit";

const SESSION_KEY = "gitnyang-demo-user";

const DEMO_USER = {
  id: 1,
  name: "Demo User",
  email: "demo@gitnyang.com",
};

function getSavedUser() {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);

    return saved === DEMO_USER.email
      ? { ...DEMO_USER }
      : null;
  } catch {
    return null;
  }
}

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: getSavedUser(),
    isLoggedIn: Boolean(getSavedUser()),
  },

  reducers: {
    loginSuccess: (state) => {
      state.user = { ...DEMO_USER };
      state.isLoggedIn = true;
    },

    logoutSuccess: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { loginSuccess, logoutSuccess } =
  authSlice.actions;

export const DEMO_EMAIL = DEMO_USER.email;
export const DEMO_PASSWORD = "1234";

export function saveDemoSession() {
  try {
    sessionStorage.setItem(SESSION_KEY, DEMO_USER.email);
  } catch {
    // 저장공간이 사용 불가능할 수 있음.
  }
}

export function clearDemoSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Redux 상태는 여전히 초기화될 수 있음.
  }
}

export default authSlice.reducer;
