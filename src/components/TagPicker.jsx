import { useEffect, useRef, useState } from "react";
import "./TagPicker.css";

const TAGS = ["백엔드", "프론트엔드", "DB"];

const Check = () => (
  <svg
    className="tagpick-ck"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/**
 * 좋아요 카드의 태그 선택기: 색이 있는 "# 태그" 버튼을 누르면 태그 목록이 펼쳐짐
 * - value: 지금 태그 ("" 이면 태그 없음), onChange(tag): 고른 태그를 알려줌
 */
export default function TagPicker({ value = "", onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  // 펼쳐져 있을 때 바깥을 누르거나 Esc 를 누르면 닫기
  useEffect(() => {
    if (!open) return undefined;
    const closeOnOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const choose = (tag) => {
    setOpen(false);
    if (tag !== value) onChange?.(tag);
  };

  return (
    <div
      ref={rootRef}
      className={`tagpick${open ? " is-open" : ""}`}
      data-tag={value || undefined}
    >
      <button
        type="button"
        className={`tagpick-btn${value ? "" : " is-empty"}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={value ? `태그: ${value} (바꾸기)` : "태그 추가"}
        onClick={() => setOpen(!open)}
      >
        {value ? (
          <>
            <i>#</i>
            {value}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </>
        ) : (
          "+ 태그 추가"
        )}
      </button>

      <ul className="tagpick-pop" role="listbox" aria-label="태그 선택">
        {TAGS.map((tag) => (
          <li
            key={tag}
            role="option"
            aria-selected={tag === value}
            data-tag={tag}
            onClick={() => choose(tag)}
          >
            <span className="tag-chip" data-tag={tag}>
              {tag}
            </span>
            <Check />
          </li>
        ))}
        <li
          role="option"
          aria-selected={!value}
          className="is-none"
          onClick={() => choose("")}
        >
          <span>태그 없음</span>
          <Check />
        </li>
      </ul>
    </div>
  );
}
