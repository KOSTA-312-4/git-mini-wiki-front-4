import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="site-header">
      <nav className="navbar navbar-expand">
        <div className="container">
          <Link className="navbar-brand" to="/" aria-label="Git Nyang">
            Git Nyang
          </Link>

          <div className="navbar-nav ms-auto flex-row align-items-center gap-2 gap-sm-3">
            <Link className="nav-link header-link" to="/login">로그인</Link>
            <Link className="nav-link header-link" to="/signup">회원가입</Link>
            <Link className="nav-link header-link" to="/favorites">Favorite</Link>
            <Link className="nav-link header-link" to="/MyPage">마이페이지</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}