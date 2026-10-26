const ACCOUNTS_KEY = "gitnyang-demo-accounts";

// 프론트엔드 전용 데모입니다.
// 실제 서비스의 인증 용도로 사용하지 마세요.

function readAccounts() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(ACCOUNTS_KEY) || "[]"
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function normalizeId(id) {
  return id.trim().toLowerCase();
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

// 데모용 비밀번호 검증값을 생성합니다.
// 서버 측 인증을 대체할 수 없습니다.
async function derivePassword(password, salt) {
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: Uint8Array.fromHex
        ? Uint8Array.fromHex(salt)
        : new Uint8Array(
            salt.match(/.{2}/g).map((x) => parseInt(x, 16))
          ),
      iterations: 200000,
      hash: "SHA-256",
    },
    key,
    256
  );

  return Array.from(new Uint8Array(bits))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function createSalt() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function registerDemoAccount({
  email,
  userId,
  password,
}) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedId = normalizeId(userId);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error("올바른 이메일 주소를 입력해주세요.");
  }

  if (!/^[a-z0-9_]{4,20}$/.test(normalizedId)) {
    throw new Error("아이디는 영문 소문자, 숫자, _ 4~20자로 입력해주세요.");
  }

  if (password.length < 8) {
    throw new Error("비밀번호는 8자 이상이어야 합니다.");
  }

  const accounts = readAccounts();

  if (accounts.some((account) => account.id === normalizedId)) {
    throw new Error("이미 사용 중인 아이디입니다.");
  }

  if (accounts.some((account) => account.email === normalizedEmail)) {
    throw new Error("이미 등록된 이메일입니다.");
  }

  const salt = createSalt();
  const passwordHash = await derivePassword(password, salt);

  const account = {
    id: normalizedId,
    email: normalizedEmail,
    name: normalizedId,
    salt,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  // Recheck after asynchronous hashing.
  const latest = readAccounts();

  if (
    latest.some(
      (item) =>
        item.id === normalizedId ||
        item.email === normalizedEmail
    )
  ) {
    throw new Error("이미 등록된 아이디 또는 이메일입니다.");
  }

  localStorage.setItem(
    ACCOUNTS_KEY,
    JSON.stringify([...latest, account])
  );

  return {
    id: account.id,
    email: account.email,
    name: account.name,
    bio: "",
    avatar: null,
  };
}

export async function loginDemoAccount(userId, password) {
  const id = normalizeId(userId);

  const account = readAccounts().find(
    (item) => item.id === id
  );

  if (!account) {
    throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
  }

  const candidateHash = await derivePassword(
    password,
    account.salt
  );

  if (candidateHash !== account.passwordHash) {
    throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
  }

  return {
    id: account.id,
    email: account.email,
    name: account.name,
    bio: "",
    avatar: null,
  };
}
