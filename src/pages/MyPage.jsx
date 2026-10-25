import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import {
  logoutSuccess,
  clearDemoSession,
  updateProfile,
  saveDemoProfile,
} from "../store/authSlice";

const MAX_IMAGE_SIZE = 1024 * 1024; // 1 MB

const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
];

export default function MyPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { user, isLoggedIn } = useSelector(
    (state) => state.auth
  );

  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(user?.name ?? "");
  const [draftBio, setDraftBio] = useState(user?.bio ?? "");
  const [error, setError] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleEdit = () => {
    setDraftName(user.name);
    setDraftBio(user.bio ?? "");
    setError("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraftName(user.name);
    setDraftBio(user.bio ?? "");
    setError("");
    setIsEditing(false);
  };

  const handleSave = (event) => {
    event.preventDefault();

    const name = draftName.trim();
    const bio = draftBio.trim();

    if (!name) {
      setError("이름을 입력해주세요.");
      return;
    }

    if (name.length > 30) {
      setError("이름은 30자 이하로 입력해주세요.");
      return;
    }

    if (bio.length > 200) {
      setError("자기소개는 200자 이하로 입력해주세요.");
      return;
    }

    const updatedProfile = {
      name,
      bio,
      avatar: user.avatar ?? null,
    };

    if (!saveDemoProfile(updatedProfile)) {
      setError("프로필 저장에 실패했습니다.");
      return;
    }

    dispatch(updateProfile(updatedProfile));
    setIsEditing(false);
    setError("");
  };

  const saveAvatar = (avatar) => {
    const updatedProfile = {
      name: user.name,
      bio: user.bio ?? "",
      avatar,
    };

    if (!saveDemoProfile(updatedProfile)) {
      setAvatarError("프로필 사진 저장에 실패했습니다.");
      return false;
    }

    dispatch(updateProfile({ avatar }));
    setAvatarError("");
    return true;
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    // Allow the same file to be selected again.
    event.target.value = "";

    if (!file) return;

    setAvatarError("");

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setAvatarError(
        "PNG, JPG, WEBP 이미지 파일만 업로드할 수 있습니다."
      );
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setAvatarError("이미지 크기는 1MB 이하여야 합니다.");
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string") {
        setAvatarError("이미지를 읽을 수 없습니다.");
        setIsUploading(false);
        return;
      }

      saveAvatar(result);
      setIsUploading(false);
    };

    reader.onerror = () => {
      setAvatarError("이미지를 읽는 중 오류가 발생했습니다.");
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    saveAvatar(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLogout = () => {
    clearDemoSession();
    dispatch(logoutSuccess());
    navigate("/login", { replace: true });
  };

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="mypage">
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h1 className="mb-4">마이페이지</h1>

          <div className="d-flex align-items-center gap-4 mb-4">
            <div
              className="rounded-circle overflow-hidden d-flex align-items-center justify-content-center border bg-light"
              style={{
                width: 110,
                height: 110,
                flexShrink: 0,
              }}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="프로필 사진"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <span
                  aria-label="기본 프로필"
                  role="img"
                  style={{ fontSize: 54 }}
                >
                  🐱
                </span>
              )}
            </div>

            <div>
              <h3>안녕하세요, {user.name}님!</h3>

              <p className="text-muted mb-2">
                이메일: {user.email}
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="d-none"
                id="profile-avatar"
                aria-label="프로필 사진 선택"
                onChange={handleAvatarChange}
                disabled={isUploading}
              />

              <div className="d-flex gap-2 flex-wrap">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? "업로드 중..." : "사진 변경"}
                </button>

                {user.avatar && (
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    disabled={isUploading}
                    onClick={handleRemoveAvatar}
                  >
                    사진 삭제
                  </button>
                )}
              </div>

              <small className="text-muted d-block mt-2">
                PNG, JPG, WEBP / 최대 1MB
              </small>

              {avatarError && (
                <p
                  className="text-danger mt-2 mb-0"
                  role="alert"
                >
                  {avatarError}
                </p>
              )}
            </div>
          </div>

          <hr />

          <section className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">내 프로필</h4>

              {!isEditing && (
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={handleEdit}
                >
                  프로필 수정
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSave}>
                <div className="mb-3">
                  <label
                    htmlFor="profile-name"
                    className="form-label"
                  >
                    이름
                  </label>

                  <input
                    id="profile-name"
                    type="text"
                    className="form-control"
                    value={draftName}
                    maxLength={30}
                    onChange={(event) =>
                      setDraftName(event.target.value)
                    }
                    placeholder="이름을 입력하세요"
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="profile-bio"
                    className="form-label"
                  >
                    자기소개
                  </label>

                  <textarea
                    id="profile-bio"
                    className="form-control"
                    rows={4}
                    maxLength={200}
                    value={draftBio}
                    onChange={(event) =>
                      setDraftBio(event.target.value)
                    }
                    placeholder="자신을 소개해주세요."
                  />

                  <div className="form-text">
                    {draftBio.length}/200자
                  </div>
                </div>

                {error && (
                  <p className="text-danger" role="alert">
                    {error}
                  </p>
                )}

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    저장
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCancel}
                  >
                    취소
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <p>
                  <strong>이름:</strong> {user.name}
                </p>

                <p>
                  <strong>자기소개:</strong>{" "}
                  {user.bio || "아직 자기소개가 없습니다."}
                </p>
              </div>
            )}
          </section>

          <hr />

          <section className="mb-4">
            <h4>내 메모</h4>
            <p>
              메모 작성, 수정, 삭제 기능은 추후 구현됩니다.
            </p>
          </section>

          <section className="mb-4">
            <h4>즐겨찾기 저장소</h4>
            <p>
              저장한 GitHub 저장소를 관리하는 기능은 추후 구현됩니다.
            </p>
          </section>

          <section className="mb-4">
            <h4>나의 XP</h4>
            <p>
              활동 점수 및 잔디 성장 기능은 추후 구현됩니다.
            </p>
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
