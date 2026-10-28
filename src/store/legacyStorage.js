// 서버에 저장하기 전 버전이 브라우저(localStorage)에 남긴 데이터 키들입니다.
// 지금은 모두 서버에 저장하므로 읽지 않고, 앱을 시작할 때 지웁니다.
// (회원 목록에는 평문 비밀번호가 들어 있었으므로 특히 남겨 두지 않습니다.)
const LEGACY_KEYS = [
  "gitnyang-users",
  "github-repository-favorites",
  "gitnyang-baskets",
  "gitnyang-board",
];

export function removeLegacyStorage() {
  try {
    LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch {
    // 저장소를 쓸 수 없으면 무시
  }
}
