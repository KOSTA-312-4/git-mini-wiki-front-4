import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GlassSelect from "../components/GlassSelect.jsx";
import { languageOptions } from "../utils/langColors";
import "./HomePage.css";

// 추천 검색어: 누르면 검색창에 넣지 않고 바로 검색 결과로 이동
const QUICK_WORDS = ["리액트 투두앱", "스프링 게시판", "파이썬 크롤링", "코딩테스트"];
const LANGUAGE_OPTIONS = languageOptions("언어 선택");

function HomePage() {
  const navigate = useNavigate();

  const inputRef = useRef();
  const detailRef = useRef("");

  function handleSearch(event) {
    event.preventDefault();
    if (inputRef.current.value == "") {
      alert("검색어를 입력해주세요.");
      inputRef.current.focus();
      return;
    }
    navigate(`/search?${new URLSearchParams({ q: inputRef.current.value, lang: detailRef.current })}`);
  }

  // 추천 검색어로 바로 검색 (선택한 언어는 그대로 적용)
  function searchQuickWord(word) {
    navigate(`/search?${new URLSearchParams({ q: word, lang: detailRef.current })}`);
  }

  // "/" 키를 누르면 검색창으로 이동 (다른 입력칸에서 타이핑 중일 때는 제외)
  useEffect(() => {
    const focusSearch = (event) => {
      const target = event.target;
      if (event.key !== "/" || target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  return (
    <section className="home-panel" aria-label="검색">
      <div className="home-deco" aria-hidden="true">
        <img className="home-watermark" src="/gitnyang-mark.png" alt="" />
      </div>

      {/* 가운데 로고: 글라스 오브 + 은은한 링/빛 */}
      <div className="home-logo">
        <div className="home-stage" aria-hidden="true">
          <i className="home-halo" />
          <i className="home-ring home-ring-2" />
          <i className="home-ring home-ring-1" />
          <div className="home-orb">
            <img src="/gitnyang-mark.png" alt="" />
          </div>
          <i className="home-orbit">
            <u />
          </i>
        </div>
        <p className="home-pill">
          <span className="home-spark">✦</span>GitHub이 처음이어도, 깃냥이가 레포지토리를 찾아줄게요
        </p>
      </div>

      <div className="home-mid">
        <form onSubmit={handleSearch} className="home-search">
          <GlassSelect
            icon
            options={LANGUAGE_OPTIONS}
            onChange={(value) => (detailRef.current = value)}
            ariaLabel="언어 선택"
          />
          <i className="home-sep" aria-hidden="true" />
          <input
            type="search"
            name="q"
            ref={inputRef}
            placeholder="초보자를 위한 GitHub 레포지토리 검색 (예: 리액트 투두앱)"
            aria-label="검색어"
            autoComplete="off"
            defaultValue=""
          />
          <span className="home-kbd" aria-hidden="true">
            /
          </span>
          <button className="btn btn-primary" type="submit">
            검색
          </button>
        </form>

        <div className="home-quick">
          <span>추천 검색어</span>
          {QUICK_WORDS.map((word, index) => (
            <button key={word} type="button" style={{ animationDelay: `${index * 60}ms` }} onClick={() => searchQuickWord(word)}>
              {word}
            </button>
          ))}
        </div>
      </div>

      {/* 용어 안내 */}
      <div className="home-glossary" role="note" aria-label="용어 안내">
        <span className="home-glossary-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5" />
            <path d="M12 7.5h.01" />
          </svg>
          용어 안내
        </span>
        <div className="home-glossary-items">
          <div className="home-gloss">
            <i>★</i>
            <div>
              <b>star</b>
              <small>관심 있는 레포지토리를 즐겨찾기처럼 저장해요.</small>
            </div>
          </div>
          <div className="home-gloss">
            <i>⑂</i>
            <div>
              <b>fork</b>
              <small>다른 사람의 레포지토리를 복사해 수정할 수 있어요.</small>
            </div>
          </div>
          <div className="home-gloss">
            <i>▣</i>
            <div>
              <b>Repository</b>
              <small>프로젝트 저장소</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
