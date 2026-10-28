import { configureStore } from "@reduxjs/toolkit";
import { loginUserReducer, logout, refreshUser } from "./users";
import { favoritesReducer } from "./favoritesSlice";
import { basketsReducer } from "./basketsSlice";
export { createBasket } from "./basketsSync";
import { boardReducer } from "./boardSlice";
import { setupPersistence } from "./persistence";
import { removeLegacyStorage } from "./legacyStorage";
import { setUnauthorizedHandler } from "../api/client";
import { fetchMe } from "../api/auth";
import { sync } from "./syncCommon";
import "./favoritesSync";
import "./basketsSync";
import "./avatarSync";

// 컴포넌트는 액션과 셀렉터를 모두 이 파일에서 가져옵니다.
export { login, logout, updateProfile } from "./users";
export { toggleFavorite, addRepoTag } from "./favoritesSlice";
export {
  addBasket,
  deleteBasket,
  addRepoToBasket,
  removeRepoFromBasket,
} from "./basketsSlice";
export { setBoard } from "./boardSlice";
export { selectUserEmail, selectMyFavorites, selectMyBaskets } from "./selectors";

// 서버 저장으로 바뀌기 전 버전이 브라우저에 남긴 데이터는 앱을 시작할 때 삭제
removeLegacyStorage();

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(sync.middleware),
  reducer: {
    favorites: favoritesReducer,
    baskets: basketsReducer,
    board: boardReducer,
    loginUser: loginUserReducer,
  },
});

// 로그인 유저가 바뀌면 브라우저(sessionStorage)에 반영 (나머지 데이터는 서버에 저장)
setupPersistence(store);

// 서버가 로그인 만료/무효(401)로 응답하면 자동 로그아웃
setUnauthorizedHandler(() => {
  store.dispatch(logout());
  alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
});

// 새로고침 후 토큰이 아직 유효한지 서버에 확인하고 최신 정보로 갱신
// (무효하면 401 처리로 자동 로그아웃, 서버에 연결할 수 없으면 기존 상태 유지)
if (store.getState().loginUser) {
  fetchMe()
    .then((user) => store.dispatch(refreshUser(user)))
    .catch(() => {});
}
