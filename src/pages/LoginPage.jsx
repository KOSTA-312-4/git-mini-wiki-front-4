import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginSuccess,
  DEMO_EMAIL,
  DEMO_PASSWORD,
  saveDemoSession,
} from "../store/authSlice";

import "./LoginPage.css";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 입력상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // 로그인 상태 처리
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // 비어있는 입력값 확인
    if (!email.trim() || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    // 이메일 형식 검증
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("올바른 이메일 주소를 입력해주세요.");
      return;
    }

    // 데모 계정 정보 확인
    const normalizedEmail = email.trim().toLowerCase();

    if (
      normalizedEmail !== DEMO_EMAIL ||
      password !== DEMO_PASSWORD
    ) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    // 새로운 데모 로그인 세션 저장
    saveDemoSession();

    // Redux 상태 업데이트
    dispatch(loginSuccess());

    // 비밀번호 입력 초기화
    setPassword("");

    // 마이페이지로 이동
    navigate("/mypage", { replace: true });
  };

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-header">
          <h1>Git Nyang</h1>
          <p>GitHub 저장소 탐색기</p>
        </div>

        <h2>로그인</h2>

        <div className="login-field">
          <label htmlFor="login-email">이메일</label>
          <input
            id="login-email"
            type="email"
            placeholder="example@email.com"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="login-field">
          <label htmlFor="login-password">비밀번호</label>
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <label className="login-show-password">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
          />
          비밀번호 표시
        </label>

        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}

        <button className="login-submit" type="submit">
          로그인
        </button>

        <div className="login-footer">
          <span>계정이 없으신가요?</span>
          <span> 회원가입은 추후 연결됩니다.</span>
        </div>
      </form>
    </main>
  );
}
