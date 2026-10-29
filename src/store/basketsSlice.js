import { createSlice } from "@reduxjs/toolkit";
import { logout } from "./users";
import { toggleFavorite } from "./favoritesSlice";

const basketsSlice = createSlice({
  name: "baskets",

  // 서버에서 불러온 로그인 유저의 냥바구니 (로그인 시 setBaskets 로 채워짐)
  initialState: [],

  reducers: {
    // 서버에서 받은 목록으로 통째로 교체
    setBaskets: (state, action) => action.payload,

    //냥바구니 생성 (id 는 서버가 정한 값)
    /*
      {
        id:1
        userId: 로그인 아이디(login_id)
        name : 냥바구니 이름
        description: 레포 설명
        repoId: [1,2,3, ... ]
      }
    */
    addBasket: (state, action) => {
      state.push(action.payload);
    },

    //냥바구니 삭제
    deleteBasket: (state, action) => {
      return state.filter((basket) => basket.id !== action.payload);
    },

    //냥바구니에 레포지토리 담기
    addRepoToBasket: (state, action) => {
      const { basketId, repoId } = action.payload;
      const basket = state.find((b) => b.id === basketId);

      if (basket && !basket.repoIds.includes(repoId)) {
        basket.repoIds.push(repoId);
      }
    },

    //냥바구니에서 레포지토리 빼기
    removeRepoFromBasket: (state, action) => {
      const { basketId, repoId } = action.payload;
      const basket = state.find((b) => b.id === basketId);

      if (basket) {
        basket.repoIds = basket.repoIds.filter((id) => id !== repoId);
      }
    },
  },
  extraReducers: (builder) => {
    // 로그아웃하면 이전 유저의 냥바구니를 화면에서 비움
    builder.addCase(logout, () => []);

    // 즐겨찾기를 해제하면 그 유저의 모든 냥바구니에서도 빠짐 (서버 DB 의 연쇄 삭제와 같은 동작)
    // 즐겨찾기를 추가하는 경우에는 바구니에 담겨 있을 수 없으므로 아무 일도 일어나지 않음
    builder.addCase(toggleFavorite, (state, action) => {
      const { repo, loginId } = action.payload;
      state.forEach((basket) => {
        if (basket.userId === loginId) {
          basket.repoIds = basket.repoIds.filter((id) => id !== repo.id);
        }
      });
    });
  },
});

export const {
  setBaskets,
  addBasket,
  deleteBasket,
  addRepoToBasket,
  removeRepoFromBasket,
} = basketsSlice.actions;
export const basketsReducer = basketsSlice.reducer;
