import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import GithubRepositories from "./pages/GithubRepositories.jsx";
import MyPage from "./pages/MyPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
// import SignupPage from './pages/SignupPage.jsx';
import Board from './pages/Board.jsx';
import "./App.css";
import Favorites from "./pages/Favorites.jsx";

const AUTH_PATHS = ["/login", "/signup"];

export default function App() {
  const { pathname } = useLocation();
  const isAuthPage = AUTH_PATHS.includes(pathname);

  return (
    <div className="app-shell">
      <Header />

      <div
        className={`container page-layout${isAuthPage ? " page-layout-auth" : ""}`}
      >
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<GithubRepositories />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/mypage" element={<MyPage />} />
            {/* <Route path="/signup" element={<SignupPage />} /> */}
            <Route path="/board" element={<Board />} />
            <Route path="/favorites" element={<Favorites />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* 로그인과 회원가입 화면에서는 Sidebar를 렌더링하지 않습니다. */}
        {!isAuthPage && <Sidebar />}
      </div>

      <Footer />
    </div>
  );
}
