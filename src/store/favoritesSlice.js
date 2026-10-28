import { createSlice } from "@reduxjs/toolkit";
import { logout } from "./users";

const favoritesSlice = createSlice({
  name: "favorites",

  // 서버에서 불러온 로그인 유저의 즐겨찾기 (로그인 시 setFavorites 로 채워짐)
  initialState: [],

  reducers: {
    // 서버에서 받은 목록으로 통째로 교체
    setFavorites: (state, action) => action.payload,

    // 즐겨찾기 추가 및 해제
    toggleFavorite: {
      reducer: (state, action) => {
        const repo = action.payload.repo;
        const index = state.findIndex(
          (favorite) =>
            favorite.id === repo.id && favorite.userId === action.payload.userEmail,
        );

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

    addRepoTag: (state, action) => {
      const { repoId, userEmail, tag } = action.payload;
      const favorite = state.find(
        (f) => f.id === repoId && f.userId === userEmail,
      ); //레포id와 사용자 값이 일치하면

      if (favorite) {
        favorite.tag = tag; //태그 설정
      }
    },
  },
  extraReducers: (builder) => {
    // 로그아웃하면 이전 유저의 즐겨찾기를 화면에서 비움
    builder.addCase(logout, () => []);
  },
});

export const { toggleFavorite, addRepoTag, setFavorites } = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;
