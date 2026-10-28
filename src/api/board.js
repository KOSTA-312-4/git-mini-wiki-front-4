import { api } from "./client";

// 게시글 목록 (로그인 없이 조회 가능)
export const fetchPosts = () => api.get("/posts").then((res) => res.data.posts);

// 게시글 읽기: 서버가 조회수를 1 올리고 댓글과 함께 돌려줍니다.
export const readPostRequest = (postNo) =>
  api.post(`/posts/${postNo}/read`).then((res) => res.data.post);

// 첨부할 냥바구니는 id 만 보냅니다. (이름/레포 스냅샷은 서버가 만듭니다.)
export const createPostRequest = ({ title, description, basketIds }) =>
  api.post("/posts", { title, description, basketIds }).then((res) => res.data.post);

export const updatePostRequest = (postNo, { title, description, basketIds }) =>
  api.patch(`/posts/${postNo}`, { title, description, basketIds }).then((res) => res.data.post);

export const deletePostRequest = (postNo) => api.delete(`/posts/${postNo}`);

export const addCommentRequest = (postNo, content) =>
  api.post(`/posts/${postNo}/comments`, { content }).then((res) => res.data.comment);

export const updateCommentRequest = (commentId, content) =>
  api.patch(`/comments/${commentId}`, { content }).then((res) => res.data.comment);

export const deleteCommentRequest = (commentId) => api.delete(`/comments/${commentId}`);
