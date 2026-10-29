import { useEffect, useId, useRef, useState } from "react";
import "./GlassSelect.css";

const CodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m16 18 6-6-6-6" />
    <path d="m8 6-6 6 6 6" />
  </svg>
);

/**
 * 글라스 드롭다운: 기본 <select> 대신 쓰는 선택 상자. 펼친 목록까지 디자인돼요.
 * - options: [{ value, label, color? }]  (color 가 있으면 왼쪽에 색 점)
 * - value 를 넘기면 바깥에서 값을 관리하고, 안 넘기면 defaultValue 로 시작해 스스로 기억해요.
 * - onChange(value): 고른 값을 알려줘요.
 * - icon: 버튼과 첫 항목 앞에 코드 아이콘 표시, align="right": 목록을 오른쪽 끝에 맞춰 펼침
 */
export default function GlassSelect({ options, value, defaultValue = "", onChange, ariaLabel, icon = false, align = "left", className = "" }) {
  const [innerValue, setInnerValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const listId = useId();

  const current = value ?? innerValue;
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === current));

  // 펼쳐져 있을 때 바깥을 누르면 닫기
  useEffect(() => {
    if (!open) return undefined;
    const closeOnOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, [open]);

  const openMenu = () => {
    // 아래 공간이 부족하면 위로 펼침
    const rect = buttonRef.current.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom;
    setOpenUp(below < options.length * 40 + 24 && rect.top > below);
    setActive(selectedIndex);
    setOpen(true);
  };

  const choose = (index) => {
    const next = options[index].value;
    if (value === undefined) setInnerValue(next);
    onChange?.(next);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (event) => {
    const { key } = event;
    if (!open) {
      if (key === "ArrowDown" || key === "ArrowUp") {
        event.preventDefault();
        openMenu();
      }
      return;
    }
    if (key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % options.length);
    } else if (key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (index - 1 + options.length) % options.length);
    } else if (key === "Enter" || key === " ") {
      event.preventDefault();
      choose(active);
    } else if (key === "Escape" || key === "Tab") {
      setOpen(false);
    }
  };

  const classes = ["gsel", open && "is-open", openUp && "is-up", align === "right" && "is-right", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={rootRef} className={classes}>
      <button
        ref={buttonRef}
        type="button"
        className="gsel-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
      >
        {icon && (
          <span className="gsel-ic">
            <CodeIcon />
          </span>
        )}
        <span className="gsel-label">{options[selectedIndex]?.label}</span>
        <svg className="gsel-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <ul id={listId} className="gsel-menu" role="listbox" aria-label={ariaLabel}>
        {options.map((option, index) => (
          <li
            key={option.value}
            role="option"
            aria-selected={index === selectedIndex}
            className={index === active ? "is-active" : undefined}
            onMouseEnter={() => setActive(index)}
            onClick={() => choose(index)}
          >
            {option.color ? (
              <i className="gsel-dot" style={{ "--c": option.color }} />
            ) : (
              icon && (
                <span className="gsel-ic">
                  <CodeIcon />
                </span>
              )
            )}
            <span>{option.label}</span>
            <svg className="gsel-ck" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </li>
        ))}
      </ul>
    </div>
  );
}
