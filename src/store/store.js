import { configureStore, createSlice } from "@reduxjs/toolkit";
import { usersReducer, loginUserReducer, saveUserState } from "./users";

const FAVORITES_KEY = "github-repository-favorites";
const BASKETS_KEY = "gitnyang-baskets";

function loadBaskets() {
  try {
    const saved = localStorage.getItem(BASKETS_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadFavorites() {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const basketsSlice = createSlice({
  name: "baskets",

  initialState: loadBaskets(),

  reducers: {
    //냥바구니 생성
    /*
      {
        id:1
        userId: email값
        name : 레포 이름
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
});

export const {
  addBasket,
  deleteBasket,
  addRepoToBasket,
  removeRepoFromBasket,
} = basketsSlice.actions;

const favoritesSlice = createSlice({
  name: "favorites",

  initialState: loadFavorites(),

  reducers: {
    // 즐겨찾기 추가 및 해제
    toggleFavorite: {
      reducer: (state, action) => {
        const repo = action.payload.repo;
        const index = state.findIndex((favorite) => favorite.id === repo.id);

        if (index >= 0) {
          state.splice(index, 1);
          return;
        }

        state.push({
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          owner: {
            login: repo.owner?.login,
            avatar_url: repo.owner?.avatar_url,
          },
          description: repo.description,
          html_url: repo.html_url,
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          language: repo.language,
          userId: action.payload.userEmail, // 로그인 한 유저의 email
          tag: "", // 5 ~ 6가지 태그 내용으로, 메인 페이지에서 비로그인 유저들에게 각 태그별 인기 repo 표시 위함.
          // sortedByNyang: "", // collection 분류 시, 유저가 작성한 collection 이름으로 분류
          // isSelected: false, // 좋아요 페이지에서 repo 좋아요 삭제하면 boolean값 변경으로 저장 내역에서 제거
          savedTime: action.payload.savedTime, // 파싱할 때 => new Date(savedTime).toLocaleString()
        });
      },
      // 리듀서를 순수하게 유지하기 위해 저장 시각은 액션 생성 시점에 만든다
      prepare: (repo) => ({
        payload: { ...repo, savedTime: new Date().getTime() },
      }),
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;

export const store = configureStore({
  reducer: {
    favorites: favoritesSlice.reducer,
    baskets: basketsSlice.reducer,
    users: usersReducer,
    loginUser: loginUserReducer,
  },
});

// 즐겨찾기 변경 사항을 localStorage에 저장
let prevFavorites = store.getState().favorites;

store.subscribe(() => {
  const favorites = store.getState().favorites;
  if (favorites === prevFavorites) return;
  prevFavorites = favorites;

  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch {
    // 브라우저 저장 공간을 사용할 수 없는 경우 무시
  }
});

//냥바구니 변경 사항 로컬 스토리지에 저장
let prevBaskets = store.getState().baskets;
store.subscribe(() => {
  const baskets = store.getState().baskets;

  if (baskets === prevBaskets) return;
  prevBaskets = baskets;

  try {
    localStorage.setItem(BASKETS_KEY, JSON.stringify(baskets));
  } catch {
    //
  }
});

// 상태가 바뀔 때마다 회원 목록과 로그인 유저를 저장 (새로고침해도 유지)
store.subscribe(() => saveUserState(store.getState()));
