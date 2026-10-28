import { createSlice } from "@reduxjs/toolkit";

// 게시판 게시글 (서버에서 불러온 목록). 화면 쪽에서 계산한 새 목록으로 통째로 교체합니다.
// 댓글은 글을 읽을 때 서버에서 함께 받아 화면(Board)이 따로 보관합니다.
const boardSlice = createSlice({
  name: "board",

  initialState: [],

  reducers: {
    setBoard: (state, action) => action.payload,
  },
});

export const { setBoard } = boardSlice.actions;
export const boardReducer = boardSlice.reducer;
