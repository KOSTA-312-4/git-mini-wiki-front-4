import { api } from "./client";

// 서버가 보낸 오류 메시지 (서버에 연결할 수 없으면 기본 메시지)
export const errorMessage = (error) =>
  error.response?.data?.message ?? "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.";

// 오류 안내창 (로그인 만료로 이미 안내했다면 다시 띄우지 않음)
export const alertError = (error) => {
  if (!error.handledUnauthorized) alert(errorMessage(error));
};

export const loginRequest = (id, password) =>
  api.post("/auth/login", { id, password }).then((res) => res.data);

export const signupRequest = (form) =>
  api.post("/auth/signup", form).then((res) => res.data);

export const fetchMe = () => api.get("/auth/me").then((res) => res.data.user);

// 프로필 사진 (로그인/내 정보 응답에는 포함되지 않아 따로 주고받음)
export const fetchAvatar = () => api.get("/users/me/avatar").then((res) => res.data.avatar);

export const saveAvatarRequest = (avatar) => api.put("/users/me/avatar", { avatar });

export const updateGithubRepo = (githubRepo) =>
  api.patch("/users/me", { githubRepo }).then((res) => res.data);

export const changePasswordRequest = (currentPassword, newPassword) =>
  api.put("/users/me/password", { currentPassword, newPassword }).then((res) => res.data);
