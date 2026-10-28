import { api } from "./client";

export const fetchFavorites = () =>
  api.get("/favorites").then((res) => res.data.favorites);

// 서버에는 저장 시점의 GitHub 정보(스냅샷)를 함께 보냅니다.
export const addFavoriteRequest = (repo) =>
  api.put(`/favorites/${repo.id}`, {
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    owner: { login: repo.owner?.login, avatar_url: repo.owner?.avatar_url },
    description: repo.description,
    html_url: repo.html_url,
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
    language: repo.language,
  });

export const removeFavoriteRequest = (repoId) => api.delete(`/favorites/${repoId}`);

export const updateTagRequest = (repoId, tag) =>
  api.patch(`/favorites/${repoId}/tag`, { tag });
