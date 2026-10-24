import { useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function HomePage() {
    let loginUser = useSelector((s) => s.auth);
    // console.log(loginUser.user); 유저 정보
    // console.log(loginUser.isLoggedIn); 로그인 여부
    const navigate = useNavigate();

    const inputRef = useRef();
    const detailRef = useRef('');

    function handleSearch(event) {
    event.preventDefault();
    if(inputRef.current.value == '') {
      alert('검색어를 입력해주세요.');
      inputRef.current.focus();
      return;
    }
    navigate(`/search?q=${inputRef.current.value}&lang=${detailRef.current}`);
  }

  return (
    <>
    <form onSubmit={handleSearch} className="d-flex gap-2 mb-4">
        <input className="form-control" type="search" name="q" ref={inputRef} placeholder="검색어를 입력하세요." aria-label="검색어" defaultValue=''/>
        <select
                        onChange={(e) => detailRef.current = e.target.value}
                        style={{
                          padding: "10px",
                          marginLeft: "10px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          width: "150px",
                        }}
                      >
                        <option value="">언어 선택</option>
                        <option value="Java">Java</option>
                        <option value="Kotlin">Kotlin</option>
                        <option value="JavaScript">JavaScript</option>
                        <option value="Python">Python</option>
                        <option value="TypeScript">TypeScript</option>
                      </select>
                      <button className="btn btn-primary flex-shrink-0" type="submit">검색</button>
      </form>
      </>
  )
}

export default HomePage