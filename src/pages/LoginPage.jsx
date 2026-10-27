import { useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/users.js";
import "./LoginPage.css";

const initialMember = {
  id: "",
  password: "",
};

// 인증에 필요한 id, password 상태관리를 위한 reducer 함수
function memberReducer(state, action) {
  switch (action.type) {
    case "CHANGE":
      return { ...state, [action.name]: action.value };
    case "RESET":
      return initialMember;
    default:
      return state;
  }
}

const LoginPage = () => {
  const [member, memberDispatch] = useReducer(memberReducer, initialMember);

  // store.js 의 users 배열
  const users = useSelector((state) => state.users);
  // dispatch는 store.js 로 요청보내주는 함수
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // input 에 값이 입력될 때 상태 값 수정
  const changeValue = (e) => {
    memberDispatch({ type: "CHANGE", name: e.target.name, value: e.target.value });
  };

  // 로그인
  const submitLogin = (e) => {
    e.preventDefault();

    if (!member.id || !member.password) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    const user = users.find(
      (item) => item.id === member.id && item.password === member.password,
    );

    if (!user) {
      alert("아이디 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    dispatch(login(user));
    alert(`${user.id}님, 환영합니다!`);
    memberDispatch({ type: "RESET" });
    navigate("/");
  };

  // 취소
  const cancelBack = () => {
    memberDispatch({ type: "RESET" });
    navigate(-1);
  };

  return (
    <form className="LoginPage" onSubmit={submitLogin}>
      <h1 className="login-title">로그인</h1>

      <label className="login-label">
        아이디
        <input
          className="form-control"
          type="text"
          name="id"
          value={member.id}
          onChange={changeValue}
          placeholder="아이디를 입력하세요."
        />
      </label>

      <label className="login-label">
        비밀번호
        <input
          className="form-control"
          type="password"
          name="password"
          value={member.password}
          onChange={changeValue}
          placeholder="비밀번호를 입력하세요."
        />
      </label>

      <div className="login-buttons">
        <button className="btn login-submit" type="submit">
          로그인
        </button>
        <button className="btn login-cancel" type="button" onClick={cancelBack}>
          취소
        </button>
      </div>

      <p className="login-footer">
        아직 회원이 아니신가요? <Link to="/signup">회원가입</Link>
      </p>
    </form>
  );
};

export default LoginPage;
