import { useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../store/users.js";
import "./SignupPage.css";

const initialForm = {
  email: "",
  id: "",
  password: "",
};

// 회원가입 입력값 상태관리를 위한 reducer 함수
function formReducer(state, action) {
  switch (action.type) {
    case "CHANGE":
      return { ...state, [action.name]: action.value };
    case "RESET":
      return initialForm;
    default:
      return state;
  }
}

const SignupPage = () => {
  const [form, formDispatch] = useReducer(formReducer, initialForm);

  // store.js 의 users 배열
  const users = useSelector((state) => state.users);
  // dispatch는 store.js 로 요청보내주는 함수
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // input 에 값이 입력될 때 상태 값 수정
  const changeValue = (e) => {
    formDispatch({
      type: "CHANGE",
      name: e.target.name,
      value: e.target.value,
    });
  };

  // 회원가입
  const submitSignup = (e) => {
    e.preventDefault();

    if (!form.email || !form.id || !form.password) {
      alert("이메일, 아이디, 비밀번호를 모두 입력해주세요.");
      return;
    }

    if (users.some((user) => user.id === form.id)) {
      alert("이미 사용 중인 아이디입니다.");
      return;
    }

    if (users.some((user) => user.email === form.email)) {
      alert("이미 가입된 이메일입니다.");
      return;
    }

    dispatch(addUser({ ...form, githubRepo: "", EXP: 0 }));
    alert(`${form.id}님, 회원가입이 완료되었습니다.`);
    formDispatch({ type: "RESET" });
    navigate("/login");
  };

  // 취소
  const cancelBack = () => {
    formDispatch({ type: "RESET" });
    navigate(-1);
  };

  return (
    <form className="SignupPage" onSubmit={submitSignup}>
      <h1 className="signup-title">회원가입</h1>

      <label className="signup-label">
        이메일
        <input
          className="form-control"
          type="email"
          name="email"
          value={form.email}
          onChange={changeValue}
          placeholder="example@email.com"
        />
      </label>

      <label className="signup-label">
        아이디
        <input
          className="form-control"
          type="text"
          name="id"
          value={form.id}
          onChange={changeValue}
          placeholder="아이디를 입력하세요."
        />
      </label>

      <label className="signup-label">
        비밀번호
        <input
          className="form-control"
          type="password"
          name="password"
          value={form.password}
          onChange={changeValue}
          placeholder="비밀번호를 입력하세요."
        />
      </label>

      <div className="signup-buttons">
        <button className="btn signup-submit" type="submit">
          회원가입
        </button>
        <button
          className="btn signup-cancel"
          type="button"
          onClick={cancelBack}
        >
          취소
        </button>
      </div>
    </form>
  );
};

export default SignupPage;
