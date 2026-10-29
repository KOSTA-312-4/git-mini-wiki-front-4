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

// 비회원은 guest({ nickname, password })를 함께 보냅니다. (로그인 유저는 토큰으로 작성자가 정해짐)
export const addCommentRequest = (postNo, content, guest) =>
  api.post(`/posts/${postNo}/comments`, { content, ...guest }).then((res) => res.data.comment);

// 비회원 댓글은 작성할 때 정한 비밀번호(password)가 있어야 수정/삭제할 수 있습니다.
export const updateCommentRequest = (commentId, content, password) =>
  api.patch(`/comments/${commentId}`, { content, password }).then((res) => res.data.comment);

export const deleteCommentRequest = (commentId, password) =>
  api.delete(`/comments/${commentId}`, { data: { password } });
