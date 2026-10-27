import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { updateProfile } from "../store/users.js";
import "./MyPage.css";

// 프로필 사진은 localStorage 에 저장되므로 크기를 제한합니다.
const MAX_AVATAR_SIZE = 1024 * 1024; // 1MB
const AVATAR_TYPES = ["image/png", "image/jpeg", "image/webp"];
const GITHUB_REPO_PATTERN = /^https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/?$/;

const MyPage = () => {
  // store.js 의 현재 로그인한 유저
  const loginUser = useSelector((state) => state.loginUser);
  const dispatch = useDispatch();
  const [repoInput, setRepoInput] = useState(loginUser?.githubRepo ?? "");

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
  const changeAvatar = (e) => {
    const file = e.target.files[0];
    // 같은 파일을 다시 선택해도 onChange 가 동작하도록 초기화
    e.target.value = "";
    if (!file) return;

    if (!AVATAR_TYPES.includes(file.type)) {
      alert("PNG, JPG, WEBP 이미지만 사용할 수 있습니다.");
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      alert("1MB 이하의 이미지를 선택해주세요.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      dispatch(updateProfile({ id: loginUser.id, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // GitHub 레포 주소 저장
  const submitRepo = (e) => {
    e.preventDefault();
    const url = repoInput.trim();

    if (url && !GITHUB_REPO_PATTERN.test(url)) {
      alert("https://github.com/아이디/레포이름 형식으로 입력해주세요.");
      return;
    }

    dispatch(updateProfile({ id: loginUser.id, githubRepo: url }));
    alert(url ? "GitHub 레포 주소가 저장되었습니다." : "GitHub 레포 주소가 삭제되었습니다.");
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

          <form className="mypage-repo" onSubmit={submitRepo}>
            <i className="bi bi-github" aria-hidden="true" />
            <input
              className="form-control form-control-sm"
              type="url"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              placeholder="https://github.com/아이디/레포이름"
              aria-label="GitHub 레포 주소"
            />
            <button className="btn btn-sm mypage-repo-save" type="submit">
              저장
            </button>
          </form>

          {loginUser.githubRepo && (
            <a
              className="mypage-repo-link"
              href={loginUser.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
            >
              {loginUser.githubRepo}
            </a>
          )}
        </div>
      </section>
    </div>
  );
};

export default MyPage;
