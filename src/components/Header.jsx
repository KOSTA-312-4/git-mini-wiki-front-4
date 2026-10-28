import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    <header className="site-header">
      <nav className="navbar navbar-expand">
        <div className="container">
          <Link className="navbar-brand" to="/" aria-label="Git Nyang">
            Git Nyang
          </Link>

          <div className="navbar-nav ms-auto flex-row align-items-center gap-2 gap-sm-3">
            <Link className="nav-link header-link" to="/favorites">
              Favorite
            </Link>

            <Link className="nav-link header-link" to="/board">
              커뮤니티
            </Link>

            {loginUser ? (
              <>
                <Link className="nav-link header-link" to="/mypage">
                  {loginUser.id} 님
                </Link>

                <button
                  type="button"
                  className="nav-link header-link btn btn-link"
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link className="nav-link header-link" to="/login">
                  로그인
                </Link>

                <Link className="nav-link header-link" to="/signup">
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
