import React, { useState } from "react";
import "./MyLikes.css";
import "../pages/GithubRepositories.css"; //기존 레포 출력 스타일 반영
import MyLikesCard from "./MyLikesCard";

function MyLikes() {
  // TODO: 더미 데이터 삭제
  const langs = ["Java", "JavaScript", "Python", "TypeScript", null];
  const DUMMY_FAVORITES = Array.from({ length: 24 }, (_, i) => {
    const n = i + 1;
    return {
      id: 1000 + n,
      name: `repo-${n}`,
      full_name: `user${n}/repo-${n}`,
      owner: { login: `user${n}`, avatar_url: "" },
      description: n % 7 === 0 ? null : `더미 설명 ${n}`,
      html_url: `https://github.com/user${n}/repo-${n}`,
      stargazers_count: n * 137,
      forks_count: n * 11,
      language: langs[i % langs.length],
    };
  });

  //=====페이지네이션====//
  const PAGE = 9; //한페이지에 9개만

  const [page, setPage] = useState(1); //1페이지 기본

  //TODO: 교체하기
  const [favorites, setFavorites] = useState(DUMMY_FAVORITES);

  //====검색====
  const [input, setInput] = useState("");

  //====언어별 필터====
  const [language, setLanguage] = useState("");

  //====정렬====
  const [sort, setSort] = useState("");

  //====데이터를 필터링 한 결과====
  const filteredFavorites = favorites.filter((repo) => {
    //검색
    const matchName = repo.name.toLowerCase().includes(input.toLowerCase()); //input값을 소문자로 + repo이름을 소문자로 만듦

    //언어별 필터
    const matchLanguage = language === "" ? true : repo.language === language; //language가 비어 있으면 모든 레포 출력

    //리턴
    return matchName ? matchLanguage : false; //검색어 입력안하면 항상 true, 언어 선택안하면 항상 '전체'
  });

  //=====sort 한 결과 정렬=====//
  const sortedFavorites =
    sort === "name"
      ? [...filteredFavorites].sort((a, b) => a.name.localeCompare(b.name)) //필터링된 결과를 기반으로 sort
      : favorites;

  //=====페이지 계산하기====//
  const totalPage = Math.ceil(sortedFavorites.length / PAGE);
  const start = (page - 1) * PAGE;
  const pageFavorites = sortedFavorites.slice(start, start + PAGE);

  return (
    <div>
      <h5>나의 좋아요</h5>

      {/*툴바영역(검색 칸, 언어별 필터, 정렬*/}
      <div className="myLike-toolbar">
        {/*TODO: description 검색 기능 구현*/}
        <input
          type="text"
          className="form-control myLike-search"
          placeholder="레포지토리 이름을 검색하세요."
          onChange={(e) => setInput(e.target.value.trim())}
          value={input}
        />
        <div className="myLike-select-container">
          <div className="language-filter">
            {/*언어별 필터*/}
            <label className="myLike-label">언어:</label>
            <select
              id="likeLanguage"
              className="myLike-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="">전체</option>
              <option value="Java">Java</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="TypeScript">TypeScript</option>
            </select>
          </div>
          {/*정렬*/}
          <div className="like-sort">
            <label className="myLike-label">정렬:</label>
            <select
              id="likeSort"
              className="myLike-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">전체</option>
              <option value="recent">최근 저장순</option>
              <option value="name">이름순</option>
            </select>
          </div>
        </div>
      </div>

      {/*좋아요 목록 조회 영역*/}
      {/*TODO: 실제 repo로 연결한 후 삭제 예장*/}
      <div className="myLike-list">
        {favorites.length === 0 ? (
          <p className="myLike-if-empty">
            아직 좋아요한 레포지토리가 없습니다.
          </p>
        ) : pageFavorites.length === 0 ? (
          <p className="myLike-if-empty">조건에 맞는 레포지토리가 없습니다.</p>
        ) : (
          pageFavorites.map((repo) => <MyLikesCard key={repo.id} repo={repo} />)
        )}
      </div>

      {/*페이지네이션*/}
      <div className="myLike-pagination">
        <button
          className="myLike-page-button"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          이전
        </button>

        <span className="myLike-page-number">
          {page} / {totalPage}
        </span>

        <button
          className="myLike-page-button"
          disabled={page === totalPage || totalPage === 0}
          onClick={() => setPage(page + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default MyLikes;
