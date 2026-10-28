import { createSelector } from "@reduxjs/toolkit";

// 로그인한 유저의 email (비로그인이면 undefined)
export const selectUserEmail = (state) => state.loginUser?.email;

// 로그인한 유저의 즐겨찾기 / 냥바구니 (비로그인이면 빈 배열)
// createSelector 로 입력이 같으면 같은 배열을 돌려주므로 불필요한 재렌더링이 없습니다.
export const selectMyFavorites = createSelector(
  [(state) => state.favorites, selectUserEmail],
  (favorites, email) =>
    email ? favorites.filter((favorite) => favorite.userId === email) : [],
);

export const selectMyBaskets = createSelector(
  [(state) => state.baskets, selectUserEmail],
  (baskets, email) =>
    email ? baskets.filter((basket) => basket.userId === email) : [],
);
