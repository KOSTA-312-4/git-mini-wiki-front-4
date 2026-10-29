import React, { useState } from "react";
import "./MyLikes.css";
import "../pages/GithubRepositories.css"; //기존 레포 출력 스타일 반영
import MyLikesCard from "./MyLikesCard";
import GlassSelect from "./GlassSelect.jsx";
import { languageOptions } from "../utils/langColors";
import { useSelector } from "react-redux";
import { selectMyFavorites } from "../store/store";

function MyLikes() {
  //로그인한 사용자의 좋아요 정보 가져오기
  const favorites = useSelector(selectMyFavorites);

  //=====페이지네이션====//
  const PAGE = 9; //한페이지에 9개만

  const [page, setPage] = useState(1); //1페이지 기본

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
  let sortedFavorites = filteredFavorites;
  if (sort === "name") {
    sortedFavorites = [...filteredFavorites].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  } else if (sort === "recent") {
    sortedFavorites = [...filteredFavorites].sort(
      (a, b) => b.savedTime - a.savedTime, //최근에 저장한 순
    );
  }

  //=====페이지 계산하기====//
  const totalPage = Math.ceil(sortedFavorites.length / PAGE);
  const start = (page - 1) * PAGE;
  const pageFavorites = sortedFavorites.slice(start, start + PAGE);

  return (
    <div>
      <h5>
        나의 좋아요 <small>총 {favorites.length}개</small>
      </h5>

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
            <GlassSelect
              options={languageOptions("전체", ["Java", "JavaScript", "Python", "TypeScript"])}
              value={language}
              onChange={setLanguage}
              ariaLabel="언어"
            />
          </div>
          {/*정렬*/}
          <div className="like-sort">
            <label className="myLike-label">정렬:</label>
            <GlassSelect
              options={[
                { value: "", label: "전체" },
                { value: "recent", label: "최근 저장순" },
                { value: "name", label: "이름순" },
              ]}
              value={sort}
              onChange={setSort}
              ariaLabel="정렬"
              align="right"
            />
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
