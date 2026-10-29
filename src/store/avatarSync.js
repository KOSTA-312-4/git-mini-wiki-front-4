import { isAnyOf } from "@reduxjs/toolkit";
import { login, refreshUser, updateProfile } from "./users";
import { sync } from "./syncCommon";
import { fetchAvatar } from "../api/auth";

// 프로필 사진은 무거워서 로그인/내 정보 응답에 포함되지 않으므로 따로 불러옵니다.
// 로그인(또는 새로고침 후 토큰 확인) 때 한 번 가져와 로그인 유저 정보에 채웁니다.
sync.startListening({
  matcher: isAnyOf(login, refreshUser),
  effect: async (action, api) => {
    const loginId = api.getState().loginUser?.id;
    try {
      const avatar = await fetchAvatar();
      // 불러오는 사이에 로그아웃/다른 유저 로그인이 됐다면 버림
      if (api.getState().loginUser?.id === loginId) {
        api.dispatch(updateProfile({ avatar }));
      }
    } catch {
      // 사진을 못 불러와도 기본 사진으로 계속 동작합니다. (401 이면 공통 처리에서 로그아웃)
    }
  },
});
