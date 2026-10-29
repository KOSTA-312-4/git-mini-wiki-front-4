import { useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout, updateProfile } from "../store/store";
import {
  alertError,
  changePasswordRequest,
  saveAvatarRequest,
  updateGithubRepo,
} from "../api/auth";
import { resizeToSquareJpeg } from "../utils/avatar";
import MyStats from "../components/MyStats.jsx";
import LevelBadge from "../components/LevelBadge.jsx";
import "./MyPage.css";

// 선택한 사진은 256x256 으로 줄여서 서버에 저장합니다. 너무 큰 원본 파일만 막습니다.
const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB
const AVATAR_TYPES = ["image/png", "image/jpeg", "image/webp"];
const GITHUB_REPO_PATTERN = /^https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/?$/;

const initialPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

// 비밀번호 변경 입력값 상태관리를 위한 reducer 함수
function passwordReducer(state, action) {
  switch (action.type) {
    case "CHANGE":
      return { ...state, [action.name]: action.value };
    case "RESET":
      return initialPasswordForm;
    default:
      return state;
  }
}

const MyPage = () => {
  // store.js 의 현재 로그인한 유저
  const loginUser = useSelector((state) => state.loginUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [repoInput, setRepoInput] = useState(loginUser?.githubRepo ?? "");
  // "프로필 수정" 을 눌렀을 때만 폼을 보여줌
  const [showEditForm, setShowEditForm] = useState(false);
  const [passwordForm, passwordDispatch] = useReducer(
    passwordReducer,
    initialPasswordForm,
  );

  if (!loginUser) {
    return (
      <div className="MyPage">
        <p className="mypage-login-needed">
          로그인이 필요합니다. <Link to="/login">로그인</Link>
        </p>
      </div>
    );
  }

  // 저장소에서 읽은 값이 이미지 데이터일 때만 표시
  const avatar = loginUser.avatar?.startsWith("data:image/") ? loginUser.avatar : null;

  // 프로필 사진 변경
  const changeAvatar = async (e) => {
    const file = e.target.files[0];
    // 같은 파일을 다시 선택해도 onChange 가 동작하도록 초기화
    e.target.value = "";
    if (!file) return;

    if (!AVATAR_TYPES.includes(file.type)) {
      alert("PNG, JPG, WEBP 이미지만 사용할 수 있습니다.");
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      alert("5MB 이하의 이미지를 선택해주세요.");
      return;
    }

    // 줄여서 서버에 저장한 뒤에 화면에 반영합니다. (실패하면 기존 사진 유지)
    try {
      const resized = await resizeToSquareJpeg(file);
      await saveAvatarRequest(resized);
      dispatch(updateProfile({ avatar: resized }));
    } catch (error) {
      // 서버 오류가 아니라 이미지를 읽지 못한 경우에는 그 메시지를 그대로 안내
      if (error.isAxiosError) alertError(error);
      else alert(error.message);
    }
  };

  // input 에 값이 입력될 때 비밀번호 폼 상태 값 수정
  const changePasswordValue = (e) => {
    passwordDispatch({ type: "CHANGE", name: e.target.name, value: e.target.value });
  };

  // 프로필 수정 폼 열기/닫기 (열 때 현재 레포 주소로, 닫을 때 비밀번호 입력값 초기화)
  const toggleEditForm = () => {
    if (showEditForm) {
      passwordDispatch({ type: "RESET" });
    } else {
      setRepoInput(loginUser.githubRepo ?? "");
    }
    setShowEditForm(!showEditForm);
  };

  // 프로필 수정 (GitHub 레포 주소, 비밀번호)
  const submitProfile = async (e) => {
    e.preventDefault();
    const url = repoInput.trim();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    // 비밀번호 칸을 하나라도 입력했을 때만 비밀번호를 변경
    const isChangingPassword = Boolean(currentPassword || newPassword || confirmPassword);

    if (url && !GITHUB_REPO_PATTERN.test(url)) {
      alert("https://github.com/아이디/레포이름 형식으로 입력해주세요.");
      return;
    }

    if (isChangingPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        alert("비밀번호를 변경하려면 비밀번호 칸을 모두 입력해주세요.");
        return;
      }

      if (newPassword === currentPassword) {
        alert("현재 비밀번호와 다른 비밀번호를 입력해주세요.");
        return;
      }

      if (newPassword !== confirmPassword) {
        alert("새 비밀번호가 일치하지 않습니다.");
        return;
      }
    }

    // 현재 비밀번호 확인은 서버가 합니다.
    try {
      await updateGithubRepo(url);
      dispatch(updateProfile({ githubRepo: url }));
      if (isChangingPassword) {
        await changePasswordRequest(currentPassword, newPassword);
      }
    } catch (error) {
      alertError(error);
      return;
    }

    passwordDispatch({ type: "RESET" });
    setShowEditForm(false);
    alert("프로필이 수정되었습니다.");
  };

  // 로그아웃 (sessionStorage 의 로그인 정보와 토큰도 store 에서 함께 삭제됨)
  const submitLogout = () => {
    if (!confirm("로그아웃 하시겠습니까?")) return;

    dispatch(logout());
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  return (
    <div className="MyPage">
      <section className="mypage-profile">
        <label className="mypage-avatar" title="프로필 사진 변경">
          {avatar ? (
            <img src={avatar} alt={`${loginUser.id} 프로필 사진`} />
          ) : (
            <span className="mypage-avatar-default" role="img" aria-label="기본 프로필 사진">
              🐱
            </span>
          )}
          <span className="mypage-avatar-edit">
            <i className="bi bi-camera" aria-hidden="true" />
          </span>
          <input
            type="file"
            accept={AVATAR_TYPES.join(",")}
            onChange={changeAvatar}
            aria-label="프로필 사진 변경"
          />
        </label>

        <div className="mypage-info">
          <h1 className="mypage-welcome">안녕하세요, {loginUser.id} 님!</h1>
          <p className="mypage-email">
            <i className="bi bi-envelope me-1" aria-hidden="true" />
            {loginUser.email}
          </p>

          {loginUser.githubRepo && (
            <a
              className="mypage-repo-link"
              href={loginUser.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-github me-1" aria-hidden="true" />
              {loginUser.githubRepo}
            </a>
          )}

          <button
            className="mypage-edit-toggle"
            type="button"
            onClick={toggleEditForm}
            aria-expanded={showEditForm}
            aria-controls="mypage-edit-form"
          >
            프로필 수정
            <i
              className={`bi ${showEditForm ? "bi-chevron-up" : "bi-chevron-down"} ms-1`}
              aria-hidden="true"
            />
          </button>

          {showEditForm && (
            <form id="mypage-edit-form" className="mypage-edit-form" onSubmit={submitProfile}>
              <label className="mypage-edit-label mypage-edit-label-wide">
                GitHub 레포 주소
                <input
                  className="form-control form-control-sm"
                  type="url"
                  value={repoInput}
                  onChange={(e) => setRepoInput(e.target.value)}
                  placeholder="https://github.com/아이디/레포이름"
                />
              </label>

              <fieldset className="mypage-edit-password">
                <legend>비밀번호 변경 (선택)</legend>
                <label className="mypage-edit-label">
                  현재 비밀번호
                  <input
                    className="form-control form-control-sm"
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={changePasswordValue}
                    autoComplete="current-password"
                  />
                </label>
                <label className="mypage-edit-label">
                  새 비밀번호
                  <input
                    className="form-control form-control-sm"
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={changePasswordValue}
                    autoComplete="new-password"
                  />
                </label>
                <label className="mypage-edit-label">
                  새 비밀번호 확인
                  <input
                    className="form-control form-control-sm"
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={changePasswordValue}
                    autoComplete="new-password"
                  />
                </label>
              </fieldset>

              <div className="mypage-edit-buttons">
                <button className="btn btn-sm mypage-edit-save" type="submit">
                  저장
                </button>
                <button className="btn btn-sm mypage-edit-cancel" type="button" onClick={toggleEditForm}>
                  취소
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 프로필 오른쪽: 레벨 이미지와 다음 레벨까지의 EXP */}
        {loginUser.level && (
          <div className="mypage-level" aria-label="내 레벨">
            <LevelBadge level={loginUser.level} size={96} className="mypage-level-img" />
            <strong className="mypage-level-name">Lv.{loginUser.level}</strong>
            <span className="mypage-level-exp">
              EXP {loginUser.EXP ?? 0}
              {loginUser.nextLevelExp ? ` / ${loginUser.nextLevelExp}` : " · 최고 레벨"}
            </span>
            {loginUser.nextLevelExp && (
              <span className="mypage-level-bar" aria-hidden="true">
                <i style={{ width: `${Math.min(100, ((loginUser.EXP ?? 0) / loginUser.nextLevelExp) * 100)}%` }} />
              </span>
            )}
          </div>
        )}
      </section>

      <MyStats />

      <div className="mypage-logout">
        <button className="btn btn-sm mypage-logout-button" type="button" onClick={submitLogout}>
          <i className="bi bi-box-arrow-right me-1" aria-hidden="true" />
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default MyPage;
