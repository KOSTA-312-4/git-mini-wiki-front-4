import React from "react";
import "./MyLikes.css";
import "../pages/GithubRepositories.css"; //기존 레포 출력 스타일 반영

function MyLikes() {
  return (
    <div>
      <h5>나의 좋아요</h5>

      {/*툴바영역(검색 칸, 언어별 필터, 정렬*/}
      <div className="myLike-toolbar">
        <input
          type="text"
          className="form-control myLike-search"
          placeholder="검색어를 입력하세요."
        />
        <div className="myLike-select-container">
          <div className="language-filter">
            <label className="myLike-label">필터:</label>
          </div>
          <div className="like-sort">
            <label className="myLike-label">정렬:</label>
          </div>
        </div>
      </div>

      {/*좋아요 목록 조회 영역*/}
      <div className="myLike-list">
        {/*article1 */}
        <article className="repo-card">
          {/*헤더*/}
          <div className="repo-card-header">
            <h2 className="repo-title">레포 이름</h2>
            <button type="button" className="favorite-button is-favorite">
              ♥
            </button>
          </div>

          {/*프로필*/}
          <img className="repo-avatar" src="" alt="프로필" />
          <p className="repo-description">설명 문구</p>

          {/*본문*/}
          <div className="repo-details">
            {/*포크수, 스크랩 수 등*/}
            <div className="repo-stats">
              <p className="repo-stat">
                <strong>Stars:</strong> 0
              </p>
              <p className="repo-stat">
                <strong>Forks:</strong> 0
              </p>
              <p className="repo-stat">
                <strong>Language:</strong> 0
              </p>
            </div>

            {/*링크*/}
            <a className="repo-link" href="#">
              View on GitHub
            </a>
          </div>
        </article>

        {/* 세개의 열 확인용 : article3*/}
        <article className="repo-card">
          {/*헤더*/}
          <div className="repo-card-header">
            <h2 className="repo-title">레포 이름</h2>
            <button type="button" className="favorite-button is-favorite">
              ♥
            </button>
          </div>

          {/*프로필*/}
          <img className="repo-avatar" src="" alt="프로필" />
          <p className="repo-description">설명 문구</p>

          {/*본문*/}
          <div className="repo-details">
            {/*포크수, 스크랩 수 등*/}
            <div className="repo-stats">
              <p className="repo-stat">
                <strong>Stars:</strong> 0
              </p>
              <p className="repo-stat">
                <strong>Forks:</strong> 0
              </p>
              <p className="repo-stat">
                <strong>Language:</strong> 0
              </p>
            </div>

            {/*링크*/}
            <a className="repo-link" href="#">
              View on GitHub
            </a>
          </div>
        </article>

        {/* 세개의 열 확인용 : article2*/}
        <article className="repo-card">
          {/*헤더*/}
          <div className="repo-card-header">
            <h2 className="repo-title">레포 이름</h2>
            <button type="button" className="favorite-button is-favorite">
              ♥
            </button>
          </div>

          {/*프로필*/}
          <img className="repo-avatar" src="" alt="프로필" />
          <p className="repo-description">설명 문구</p>

          {/*본문*/}
          <div className="repo-details">
            {/*포크수, 스크랩 수 등*/}
            <div className="repo-stats">
              <p className="repo-stat">
                <strong>Stars:</strong> 0
              </p>
              <p className="repo-stat">
                <strong>Forks:</strong> 0
              </p>
              <p className="repo-stat">
                <strong>Language:</strong> 0
              </p>
            </div>

            {/*링크*/}
            <a className="repo-link" href="#">
              View on GitHub
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}

export default MyLikes;
