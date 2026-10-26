import { getDemoAccounts } from "./demoAccounts";

const PROFILE_PREFIX = "gitnyang-profile-";
const REPOSITORY_PREFIX = "gitnyang-my-repositories-";

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function getUserExportData() {
  if (!import.meta.env.DEV) {
    throw new Error("개발 환경에서만 사용할 수 있습니다.");
  }

  const accounts = getDemoAccounts();

  return {
    users: accounts.map((account) => {
      const profile = readJSON(
        `${PROFILE_PREFIX}${account.id}`,
        {}
      );

      const repositories = readJSON(
        `${REPOSITORY_PREFIX}${account.id}`,
        []
      );

      return {
        id: account.id,
        email: account.email,
        passwordHash: account.passwordHash ?? null,
        salt: account.salt ?? null,
        name: profile.name ?? account.name ?? account.id,
        bio: profile.bio ?? "",
        avatar: profile.avatar ?? null,
        createdAt: account.createdAt ?? null,
        githubRepositories: Array.isArray(repositories)
          ? repositories
          : [],
      };
    }),
  };
}

export function downloadUserExport() {
  const data = getUserExportData();

  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "gitnyang-users.json";

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
