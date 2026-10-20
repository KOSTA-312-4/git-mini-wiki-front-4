import { useEffect, useState } from "react";
import axios from "axios";
import "./GithubRepositories.css";

const API_URL = "https://api.github.com/search/repositories";
const PER_PAGE = 9;
const FAVORITES_KEY = "github-repository-favorites";

// localStorage에서 즐겨찾기 목록 가져오기
function loadFavorites() {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function GithubRepositories({ keyword = "java" }) {
  const [repositories, setRepositories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [favorites, setFavorites] = useState(loadFavorites);

  // 페이지 또는 검색어가 바뀌면 API 요청
  useEffect(() => {
    const controller = new AbortController();

    const fetchRepositories = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(API_URL, {
          params: {
            q: keyword,
            sort: "stars",
            order: "desc",
            per_page: PER_PAGE,
            page: page,
          },
          signal: controller.signal,
        });

        // GitHub JSON에서 필요한 부분만 추출
        setRepositories(response.data.items ?? []);
        setTotalCount(response.data.total_count ?? 0);
      } catch (err) {
        if (controller.signal.aborted) return;

        if (err.response?.status === 403 || err.response?.status === 429) {
          setError(
            "API 요청 한도에 도달했을 수 있습니다. 잠시 후 다시 시도해주세요.",
          );
        } else {
          setError("저장소를 불러오지 못했습니다.");
        }

        setRepositories([]);
        setTotalCount(0);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchRepositories();

    // 이전 요청이 남아 있으면 취소
    return () => controller.abort();
  }, [keyword, page]);

  // 즐겨찾기가 바뀌면 localStorage에 저장
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // 즐겨찾기 추가 및 해제
  const toggleFavorite = (repo) => {
    setFavorites((prevFavorites) => {
      const exists = prevFavorites.some((favorite) => favorite.id === repo.id);

      if (exists) {
        return prevFavorites.filter((favorite) => favorite.id !== repo.id);
      }

      return [
        ...prevFavorites,
        {
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
        },
      ];
    });
  };

  // GitHub Search API는 검색 결과 최대 1,000개까지 페이지 조회 가능
  const totalPages = Math.max(
    1,
    Math.ceil(Math.min(totalCount, 1000) / PER_PAGE),
  );

  const goToPreviousPage = () => {
    setPage((prevPage) => Math.max(1, prevPage - 1));
  };

  const goToNextPage = () => {
    setPage((prevPage) => Math.min(totalPages, prevPage + 1));
  };

  return (
    <section className="repo-page">
      <div className="repo-grid">
        {!loading &&
          !error &&
          repositories.map((repo) => {
            const isFavorite = favorites.some(
              (favorite) => favorite.id === repo.id,
            );

            return (
              <article className="repo-card" key={repo.id}>
                {/* 카드 상단: 저장소 이름과 즐겨찾기 */}
                <div className="repo-card-header">
                  <h2 className="repo-title">{repo.name}</h2>

                  <button
                    type="button"
                    className={`favorite-button ${
                      isFavorite ? "is-favorite" : ""
                    }`}
                    onClick={() => toggleFavorite(repo)}
                    aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                    aria-pressed={isFavorite}
                    title={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                  >
                    {isFavorite ? "★" : "☆"}
                  </button>
                </div>

                {/* 저장소 소유자의 프로필 이미지 */}
                {repo.owner?.avatar_url && (
                  <img
                    className="repo-avatar"
                    src={repo.owner.avatar_url}
                    alt={`${repo.owner.login} 프로필`}
                    loading="lazy"
                  />
                )}

                {/* 저장소 설명 */}
                <p className="repo-description">
                  {repo.description || "설명이 없습니다."}
                </p>

                {/* 저장소 통계와 GitHub 링크 */}
                <div className="repo-details">
                  <div className="repo-stats">
                    <p className="repo-stat">
                      <strong>Stars:</strong>{" "}
                      {(repo.stargazers_count ?? 0).toLocaleString()}
                    </p>

                    <p className="repo-stat">
                      <strong>Forks:</strong>{" "}
                      {(repo.forks_count ?? 0).toLocaleString()}
                    </p>

                    <p className="repo-stat">
                      <strong>Language:</strong> {repo.language ?? "정보 없음"}
                    </p>
                  </div>

                  <a
                    className="repo-link"
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on GitHub
                  </a>
                </div>
              </article>
            );
          })}
      </div>

      {/* 로딩 및 오류 메시지 */}
      {loading && (
        <p className="repo-message" role="status">
          저장소 정보를 불러오는 중입니다...
        </p>
      )}

      {!loading && error && (
        <p className="repo-message repo-error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && repositories.length === 0 && (
        <p className="repo-message">검색 결과가 없습니다.</p>
      )}

      {/* 이전 / 다음 페이지 */}
      {!loading && !error && totalCount > 0 && (
        <nav className="repo-pagination" aria-label="저장소 검색 페이지 이동">
          <button
            type="button"
            className="pagination-button"
            onClick={goToPreviousPage}
            disabled={page <= 1}
          >
            Previous
          </button>

          <span className="repo-page-number">
            {page} / {totalPages}
          </span>

          <button
            type="button"
            className="pagination-button"
            onClick={goToNextPage}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
}

export default GithubRepositories;
