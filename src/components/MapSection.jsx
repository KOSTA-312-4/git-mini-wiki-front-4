import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./MapSection.css";

/*
 * 메인 페이지 아래의 세계 지도 (시각화를 위한 예시 데이터).
 * 64x32 격자의 대륙 모양을 점으로 그리고, 도시마다 레포지토리 수를 표시합니다.
 * 화면에 들어오면 나타나고, 스크롤에 따라 지도와 표시가 살짝 다르게 움직여요.
 */

// 행마다 육지인 칸의 [시작, 끝] 열 번호
const LAND = [
  [[12, 19], [21, 29], [33, 35]],
  [[10, 20], [22, 29], [34, 37], [42, 44], [48, 51]],
  [[3, 17], [22, 29], [42, 63]],
  [[0, 1], [3, 20], [23, 28], [33, 63]],
  [[2, 20], [23, 25], [27, 28], [33, 63]],
  [[3, 21], [24, 24], [31, 32], [33, 63]],
  [[9, 22], [31, 32], [34, 61]],
  [[10, 22], [31, 58]],
  [[10, 20], [30, 58]],
  [[10, 20], [30, 32], [33, 35], [36, 57]],
  [[10, 19], [30, 31], [33, 34], [36, 57]],
  [[11, 17], [30, 53], [55, 56]],
  [[12, 17], [29, 53]],
  [[14, 18], [28, 42], [44, 53]],
  [[14, 16], [18, 20], [28, 41], [45, 47], [49, 51], [53, 54]],
  [[15, 17], [28, 41], [45, 46], [49, 52], [53, 54]],
  [[17, 21], [29, 40], [45, 46], [49, 51]],
  [[18, 23], [30, 40], [49, 53]],
  [[18, 24], [34, 39], [49, 54], [55, 58]],
  [[17, 25], [34, 39], [50, 52], [55, 58]],
  [[17, 25], [34, 39], [51, 52], [56, 58]],
  [[18, 25], [34, 39], [55, 57]],
  [[20, 25], [34, 39], [40, 41], [53, 58]],
  [[20, 24], [34, 38], [40, 41], [52, 58]],
  [[20, 23], [34, 37], [52, 58]],
  [[20, 23], [35, 37], [52, 58]],
  [[20, 22], [35, 36], [53, 58]],
  [[20, 21], [57, 58], [62, 63]],
  [[20, 21], [61, 62]],
  [[19, 21]],
  [[20, 21]],
  [],
];

const CELL = 16;
const LAND_POINTS = LAND.flatMap((spans, row) =>
  spans.flatMap(([from, to]) =>
    Array.from({ length: to - from + 1 }, (_, i) => ({ cx: (from + i) * CELL + CELL / 2, cy: row * CELL + CELL / 2 })),
  ),
);

// [도시, 위도, 경도, 레포지토리 수, 크기, 색(민트/금색), 라벨 위치]
const TEAL = "63,184,163";
const GOLD = "235,199,106";
const PINS = [
  ["San Francisco", 37.8, -122.4, "3.4K", 44, GOLD, "b"],
  ["Seattle", 47.6, -122.3, "1.2K", 28, TEAL, "t"],
  ["New York", 40.7, -72.0, "2.8K", 40, TEAL, "r"],
  ["Toronto", 45.0, -86.0, "1.1K", 26, TEAL, "t"],
  ["Mexico City", 19.4, -99.1, "520", 24, TEAL, "b"],
  ["São Paulo", -23.5, -46.6, "970", 30, TEAL, "r"],
  ["London", 51.5, -0.1, "2.2K", 38, GOLD, "l"],
  ["Berlin", 52.5, 13.4, "1.4K", 30, TEAL, "r"],
  ["Lagos", 6.5, 3.4, "310", 22, TEAL, "l"],
  ["Cairo", 30, 31.2, "420", 24, TEAL, "b"],
  ["Bangalore", 12.9, 77.6, "1.6K", 32, TEAL, "b"],
  ["Beijing", 39.9, 112.5, "3.1K", 42, GOLD, "l"],
  ["Seoul", 37.5, 128.5, "2.4K", 38, GOLD, "b"],
  ["Tokyo", 35.7, 141.5, "1.9K", 34, TEAL, "r"],
  ["Singapore", 1.3, 103.8, "800", 26, TEAL, "b"],
  ["Sydney", -33.9, 151.2, "640", 26, TEAL, "l"],
];

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function MapSection() {
  const sectionRef = useRef(null);
  const landRef = useRef(null);
  const marksRef = useRef(null);
  // 움직임 줄이기 설정이면 처음부터 보여줌
  const [shown, setShown] = useState(prefersReducedMotion);

  // 화면에 들어오면 나타나기
  useEffect(() => {
    if (shown) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [shown]);

  // 스크롤에 따라 지도(느리게)와 표시(빠르게)가 살짝 움직임
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    let ticking = false;
    const move = () => {
      ticking = false;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
      landRef.current.style.transform = `translate3d(0, ${((progress - 0.5) * -22).toFixed(1)}px, 0)`;
      marksRef.current.style.transform = `translate3d(0, ${((progress - 0.5) * -48).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(move);
      }
    };
    move();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", move);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", move);
    };
  }, []);

  return (
    <section ref={sectionRef} className={`map-sec${shown ? " in" : ""}`} aria-label="전 세계 레포지토리 지도">
      <div className="map-wrap">
        <div className="map-head fx">
          <span className="map-kick">GLOBAL REPOSITORIES</span>
          <h2>전 세계에서 모이는 레포지토리</h2>
          <p>도시마다 깃냥이가 찾아둔 레포지토리가 쌓이고 있어요.</p>
          <Link className="map-more" to="/search?q=stars%3A%3E50000&lang=">
            View More
          </Link>
        </div>

        <div className="map-col">
          <div className="map-stage fx">
            <div className="map-land" ref={landRef}>
              <svg viewBox={`0 0 ${64 * CELL} ${32 * CELL}`} preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <filter id="map-goo" x="-5%" y="-5%" width="110%" height="110%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b" />
                    <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
                  </filter>
                </defs>
                <g filter="url(#map-goo)" fill="#2C3C38">
                  {LAND_POINTS.map(({ cx, cy }) => (
                    <circle key={`l${cx}-${cy}`} cx={cx} cy={cy} r="10.5" />
                  ))}
                </g>
                <g fill="rgba(185,221,211,.2)">
                  {LAND_POINTS.map(({ cx, cy }) => (
                    <circle key={`d${cx}-${cy}`} cx={cx} cy={cy} r="1.7" />
                  ))}
                </g>
              </svg>
            </div>

            <div className="map-marks" ref={marksRef}>
              {PINS.map(([city, lat, lon, count, size, color, side], index) => (
                <div
                  key={city}
                  className="map-mk"
                  title={city}
                  style={{
                    left: `${(((lon + 180) / 360) * 100).toFixed(2)}%`,
                    top: `${(((84.25 - lat) / 144) * 100).toFixed(2)}%`,
                    "--d": `${index * 90 + 200}ms`,
                    "--p": `${(index * 370) % 3800}ms`,
                    "--s": `${size}px`,
                    "--c": color,
                  }}
                >
                  <div className="map-pl">+</div>
                  <span className={`map-lab ${side}`}>
                    <b>{count}</b> repositories
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="map-note fx">※ 시각화를 위한 예시 데이터예요. 실제 위치·수치와 달라요.</p>
        </div>
      </div>
    </section>
  );
}
