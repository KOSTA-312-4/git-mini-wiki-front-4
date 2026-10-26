import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  loginSuccess,
  saveDemoSession,
} from "../store/authSlice";

import { loginDemoAccount } from "../utils/demoAccounts";

import "./LoginPage.css";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const normalizedId = userId.trim().toLowerCase();

    if (!normalizedId || !password) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await loginDemoAccount(
        normalizedId,
        password
      );

      const sessionSaved = saveDemoSession(user);

      if (!sessionSaved) {
        throw new Error("로그인 세션을 저장하지 못했습니다.");
      }

      dispatch(loginSuccess(user));

      setPassword("");

      navigate("/mypage", {
        replace: true,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "로그인에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <form
        className="login-card"
        onSubmit={handleSubmit}
      >
        <div className="login-header">
          <h1>Git Nyang</h1>
          <p>GitHub 저장소 탐색기</p>
        </div>

        <h2>로그인</h2>

        {location.state?.message && (
          <p
            className="alert alert-success"
            role="status"
          >
            {location.state.message}
          </p>
        )}

        {/* User ID */}
        <div className="login-field">
          <label htmlFor="login-user-id">
            아이디
          </label>

          <input
            id="login-user-id"
            type="text"
            placeholder="아이디를 입력하세요"
            autoComplete="username"
            value={userId}
            onChange={(event) =>
              setUserId(event.target.value)
            }
            required
          />
        </div>

        {/* Password */}
        <div className="login-field">
          <label htmlFor="login-password">
            비밀번호
          </label>

          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />
        </div>

        {/* Show Password */}
        <label className="login-show-password">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(event) =>
              setShowPassword(event.target.checked)
            }
          />
          비밀번호 표시
        </label>

        {/* Error Message */}
        {error && (
          <p
            className="login-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Login Button */}
        <button
          className="login-submit"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "로그인 중..."
            : "로그인"}
        </button>

        {/* Signup Link */}
        <div className="login-footer">
          <span>계정이 없으신가요? </span>
          <Link to="/signup">
            회원가입
          </Link>
        </div>
      </form>
    </main>
  );
}
