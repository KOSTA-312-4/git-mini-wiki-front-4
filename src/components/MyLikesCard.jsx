import React from "react";
import "../pages/GithubRepositories.css"; //기존 레포 출력 스타일 반영
import { addRepoTag, selectUserEmail, toggleFavorite } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import TagPicker from "./TagPicker.jsx";
import { langColor } from "../utils/langColors";

function MyLikesCard({ repo }) {
  const dispatch = useDispatch();
  const userEmail = useSelector(selectUserEmail);

  return (
    <article className="repo-card" data-tag={repo.tag || undefined}>
      {/*헤더*/}
      <div className="repo-card-header">
        <h2 className="repo-title">{repo.name}</h2>
        {/*태그 설정*/}
        <button
          type="button"
          className="favorite-button is-favorite"
          onClick={() => dispatch(toggleFavorite({ repo, userEmail }))}
        >
          ♥
        </button>
      </div>

      {/*태그 설정*/}
      <TagPicker
        value={repo.tag ?? ""}
        onChange={(tag) =>
          dispatch(addRepoTag({ repoId: repo.id, userEmail, tag }))
        }
      />

      {/*프로필*/}
      <div className="repo-owner">
        <img
          className="repo-avatar"
          src={repo.owner.avatar_url}
          alt={repo.owner.login}
        />
        <small>{repo.owner.login}</small>
      </div>
      <p className={`repo-description${repo.description ? "" : " none"}`}>
        {repo.description || "설명이 없습니다."}
      </p>

      {/*본문*/}
      <div className="repo-details">
        {/*포크수, 스크랩 수 등*/}
        <div className="repo-stats">
          <p className="repo-stat">
            <strong>Stars:</strong>
            <span className="star">★ {(repo.stargazers_count ?? 0).toLocaleString()}</span>
          </p>
          <p className="repo-stat">
            <strong>Forks:</strong>
            <span>{(repo.forks_count ?? 0).toLocaleString()}</span>
          </p>
          <p className="repo-stat">
            <strong>Language:</strong>
            <span>
              {repo.language && <i className="lang-dot" style={{ "--c": langColor(repo.language) }} />}
              {repo.language ?? "정보 없음"}
            </span>
          </p>
        </div>

        {/*링크*/}
        <a className="repo-link" href={repo.html_url}>
          View on GitHub ↗
        </a>
      </div>
    </article>
  );
}

export default MyLikesCard;
