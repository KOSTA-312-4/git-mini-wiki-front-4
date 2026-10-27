import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const detailRef = useRef("");

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
            <form onSubmit={handleSearch} className="d-flex gap-2 mb-4">
              <input
                className="form-control"
                type="search"
                name="q"
                ref={inputRef}
                placeholder="검색어를 입력하세요."
                aria-label="검색어"
              />

              <select
                onChange={(event) => {
                  detailRef.current = event.target.value;
                }}
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

              <button className="btn btn-primary flex-shrink-0" type="submit">
                검색
              </button>
            </form>

            <Link className="nav-link header-link" to="/favorites">
              Favorite
            </Link>

            <Link className="nav-link header-link" to="/board">
              커뮤니티
            </Link>

            <Link className="nav-link header-link" to="/login">
              로그인
            </Link>

            <Link className="nav-link header-link" to="/signup">
              회원가입
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
