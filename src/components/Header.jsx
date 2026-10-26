import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  logoutSuccess,
  clearDemoSession,
} from "../store/authSlice";
import "./Header.css";
import { useRef } from "react";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef();
  const detailRef = useRef('');

  // Redux에서 로그인 상태 가져오기
  const { user, isLoggedIn } = useSelector(
    (state) => state.auth
  );

  // 로그아웃 처리
  const handleLogout = () => {
    clearDemoSession();
    dispatch(logoutSuccess());

    navigate("/login", { replace: true });
  };

  function handleSearch(event) {
    event.preventDefault();
    if(inputRef.current.value == '') {
      alert('검색어를 입력해주세요.');
      inputRef.current.focus();
      return;
    }
    navigate(`/search?q=${inputRef.current.value}&lang=${detailRef.current}`);
  }

  return (
    <header className="site-header">
      <nav className="navbar navbar-expand">
        <div className="container">
          <Link
            className="navbar-brand"
            to="/"
            aria-label="Git Nyang"
          >
            Git Nyang
          </Link>

          <div className="navbar-nav ms-auto flex-row align-items-center gap-2 gap-sm-3">
            <form onSubmit={handleSearch} className="d-flex gap-2 mb-4">
        <input className="form-control" type="search" name="q" ref={inputRef} placeholder="검색어를 입력하세요." aria-label="검색어" defaultValue=''/>
        <select
                        onChange={(e) => detailRef.current = e.target.value}
                        style={{
                          padding: "10px",
                          marginLeft: "10px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          width: "150px",
                        }}
                      >
                        <option value="">언어 선택</option>
                        <option value="Java">Java</option>
                        <option value="Kotlin">Kotlin</option>
                        <option value="JavaScript">JavaScript</option>
                        <option value="Python">Python</option>
                        <option value="TypeScript">TypeScript</option>
                      </select>
                      <button className="btn btn-primary flex-shrink-0" type="submit">검색</button>
      </form>

            {isLoggedIn ? (
              <>
                {/* 로그인 상태 */}
                <span className="nav-link">
                  {user?.name}님
                </span>

                <Link
                  className="nav-link header-link"
                  to="/favorites">
                  Favorite
                </Link>

                <Link
                  className="nav-link header-link"
                  to="/board">
                  커뮤니티
                </Link>

                <Link
                  className="nav-link header-link"
                  to="/mypage">
                  마이페이지
                </Link>

                <button
                  type="button"
                  className="nav-link header-link border-0 bg-transparent"
                  onClick={handleLogout}>
                  로그아웃
                </button>
              </>):
            (
              <>
                {/* 로그아웃 상태 */}
                <Link
                  className="nav-link header-link"
                  to="/login">
                  로그인
                </Link>

                <Link
                  className="nav-link header-link"
                  to="/signup">
                  회원가입
                </Link>

                <Link
                  className="nav-link header-link"
                  to="/favorites">
                  Favorite
                </Link>

                <Link
                  className="nav-link header-link"
                  to="/board">
                  커뮤니티
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
