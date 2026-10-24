import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import {
  logoutSuccess,
  clearDemoSession,
} from "../store/authSlice";

export default function MyPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux에서 로그인 사용자 정보 가져오기
  const { user, isLoggedIn } = useSelector(
    (state) => state.auth
  );

  // 로그아웃 처리
  const handleLogout = () => {
    clearDemoSession();
    dispatch(logoutSuccess());

    navigate("/login", { replace: true });
  };

  // 로그인하지 않은 사용자 접근 제한
  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="mypage">
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h1 className="mb-4">마이페이지</h1>

          <h3>안녕하세요, {user.name}님!</h3>

          <p className="text-muted">
            이메일: {user.email}
          </p>

          <hr />

          <section className="mb-4">
            <h4>내 프로필</h4>
            <p>프로필 사진 및 자기소개 기능은 추후 구현됩니다.</p>
          </section>

          <section className="mb-4">
            <h4>내 메모</h4>
            <p>메모 작성, 수정, 삭제 기능은 추후 구현됩니다.</p>
          </section>

          <section className="mb-4">
            <h4>즐겨찾기 저장소</h4>
            <p>저장한 GitHub 저장소를 관리하는 기능은 추후 구현됩니다.</p>
          </section>

          <section className="mb-4">
            <h4>나의 XP</h4>
            <p>활동 점수 및 잔디 성장 기능은 추후 구현됩니다.</p>
          </section>

          <button
            type="button"
            className="btn btn-danger"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
