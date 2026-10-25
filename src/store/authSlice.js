import { createSlice } from "@reduxjs/toolkit";

const SESSION_KEY = "gitnyang-demo-user";
const PROFILE_KEY = "gitnyang-demo-profile";
const DEMO_USER = {
  id: 1,
  name: "Demo User",
  email: "demo@gitnyang.com",
  bio: "",
  avatar: null,
};

function getSavedProfile() {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);

    if (!saved) return {};

    const profile = JSON.parse(saved);

    if (
      !profile ||
      typeof profile !== "object" ||
      Array.isArray(profile)
    ) {
      return {};
    }

    return {
      name:
        typeof profile.name === "string" &&
        profile.name.trim()
          ? profile.name.trim()
          : DEMO_USER.name,

      bio:
        typeof profile.bio === "string"
          ? profile.bio
          : "",

      avatar:
        typeof profile.avatar === "string" &&
        /^data:image\/(png|jpeg|webp);base64,/.test(
          profile.avatar
        )
          ? profile.avatar
          : null,
    };
  } catch {
    return {};
  }
}

function getDemoUser() {
  return {
    ...DEMO_USER,
    ...getSavedProfile(),
  };
}

function getSavedUser() {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);

    return saved === DEMO_USER.email
      ? getDemoUser()
      : null;
  } catch {
    return null;
  }
}

const savedUser = getSavedUser();

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: savedUser,
    isLoggedIn: Boolean(savedUser),
  },

  reducers: {
    // Login
    loginSuccess: (state) => {
      state.user = getDemoUser();
      state.isLoggedIn = true;
    },

    // Logout
    logoutSuccess: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },

    // Update profile
    updateProfile: (state, action) => {
      if (!state.isLoggedIn || !state.user) return;

      const { name, bio, avatar } = action.payload;

      if (name !== undefined) {
        state.user.name = name;
      }

      if (bio !== undefined) {
        state.user.bio = bio;
      }

      if (avatar !== undefined) {
        state.user.avatar = avatar;
      }
    },
  },
});

export const {
  loginSuccess,
  logoutSuccess,
  updateProfile,
} = authSlice.actions;

export const DEMO_EMAIL = DEMO_USER.email;
export const DEMO_PASSWORD = "1234";

export function saveDemoSession() {
  try {
    sessionStorage.setItem(
      SESSION_KEY,
      DEMO_USER.email
    );
  } catch {
    // Browser storage may be unavailable.
  }
}

export function clearDemoSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Redux logout can still proceed.
  }
}

export function saveDemoProfile(profile) {
  try {
    localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify({
        name: profile.name,
        bio: profile.bio,
        avatar: profile.avatar ?? null,
      })
    );

    return true;
  } catch {
    return false;
  }
}

export default authSlice.reducer;
