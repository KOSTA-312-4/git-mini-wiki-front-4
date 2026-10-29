import { createListenerMiddleware } from "@reduxjs/toolkit";
import { setFavorites } from "./favoritesSlice";
import { setBaskets } from "./basketsSlice";
import { alertError } from "../api/auth";
import { fetchFavorites } from "../api/favorites";
import { fetchBaskets } from "../api/baskets";

// 화면(Redux)에서 일어난 변경을 서버에 반영하는 리스너들이 함께 쓰는 부분입니다.
// 화면은 먼저 바뀌고(바로 반응), 서버 저장이 실패하면 서버의 값으로 되돌립니다.
export const sync = createListenerMiddleware();

// 즐겨찾기와 냥바구니 요청이 누른 순서대로 한 줄로 서버에 가도록 처리
// (예: 즐겨찾기 추가 직후 냥바구니에 담아도 서버에서 순서가 뒤바뀌지 않음)
// 작업의 결과(성공/실패)는 호출한 쪽에서 받을 수 있습니다.
let queue = Promise.resolve();
export const enqueue = (task) => {
  const result = queue.then(task);
  queue = result.catch(() => {});
  return result;
};

// 서버의 내 즐겨찾기 / 냥바구니로 화면 상태를 통째로 교체
export async function reloadFavorites({ dispatch, getState }) {
  const loginId = getState().loginUser?.id;
  if (!loginId) return;
  const list = await fetchFavorites();
  // 불러오는 사이에 로그아웃/다른 유저 로그인이 됐다면 버림
  if (getState().loginUser?.id !== loginId) return;
  dispatch(setFavorites(list.map((favorite) => ({ ...favorite, userId: loginId }))));
}

export async function reloadBaskets({ dispatch, getState }) {
  const loginId = getState().loginUser?.id;
  if (!loginId) return;
  const list = await fetchBaskets();
  if (getState().loginUser?.id !== loginId) return;
  dispatch(setBaskets(list.map((basket) => ({ ...basket, userId: loginId }))));
}

// 요청 실패 처리: 안내 후 서버 기준으로 되돌림 (이미 로그아웃됐다면 조용히 무시)
export async function recover(error, api) {
  if (!api.getState().loginUser) return;
  alertError(error);
  try {
    await Promise.all([reloadFavorites(api), reloadBaskets(api)]);
  } catch {
    // 서버에 연결할 수 없으면 화면 상태를 그대로 둡니다.
  }
}
