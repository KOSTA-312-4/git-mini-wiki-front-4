import { isAnyOf } from "@reduxjs/toolkit";
import { login, refreshUser } from "./users";
import { toggleFavorite, addRepoTag } from "./favoritesSlice";
import { enqueue, recover, reloadFavorites, sync } from "./syncCommon";
import { addFavoriteRequest, removeFavoriteRequest, updateTagRequest } from "../api/favorites";

// 즐겨찾기 변경을 서버에 반영합니다. (공통 규칙은 syncCommon.js 참고)

// 로그인(또는 새로고침 후 토큰 확인) 때 서버에서 불러오기
sync.startListening({
  matcher: isAnyOf(login, refreshUser),
  effect: (action, api) => {
    enqueue(() => reloadFavorites(api)).catch((error) => recover(error, api));
  },
});

sync.startListening({
  actionCreator: toggleFavorite,
  effect: (action, api) => {
    const { repo, loginId } = action.payload;
    // 리듀서가 이미 반영한 결과: 지금 즐겨찾기 상태인가?
    const isFavorite = api
      .getState()
      .favorites.some((favorite) => favorite.id === repo.id && favorite.userId === loginId);

    enqueue(() =>
      isFavorite ? addFavoriteRequest(repo) : removeFavoriteRequest(repo.id),
    ).catch((error) => recover(error, api));
  },
});

sync.startListening({
  actionCreator: addRepoTag,
  effect: (action, api) => {
    const { repoId, tag } = action.payload;
    enqueue(() => updateTagRequest(repoId, tag)).catch((error) => recover(error, api));
  },
});
