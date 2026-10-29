import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/store";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const detailRef = useRef("");

  // Redux에서 로그인 상태 가져오기
  // 유저 reducer 또는 백엔드 - sql 연동 시 유저 객체 내에 xp 추가
  // -> xp 수치에 따른 성장 레벨 이미지 변경 표시
  const loginUser = useSelector((s) => s.loginUser);
  const dispatch = useDispatch();
  // 프로필 사진: 저장된 값이 이미지 데이터일 때만 표시 (없으면 기본 사람 아이콘)
  const avatar = loginUser?.avatar?.startsWith("data:image/") ? loginUser.avatar : null;

  // 스크롤을 조금 내리면 헤더가 어두운 글라스로 바뀜
  const [scrolled, setScrolled] = useState(() => window.scrollY > 40);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 현재 페이지 메뉴는 흰 알약으로 표시
  const navClass = ({ isActive }) => (isActive ? "on" : undefined);

  function handleLogout() {
    dispatch(logout());
    navigate("/");
  }

  function handleSearch(event) {
    event.preventDefault();

    const query = inputRef.current?.value.trim() ?? "";

    if (!query) {
      alert("검색어를 입력해주세요.");
      inputRef.current?.focus();
      return;
    }

    const params = new URLSearchParams({
      q: query,
      lang: detailRef.current,
    });

    navigate(`/search?${params.toString()}`);
  }

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`}>
      <div className="gn-nav">
        <Link className="gn-brand" to="/" aria-label="깃냥이 홈">
          <span className="gn-logo">
            <img src="/gitnyang-mark.png" alt="" />
          </span>
          <span className="gn-brand-text">깃냥이</span>
        </Link>

        <nav className="gn-links" aria-label="주 메뉴">
          <NavLink to="/" end className={navClass}>
            홈
          </NavLink>
          <NavLink to="/favorites" className={navClass}>
            즐겨찾기
          </NavLink>
          <NavLink to="/board" className={navClass}>
            커뮤니티
          </NavLink>
        </nav>

        <div className="gn-actions">
          {loginUser ? (
            <>
              <Link className="gn-me" to="/mypage" aria-label="마이페이지">
                <span className="gn-profile">
                  {avatar ? (
                    <img src={avatar} alt="" />
                  ) : (
                    <svg viewBox="0 0 40 40" aria-hidden="true">
                      <circle cx="20" cy="15.5" r="6.8" fill="currentColor" />
                      <path d="M6.5 36c1.4-7.2 7-11 13.5-11s12.1 3.8 13.5 11z" fill="currentColor" />
                    </svg>
                  )}
                </span>
                <span className="gn-nick">{loginUser.id}</span>
              </Link>

              <button type="button" className="gn-logout" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link className="gn-login" to="/login">
                로그인
              </Link>

              <Link className="gn-signup" to="/signup">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
