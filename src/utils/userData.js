import { getDemoAccounts } from "./demoAccounts";

const PROFILE_PREFIX = "gitnyang-profile-";
const REPOSITORY_PREFIX = "gitnyang-my-repositories-";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);

    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function getAllUserData() {
  const accounts = getDemoAccounts();

  return accounts.map((account) => {
    const profile = readJSON(`${PROFILE_PREFIX}${account.id}`, {});

    const repositories = readJSON(`${REPOSITORY_PREFIX}${account.id}`, []);

    const safeProfile =
      profile && typeof profile === "object" && !Array.isArray(profile)
        ? profile
        : {};

    const githubRepositories = Array.isArray(repositories)
      ? repositories
          .filter(
            (repo) =>
              repo &&
              typeof repo.url === "string" &&
              /^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/.test(repo.url),
          )
          .map((repo) => ({
            id: repo.id,
            name: repo.name,
            url: repo.url,
            createdAt: repo.createdAt ?? null,
          }))
      : [];

    return {
      id: account.id,
      email: account.email,
      name: safeProfile.name ?? account.name ?? account.id,
      bio: safeProfile.bio ?? "",
      avatar: safeProfile.avatar ?? null,
      createdAt: account.createdAt ?? null,
      githubRepositories,
    };
  });
}
