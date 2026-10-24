import React from "react";
import "../pages/GithubRepositories.css"; //기존 레포 출력 스타일 반영

function MyLikesCard({ repo }) {
  return (
    <article className="repo-card">
      {/*헤더*/}
      <div className="repo-card-header">
        <h2 className="repo-title">{repo.name}</h2>
        <button type="button" className="favorite-button is-favorite">
          ♥
        </button>
      </div>

      {/*프로필*/}
      <img
        className="repo-avatar"
        src={repo.owner.avatar_url}
        alt={repo.owner.login}
      />
      <p className="repo-description">{repo.description}</p>

      {/*본문*/}
      <div className="repo-details">
        {/*포크수, 스크랩 수 등*/}
        <div className="repo-stats">
          <p className="repo-stat">
            <strong>Stars:{repo.stargazers_count}</strong> 0
          </p>
          <p className="repo-stat">
            <strong>Forks:{repo.forks_count}</strong> 0
          </p>
          <p className="repo-stat">
            <strong>Language:{repo.language}</strong> 0
          </p>
        </div>

        {/*링크*/}
        <a className="repo-link" href={repo.html_url}>
          View on GitHub
        </a>
      </div>
    </article>
  );
}

export default MyLikesCard;
