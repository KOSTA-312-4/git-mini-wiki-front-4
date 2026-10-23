import {useState} from "react";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("올바른 이메일 주소를 입력해주세요.");
      return;
    }

    setError("로그인 서버 연결 전입니다.");
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
