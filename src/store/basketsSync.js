import { isAnyOf } from "@reduxjs/toolkit";
import { login, refreshUser } from "./users";
import { addBasket, deleteBasket, addRepoToBasket, removeRepoFromBasket } from "./basketsSlice";
import { enqueue, recover, reloadBaskets, sync } from "./syncCommon";
import {
  addRepoToBasketRequest,
  createBasketRequest,
  deleteBasketRequest,
  removeRepoFromBasketRequest,
} from "../api/baskets";

// 냥바구니 변경을 서버에 반영합니다. (공통 규칙은 syncCommon.js 참고)

// 냥바구니 만들기: id 를 서버가 정하므로 서버 응답을 받은 뒤에 화면에 추가합니다.
// 실패하면 오류를 던지므로 호출한 화면에서 안내합니다.
export const createBasket = (data) => (dispatch, getState) =>
  enqueue(async () => {
    const userId = getState().loginUser?.id;
    const basket = await createBasketRequest(data);
    dispatch(addBasket({ ...basket, userId }));
    return basket;
  });

// 로그인(또는 새로고침 후 토큰 확인) 때 서버에서 불러오기
sync.startListening({
  matcher: isAnyOf(login, refreshUser),
  effect: (action, api) => {
    enqueue(() => reloadBaskets(api)).catch((error) => recover(error, api));
  },
});

sync.startListening({
  actionCreator: deleteBasket,
  effect: (action, api) => {
    enqueue(() => deleteBasketRequest(action.payload)).catch((error) => recover(error, api));
  },
});

sync.startListening({
  actionCreator: addRepoToBasket,
  effect: (action, api) => {
    const { basketId, repoId } = action.payload;
    enqueue(() => addRepoToBasketRequest(basketId, repoId)).catch((error) => recover(error, api));
  },
});

sync.startListening({
  actionCreator: removeRepoFromBasket,
  effect: (action, api) => {
    const { basketId, repoId } = action.payload;
    enqueue(() => removeRepoFromBasketRequest(basketId, repoId)).catch((error) =>
      recover(error, api),
    );
  },
});
