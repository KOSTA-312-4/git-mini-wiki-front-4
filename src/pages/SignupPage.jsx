import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerDemoAccount } from "../utils/demoAccounts";
import "./LoginPage.css";

export default function SignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedId = userId.trim().toLowerCase();

    if (
      !normalizedEmail ||
      !normalizedId ||
      !password ||
      !confirmPassword
    ) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("올바른 이메일 주소를 입력해주세요.");
      return;
    }

    if (!/^[a-z0-9_]{4,20}$/.test(normalizedId)) {
      setError(
        "아이디는 영문 소문자, 숫자, 밑줄(_) 4~20자로 입력해주세요."
      );
      return;
    }

    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerDemoAccount({
        email: normalizedEmail,
        userId: normalizedId,
        password,
      });

      navigate("/login", {
        replace: true,
        state: {
          message: "회원가입이 완료되었습니다. 로그인해주세요.",
        },
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "회원가입에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="container py-5"
      style={{ maxWidth: 480 }}
    >
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h2 className="text-center mb-2">
            Git Nyang
          </h2>

          <h4 className="text-center mb-4">
            회원가입
          </h4>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-3">
              <label
                htmlFor="signup-email"
                className="form-label"
              >
                이메일
              </label>

              <input
                id="signup-email"
                type="email"
                className="form-control"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            {/* User ID */}
            <div className="mb-3">
              <label
                htmlFor="signup-id"
                className="form-label"
              >
                아이디
              </label>

              <input
                id="signup-id"
                type="text"
                className="form-control"
                placeholder="아이디 (4~20자)"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                autoComplete="username"
                minLength={4}
                maxLength={20}
                required
              />

              <small className="text-muted">
                영문 소문자, 숫자, 밑줄(_) 사용 가능
              </small>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label
                htmlFor="signup-password"
                className="form-label"
              >
                비밀번호
              </label>

              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="8자 이상 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <label
                htmlFor="signup-confirm"
                className="form-label"
              >
                비밀번호 확인
              </label>

              <input
                id="signup-confirm"
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="비밀번호 다시 입력"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                autoComplete="new-password"
                required
              />
            </div>

            {/* Show Password */}
            <div className="form-check mb-3">
              <input
                id="signup-show-password"
                type="checkbox"
                className="form-check-input"
                checked={showPassword}
                onChange={(e) =>
                  setShowPassword(e.target.checked)
                }
              />

              <label
                htmlFor="signup-show-password"
                className="form-check-label"
              >
                비밀번호 표시
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="alert alert-danger"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "가입 중..."
                : "회원가입"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-3 mb-0">
            이미 계정이 있으신가요?{" "}
            <Link to="/login">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
