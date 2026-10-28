import axios from "axios";

const TOKEN_KEY = "gitnyang-token";

// 토큰은 탭을 닫으면 사라지도록 sessionStorage 에 보관
export function getToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // 저장소를 쓸 수 없어도 동작은 계속합니다.
  }
}

// 서버 API 용 axios (GitHub API 호출에는 쓰지 않음)
export const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 이면 저장된 토큰을 지우고 앱에 알립니다. (store 에서 이 함수에 로그아웃 처리를 연결)
let onUnauthorized = () => {};
export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.startsWith("/auth/login");
    if (error.response?.status === 401 && !isLoginRequest && getToken()) {
      setToken(null);
      error.handledUnauthorized = true; // 화면별 오류 안내가 또 뜨지 않도록 표시
      onUnauthorized();
    }
    return Promise.reject(error);
  },
);
