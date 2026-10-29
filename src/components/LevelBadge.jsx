import Lv1 from "../img/Lv1.png";
import Lv2 from "../img/Lv2.png";
import Lv3 from "../img/Lv3.png";
import Lv4 from "../img/Lv4.png";
import "./LevelBadge.css";

// 서버가 EXP 로 계산해 내려주는 level(1~4)에 맞는 이미지 (파일 이름 Lv{레벨}.png 와 번호가 같음)
const IMAGES = { 1: Lv1, 2: Lv2, 3: Lv3, 4: Lv4 };

/**
 * 유저 레벨 이미지. level 이 없으면(비회원, 오래된 로그인 정보 등) 아무것도 그리지 않습니다.
 * - size: 이미지 높이(px)
 */
export default function LevelBadge({ level, size = 20, className = "" }) {
  const src = IMAGES[level];
  if (!src) return null;

  return (
    <img
      className={`level-badge ${className}`.trim()}
      src={src}
      alt={`레벨 ${level}`}
      title={`Lv.${level}`}
      style={{ height: size }}
    />
  );
}
