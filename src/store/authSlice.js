import { createSlice } from "@reduxjs/toolkit";

const SESSION_KEY = "gitnyang-demo-user";
const PROFILE_PREFIX = "gitnyang-profile-";

export const DEMO_EMAIL = "demo@gitnyang.com";
export const DEMO_PASSWORD = "1234";

function readSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const user = JSON.parse(raw);

    if (
      !user ||
      typeof user !== "object" ||
      typeof user.id !== "string" ||
      typeof user.email !== "string"
    ) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

function readProfile(userId) {
  try {
    const raw = localStorage.getItem(
      `${PROFILE_PREFIX}${userId}`
    );

    if (!raw) return {};

    const profile = JSON.parse(raw);

    if (!profile || typeof profile !== "object") {
      return {};
    }

    return {
      name:
        typeof profile.name === "string"
          ? profile.name
          : "",
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

const sessionUser = readSession();

const initialUser = sessionUser
  ? {
      ...sessionUser,
      ...readProfile(sessionUser.id),
    }
  : null;

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: initialUser,
    isLoggedIn: Boolean(initialUser),
  },

  reducers: {
    loginSuccess: (state, action) => {
      const user = action.payload;

      if (!user || !user.id || !user.email) {
        return;
      }

      state.user = {
        ...user,
        ...readProfile(user.id),
      };

      state.isLoggedIn = true;
    },

    logoutSuccess: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },

    updateProfile: (state, action) => {
      if (!state.isLoggedIn || !state.user) {
        return;
      }

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

export function saveDemoSession(user) {
  try {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        bio: user.bio ?? "",
        avatar: null,
      })
    );

    return true;
  } catch {
    return false;
  }
}

export function clearDemoSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Redux logout still works.
  }
}

export function saveDemoProfile(profile, userId) {
  if (!userId) return false;

  try {
    localStorage.setItem(
      `${PROFILE_PREFIX}${userId}`,
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
