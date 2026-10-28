import { saveUserState } from "./users";

// 즐겨찾기, 냥바구니, 게시판은 서버에 저장하므로(각각 favoritesSync, basketsSync, Board 화면)
// 브라우저에는 로그인 유저(sessionStorage)만 저장합니다.
export function setupPersistence(store) {
  let prev = store.getState();

  store.subscribe(() => {
    const state = store.getState();

    // 로그인 유저 (새로고침해도 유지, 로그아웃이면 토큰 삭제)
    if (state.loginUser !== prev.loginUser) {
      saveUserState(state);
    }

    prev = state;
  });
}
