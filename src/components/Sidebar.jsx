import { NavLink, Link } from "react-router-dom";
import "./Sidebar.css";
import { useEffect, useState } from "react";
import axios from "axios";

const menuItems = [
  { to: "/", label: "메인 페이지", icon: "bi-house-door" },
  { to: "/search", label: "검색 결과", icon: "bi-search" },
  { to: "/favorites", label: "즐겨찾기", icon: "bi-bookmark" },
  { to: "/mypage", label: "마이페이지", icon: "bi-person" },
];

// 인기 순위: 최근 며칠 안에 만들어진 레포 중 star 많은 순
const POPULAR_DAYS = 5;

// 냥이 추천 주제: 태그 이름 -> "주제 더 둘러보기"에서 검색할 단어
const TAG = { 백엔드: "backend", 프론트엔드: "frontend", DB: "database" };

//더미데이터
const DUMMY_LIKES = [
  { tag: "백엔드", owner: "spring-projects", name: "spring-boot", likes: 987 },
  { tag: "백엔드", owner: "django", name: "django", likes: 880 },
  { tag: "백엔드", owner: "nestjs", name: "nest", likes: 812 },
  { tag: "백엔드", owner: "tiangolo", name: "fastapi", likes: 770 },
  { tag: "백엔드", owner: "expressjs", name: "express", likes: 702 },
  { tag: "프론트엔드", owner: "facebook", name: "react", likes: 954 },
  { tag: "프론트엔드", owner: "vuejs", name: "core", likes: 861 },
  { tag: "프론트엔드", owner: "vercel", name: "next.js", likes: 790 },
  { tag: "프론트엔드", owner: "sveltejs", name: "svelte", likes: 735 },
  { tag: "프론트엔드", owner: "angular", name: "angular", likes: 690 },
  { tag: "DB", owner: "redis", name: "redis", likes: 921 },
  { tag: "DB", owner: "postgres", name: "postgres", likes: 848 },
  { tag: "DB", owner: "mongodb", name: "mongo", likes: 803 },
  { tag: "DB", owner: "mysql", name: "mysql-server", likes: 756 },
  { tag: "DB", owner: "sqlite", name: "sqlite", likes: 684 },
];

export default function Sidebar() {
  const [tab, setTab] = useState("popular"); // 'popular' 또는 'recommend'
  const [activeTag, setActiveTag] = useState("백엔드");
  const [popular, setPopular] = useState([]);
  const [error, setError] = useState(false);

  // POPULAR_DAYS일 전 날짜 (예: 2026-10-23)
  const date = new Date();
  date.setDate(date.getDate() - POPULAR_DAYS);
  const since = date.toISOString().slice(0, 10);

  // 인기 순위: 최근에 만든 레포 중 star 많은 순 7개
  useEffect(() => {
    axios
      .get("https://api.github.com/search/repositories", {
        params: {
          q: `created:>${since}`,
          sort: "stars",
          order: "desc",
          per_page: 7,
        },
      })
      .then((res) => setPopular(res.data.items))
      .catch(() => setError(true));
  }, []);

  // 냥이 추천: 선택한 태그의 레포를 좋아요 많은 순으로 5개
  const recommend = DUMMY_LIKES.filter((repo) => repo.tag === activeTag)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5);

  //오늘날짜 가져오기
  const today = new Date();
  const todayText = `${today.getMonth() + 1}.${today.getDate()}`;

  return (
    <aside className="side-area" aria-label="사이드바">
      <div className="side-bar">
        {/* <h2 className="h6 fw-bold mb-3">바로가기</h2>
        <nav className="nav flex-column">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `sidebar-link${isActive ? " active" : ""}`
              }
            >
              <i className={`bi ${item.icon} me-2`} aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <hr /> */}

        {/* 탭나누기 */}
        <div className="sidebar-tabs">
          <button
            type="button"
            className={`sidebar-tab${tab === "popular" ? " active" : ""}`}
            onClick={() => setTab("popular")}
          >
            인기 검색 순위
          </button>
          <button
            type="button"
            className={`sidebar-tab${tab === "recommend" ? " active" : ""}`}
            onClick={() => setTab("recommend")}
          >
            냥이 추천 주제
          </button>
        </div>

        {/* 인기 검색 순위 */}
        {tab === "popular" && (
          <>
            <div className="sidebar-title-row">
              <h2 className="sidebar-title">오늘의 냥이 픽</h2>
              <span className="sidebar-badge">{todayText} 기준</span>
            </div>
            <p className="sidebar-sub">지금 뜨는 레포지토리 TOP 7</p>

            {/*인기 레포지토리 목록 출력*/}
            <ol className="sidebar-rank-list">
              {popular.map((repo, i) => (
                <li key={repo.id} className="sidebar-rank-item">
                  <span className="sidebar-rank-no">{i + 1}</span>
                  {/*레포지토리 클릭하면 실제 페이지로 이동 */}
                  <a
                    className="sidebar-rank-name"
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sidebar-owner">{repo.owner.login}/</span>
                    <strong>{repo.name}</strong>
                  </a>
                  <span className="sidebar-rank-count">
                    ★ {repo.stargazers_count.toLocaleString()}
                  </span>
                </li>
              ))}
            </ol>

            {/*클릭하면 날짜 기반으로 검색한 페이지로 이동*/}
            <Link
              className="sidebar-more"
              to={`/search?q=${encodeURIComponent(`created:>${since}`)}&lang=`}
            >
              순위 전체 보기 →
            </Link>
          </>
        )}

        {/* 냥이 추천 주제 */}
        {tab === "recommend" && (
          <>
            <h2 className="sidebar-title">냥이 추천 주제</h2>
            <p className="sidebar-sub">집사님들이 많이 좋아요한 주제</p>

            <div className="sidebar-pills">
              {Object.keys(TAG).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`sidebar-pill${activeTag === tag ? " active" : ""}`}
                  onClick={() => setActiveTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/*태그+좋아요별 레포지토리 출력*/}
            <ol className="sidebar-rank-list">
              {recommend.map((repo, i) => (
                <li key={repo.name} className="sidebar-rank-item">
                  <span className="sidebar-rank-no">{i + 1}</span>
                  <a
                    className="sidebar-rank-name"
                    href={`https://github.com/${repo.owner}/${repo.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sidebar-owner">{repo.owner}/</span>
                    <strong>{repo.name}</strong>
                  </a>
                  <span className="sidebar-rank-count">♥ {repo.likes}</span>
                </li>
              ))}
            </ol>

            {/*프론트엔드 버튼 선택 → activeTag = "프론트엔드" → TAG["프론트엔드"] = "frontend" → 링크가 /search?q=frontend&lang=로 바뀜 → 클릭하면 검색 페이지에서 frontend 검색*/}
            <Link
              className="sidebar-more"
              to={`/search?q=${TAG[activeTag]}&lang=`}
            >
              주제 더 둘러보기 →
            </Link>
          </>
        )}
      </div>
    </aside>
  );
}
