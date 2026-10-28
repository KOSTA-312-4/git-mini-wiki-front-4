import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toggleFavorite } from "../store/store";

import "./GithubRepositories.css";

const API_URL = "https://api.github.com/search/repositories";

// API 응답 개수와 화면 표시 개수 분리
const DISPLAY_PER_PAGE = 9;

function GithubRepositories() {
  let selectUser = useSelector(s=>s.loginUser);
  console.log(selectUser);

  const [params] = useSearchParams();
  const initKeyword = (params.get('q') ?? '') + (params.get('lang') ? ' language:' + params.get('lang') : '');

  const [repositories, setRepositories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState(initKeyword);

  let defaultKeyword = keyword;
  if(keyword.split(' language:').length>=2) defaultKeyword = keyword.split(' language:')[0];

  const favorites = useSelector((s) => s.favorites);
  const dispatch = useDispatch();
  const inputRef = useRef();
  const detailRef = useRef('');

  // 검색어가 변경되면 API 요청
  useEffect(() => {
    const controller = new AbortController();

    const fetchRepositories = async () => {
      setLoading(true);
      setError("");
      setRepositories([]);
      setTotalCount(0);
      setPage(1);

      try {
        const response = await axios.get(API_URL, {
          params: {
            q: keyword,
            sort: "stars",
            order: "desc",
            per_page: 99,
            page: 1,
          },
          signal: controller.signal,
        });

        setRepositories(response.data.items ?? []);
        setTotalCount(response.data.total_count ?? 0);
      } catch (err) {
        if (controller.signal.aborted) return;

        if (
          err.response?.status === 403 ||
          err.response?.status === 429
        ) {
          setError(
            "API 요청 한도에 도달했을 수 있습니다. 잠시 후 다시 시도해주세요."
          );
        } else {
          setError("저장소를 불러오지 못했습니다.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchRepositories();

    return () => controller.abort();
  }, [keyword]);

  // GitHub Search API 검색 결과 최대 1,000개 제한
  const searchableCount = Math.min(totalCount, 1000);

  // 화면 페이지 수 계산
  const totalPages = Math.max(
    1,
    Math.ceil(searchableCount / DISPLAY_PER_PAGE)
  );

  // 현재 페이지에 해당하는 저장소 9개 추출
  const startIndex = (page - 1) * DISPLAY_PER_PAGE;

  const visibleRepositories = repositories.slice(
    startIndex,
    startIndex + DISPLAY_PER_PAGE
  );

  const goToPreviousPage = () => {
    setPage((prevPage) => Math.max(1, prevPage - 1));
  };

  const goToNextPage = () => {
    setPage((prevPage) =>
      Math.min(totalPages, prevPage + 1)
    );
  };

  function handleSearch(event) {
    event.preventDefault();
    if(inputRef.current.value == '') {
      alert('검색어를 입력해주세요.');
      inputRef.current.focus();
      return;
    }
    setKeyword(inputRef.current.value + (detailRef.current ? " language:" + detailRef.current : ""));
  }

  return (
    <section className="repo-page">
      <form onSubmit={handleSearch} className="d-flex gap-2 mb-4">
        <input className="form-control" type="search" ref={inputRef} name="q" placeholder="검색어를 입력하세요." aria-label="검색어" defaultValue={defaultKeyword}/>
        <select
                        onChange={(e) => detailRef.current = e.target.value}
                        style={{
                          padding: "10px",
                          marginLeft: "10px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          width: "150px",
                        }}
                      >
                        <option value="">언어 선택</option>
                        <option value="Java">Java</option>
                        <option value="Kotlin">Kotlin</option>
                        <option value="JavaScript">JavaScript</option>
                        <option value="Python">Python</option>
                        <option value="TypeScript">TypeScript</option>
                      </select>
                      <button className="btn btn-primary flex-shrink-0" type="submit">검색</button>
      </form>
      <div className="repo-grid">
        {!loading &&
          !error &&
          visibleRepositories.map((repo) => {
            const isFavorite = favorites.some(
              (favorite) => favorite.id === repo.id && favorite.userId === selectUser?.email
            );

            return (
              <article className="repo-card" key={repo.id}>
                <div className="repo-card-header">
                  <h2 className="repo-title">{repo.name}</h2>

                  <button
                    type="button"
                    className={`favorite-button ${
                      isFavorite ? "is-favorite" : ""
                    }`}
                    onClick={() => dispatch(toggleFavorite({repo, userEmail:selectUser?.email}))}
                    aria-label={
                      isFavorite
                        ? "즐겨찾기 해제"
                        : "즐겨찾기 추가"
                    }
                    aria-pressed={isFavorite}
                    title={
                      isFavorite
                        ? "즐겨찾기 해제"
                        : "즐겨찾기 추가"
                    }
                    // 로그인 유저 판별 후 버튼 표시
                    hidden={selectUser==null?true:false}
                  >
                    {isFavorite ? "♥" : "♡"}
                  </button>
                </div>

                {repo.owner?.avatar_url && (
                  <img
                    className="repo-avatar"
                    src={repo.owner.avatar_url}
                    alt={`${repo.owner.login} 프로필`}
                    loading="lazy"
                  />
                )}

                <p className="repo-description">
                  {repo.description || "설명이 없습니다."}
                </p>

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
                      <strong>Language:</strong>{" "}
                      {repo.language ?? "정보 없음"}
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

      {/* 로딩 메시지 */}
      {loading && (
        <p className="repo-message" role="status">
          저장소 정보를 불러오는 중입니다...
        </p>
      )}

      {/* 오류 메시지 */}
      {!loading && error && (
        <p className="repo-message repo-error" role="alert">
          {error}
        </p>
      )}

      {/* 검색 결과 없음 */}
      {!loading &&
        !error &&
        repositories.length === 0 && (
          <p className="repo-message">
            검색 결과가 없습니다.
          </p>
        )}

      {/* 페이지네이션 */}
      {!loading &&
        !error &&
        repositories.length > 0 && (
          <nav
            className="repo-pagination"
            aria-label="저장소 검색 페이지 이동"
          >
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
