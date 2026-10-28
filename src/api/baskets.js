import { api } from "./client";

export const fetchBaskets = () => api.get("/baskets").then((res) => res.data.baskets);

// 서버가 부여한 id 가 포함된 냥바구니를 돌려줍니다.
export const createBasketRequest = ({ name, description, repoIds }) =>
  api.post("/baskets", { name, description, repoIds }).then((res) => res.data.basket);

export const deleteBasketRequest = (basketId) => api.delete(`/baskets/${basketId}`);

export const addRepoToBasketRequest = (basketId, repoId) =>
  api.put(`/baskets/${basketId}/repos/${repoId}`);

export const removeRepoFromBasketRequest = (basketId, repoId) =>
  api.delete(`/baskets/${basketId}/repos/${repoId}`);
