import { useState } from "react";

const STORAGE_PREFIX = "gitnyang-my-repositories-";

function getStorageKey(userId) {
  return `${STORAGE_PREFIX}${userId}`;
}

function loadRepositories(userId) {
  if (!userId) return [];

  try {
    const saved = JSON.parse(
      localStorage.getItem(getStorageKey(userId)) || "[]"
    );

    if (!Array.isArray(saved)) return [];

    return saved.filter(
      (repo) =>
        repo &&
        typeof repo.id === "string" &&
        typeof repo.url === "string" &&
        typeof repo.name === "string"
    );
  } catch {
    return [];
  }
}

function parseGitHubUrl(input) {
  try {
    const url = new URL(input.trim());

    if (
      url.protocol !== "https:" ||
      url.hostname.toLowerCase() !== "github.com" ||
      url.username ||
      url.password ||
      url.port ||
      url.search ||
      url.hash
    ) {
      return null;
    }

    const parts = url.pathname
      .split("/")
      .filter(Boolean);

    if (parts.length !== 2) return null;

    const [owner, rawRepository] = parts;
    const repository = rawRepository.replace(/\.git$/i, "");

    const validPart = /^[a-zA-Z0-9_.-]+$/;

    if (
      !validPart.test(owner) ||
      !validPart.test(repository) ||
      owner === "." ||
      owner === ".." ||
      repository === "." ||
      repository === ".."
    ) {
      return null;
    }

    return {
      name: `${owner}/${repository}`,
      url: `https://github.com/${owner}/${repository}`,
    };
  } catch {
    return null;
  }
}

export default function MyRepositories({ userId }) {
  const [repositories, setRepositories] = useState(
    () => loadRepositories(userId)
  );
  const [loadedUserId, setLoadedUserId] = useState(userId);
  const [inputUrl, setInputUrl] = useState("");
  const [error, setError] = useState("");

  // 계정이 변경될 때 각 사용자의 저장소가 섞이지 않도록 합니다.
  const visibleRepositories =
    loadedUserId === userId
      ? repositories
      : loadRepositories(userId);

  const updateRepositories = (nextRepositories) => {
    try {
      localStorage.setItem(
        getStorageKey(userId),
        JSON.stringify(nextRepositories)
      );

      setRepositories(nextRepositories);
      setLoadedUserId(userId);

      return true;
    } catch {
      setError("저장에 실패했습니다. 브라우저 저장 공간을 확인해주세요.");
      return false;
    }
  };

  const handleAdd = (event) => {
    event.preventDefault();
    setError("");

    if (!userId) {
      setError("로그인이 필요합니다.");
      return;
    }

    const parsed = parseGitHubUrl(inputUrl);

    if (!parsed) {
      setError(
        "올바른 GitHub 저장소 주소를 입력해주세요. 예: https://github.com/facebook/react"
      );
      return;
    }

    const exists = visibleRepositories.some(
      (repo) =>
        repo.url.toLowerCase() === parsed.url.toLowerCase()
    );

    if (exists) {
      setError("이미 등록된 저장소입니다.");
      return;
    }

    const newRepository = {
      id: crypto.randomUUID(),
      name: parsed.name,
      url: parsed.url,
      createdAt: new Date().toISOString(),
    };

    const saved = updateRepositories([
      newRepository,
      ...visibleRepositories,
    ]);

    if (saved) {
      setInputUrl("");
    }
  };

  const handleDelete = (repositoryId) => {
    setError("");

    const nextRepositories = visibleRepositories.filter(
      (repo) => repo.id !== repositoryId
    );

    updateRepositories(nextRepositories);
  };

  return (
    <section className="mb-4">
      <h4 className="mb-3">내 GitHub 저장소</h4>

      <p className="text-muted">
        나의 GitHub 저장소 주소를 등록하고 관리할 수 있습니다.
      </p>

      <form onSubmit={handleAdd} className="mb-3">
        <label
          htmlFor="my-repository-url"
          className="form-label"
        >
          GitHub 저장소 URL
        </label>

        <div className="d-flex gap-2">
          <input
            id="my-repository-url"
            type="url"
            className="form-control"
            placeholder="https://github.com/owner/repository"
            value={inputUrl}
            onChange={(event) =>
              setInputUrl(event.target.value)
            }
            required
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={!userId}
          >
            등록
          </button>
        </div>
      </form>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {visibleRepositories.length === 0 ? (
        <p className="text-muted">
          아직 등록한 GitHub 저장소가 없습니다.
        </p>
      ) : (
        <div className="list-group">
          {visibleRepositories.map((repo) => (
            <div
              key={repo.id}
              className="list-group-item d-flex justify-content-between align-items-center gap-3"
            >
              <div className="text-break">
                <strong>{repo.name}</strong>

                <div>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {repo.url}
                  </a>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-outline-danger btn-sm flex-shrink-0"
                onClick={() => handleDelete(repo.id)}
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
