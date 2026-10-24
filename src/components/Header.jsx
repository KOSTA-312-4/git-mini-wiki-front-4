import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  logoutSuccess,
  clearDemoSession,
} from "../store/authSlice";
import "./Header.css";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
