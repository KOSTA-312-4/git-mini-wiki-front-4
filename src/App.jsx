import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import GithubRepositories from "./pages/GithubRepositories.jsx";
import Board from "./pages/Board.jsx";
import Favorites from "./pages/Favorites.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import "./App.css";

export default function App() {
  const { pathname } = useLocation();
  // 로그인/회원가입 페이지는 Sidebar 없이 단일 열로 표시합니다.
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <div className="app-shell">
      <Header />

      <div className={`container page-layout${isAuthPage ? " page-layout-auth" : ""}`}>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<GithubRepositories />} />
            <Route path="/board" element={<Board />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {!isAuthPage && <Sidebar />}
      </div>

      <Footer />
    </div>
  );
}
