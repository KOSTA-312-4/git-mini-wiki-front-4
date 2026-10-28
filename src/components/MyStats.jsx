import { useId } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./MyStats.css";

// 언어별 고유 색상 (색맹 안전성을 검사한 순서이므로 순서를 바꾸지 않습니다)
const LANGUAGE_COLORS = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#6250d6"];
const OTHER_COLOR = "#adb5bd";
const NO_LANGUAGE = "언어 없음";

// 도넛 차트 크기
const DONUT_RADIUS = 80;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;
const DONUT_GAP = 2; // 조각 사이 여백

// 레포 목록을 언어별 개수로 묶어 많은 순(같으면 이름순)으로 정렬
function countByLanguage(repos) {
  const counts = {};
  repos.forEach((repo) => {
    const language = repo.language || NO_LANGUAGE;
    counts[language] = (counts[language] ?? 0) + 1;
  });

  return Object.entries(counts)
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count || a.language.localeCompare(b.language));
}

function percent(count, total) {
  return total === 0 ? 0 : (count / total) * 100;
}

const MyStats = () => {
  // 도넛 차트를 위에서부터 시계방향으로 그려내는 mask 의 고유 id
  const donutMaskId = useId();
  const userEmail = useSelector((s) => s.loginUser?.email);
  const favorites = useSelector((s) => s.favorites).filter((f) => f.userId === userEmail);
  const baskets = useSelector((s) => s.baskets).filter((b) => b.userId === userEmail);

  const languageStats = countByLanguage(favorites);
  const total = favorites.length;

  // 색상은 언어를 따라가도록 즐겨찾기 순위 기준으로 한 번만 정함 (8위부터는 "기타")
  const colorOf = (language) => {
    const index = languageStats.findIndex((stat) => stat.language === language);
    return index >= 0 && index < LANGUAGE_COLORS.length ? LANGUAGE_COLORS[index] : OTHER_COLOR;
  };

  // 도넛 차트 조각: 상위 7개 + 나머지는 "기타" 로 합침
  const donutSlices = languageStats.slice(0, LANGUAGE_COLORS.length).map((stat) => ({
    ...stat,
    color: colorOf(stat.language),
  }));
  const otherCount = languageStats
    .slice(LANGUAGE_COLORS.length)
    .reduce((sum, stat) => sum + stat.count, 0);
  if (otherCount > 0) {
    donutSlices.push({ language: "기타", count: otherCount, color: OTHER_COLOR });
  }

  // 각 조각의 시작 위치 = 앞 조각들의 길이 합
  const donutGap = donutSlices.length > 1 ? DONUT_GAP : 0;
  const donutArcs = donutSlices.map((slice, index) => {
    const before = donutSlices.slice(0, index).reduce((sum, s) => sum + s.count, 0);
    const length = (slice.count / total) * DONUT_CIRCUMFERENCE;
    return {
      ...slice,
      length: Math.max(length - donutGap, 0.5),
      offset: (before / total) * DONUT_CIRCUMFERENCE,
    };
  });

  // 가로 막대: 언어 Top 10
  const top10 = languageStats.slice(0, 10);
  const top10Max = top10[0]?.count ?? 0;

  // 세로 막대: 냥바구니별 레포지토리 수 (좋아요가 해제된 레포는 제외)
  const favoriteIds = new Set(favorites.map((repo) => repo.id));
  const basketStats = baskets.map((basket) => ({
    id: basket.id,
    name: basket.name,
    count: (basket.repoIds ?? []).filter((id) => favoriteIds.has(id)).length,
  }));
  const basketMax = Math.max(0, ...basketStats.map((stat) => stat.count));

  // 표: 냥바구니에 담긴 레포(중복 제외)의 언어별 개수
  const basketRepoIds = new Set(baskets.flatMap((basket) => basket.repoIds ?? []));
  const basketRepos = favorites.filter((repo) => basketRepoIds.has(repo.id));
  const basketLanguageStats = countByLanguage(basketRepos);

  return (
    <section className="mystats" aria-label="나의 통계">
      <h2 className="mystats-title">
        나의 통계
        <small>즐겨찾기한 레포지토리 기준</small>
      </h2>

      {/* 1행: 즐겨찾기 수, 냥바구니 수 */}
      <div className="mystats-summary">
        <Link className="mystats-summary-card" to="/favorites">
          <span className="mystats-summary-icon">
            <i className="bi bi-heart-fill" aria-hidden="true" />
          </span>
          <span className="mystats-summary-text">
            <span className="mystats-summary-label">즐겨찾기</span>
            <span className="mystats-summary-value">{favorites.length}</span>
          </span>
          <i className="bi bi-chevron-right mystats-summary-go" aria-hidden="true" />
        </Link>
        <Link className="mystats-summary-card" to="/favorites">
          <span className="mystats-summary-icon">
            <i className="bi bi-basket-fill" aria-hidden="true" />
          </span>
          <span className="mystats-summary-text">
            <span className="mystats-summary-label">냥바구니</span>
            <span className="mystats-summary-value">{baskets.length}</span>
          </span>
          <i className="bi bi-chevron-right mystats-summary-go" aria-hidden="true" />
        </Link>
      </div>

      {/* 2행: 언어 분포 도넛, 언어 Top 10 */}
      <div className="mystats-row">
        <article className="mystats-card">
          <h3 className="mystats-card-title">언어 분포</h3>
          {total === 0 ? (
            <p className="mystats-empty">아직 즐겨찾기한 레포지토리가 없습니다.</p>
          ) : (
            <div className="mystats-donut">
              <svg viewBox="0 0 200 200" role="img" aria-label="즐겨찾기 언어 분포 도넛 차트">
                <defs>
                  <mask id={donutMaskId}>
                    <circle
                      className="mystats-donut-reveal"
                      cx="100"
                      cy="100"
                      r={DONUT_RADIUS}
                      pathLength="100"
                      transform="rotate(-90 100 100)"
                    />
                  </mask>
                </defs>
                <g transform="rotate(-90 100 100)" mask={`url(#${donutMaskId})`}>
                  {donutArcs.map((arc) => (
                    <circle
                      key={arc.language}
                      className="mystats-donut-arc"
                      cx="100"
                      cy="100"
                      r={DONUT_RADIUS}
                      stroke={arc.color}
                      strokeDasharray={`${arc.length} ${DONUT_CIRCUMFERENCE}`}
                      strokeDashoffset={-arc.offset}
                    >
                      <title>{`${arc.language}: ${arc.count}개 (${percent(arc.count, total).toFixed(1)}%)`}</title>
                    </circle>
                  ))}
                </g>
                <text className="mystats-donut-total" x="100" y="98">
                  {total}
                </text>
                <text className="mystats-donut-caption" x="100" y="120">
                  레포지토리
                </text>
              </svg>

              <ul className="mystats-legend">
                {donutSlices.map((slice, index) => (
                  <li key={slice.language} style={{ "--i": index }}>
                    <span className="mystats-dot" style={{ backgroundColor: slice.color }} />
                    <span className="mystats-legend-name">{slice.language}</span>
                    <span className="mystats-legend-value">
                      {percent(slice.count, total).toFixed(1)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>

        <article className="mystats-card">
          <h3 className="mystats-card-title">언어 순위 Top 10</h3>
          {top10.length === 0 ? (
            <p className="mystats-empty">아직 즐겨찾기한 레포지토리가 없습니다.</p>
          ) : (
            <ol className="mystats-hbar">
              {top10.map((stat, index) => (
                <li
                  key={stat.language}
                  title={`${stat.language}: ${stat.count}개`}
                  style={{ "--i": index }}
                >
                  <span className="mystats-hbar-rank">{index + 1}</span>
                  <span className="mystats-hbar-name">{stat.language}</span>
                  <span className="mystats-hbar-track">
                    <span
                      className="mystats-hbar-fill"
                      style={{ width: `${percent(stat.count, top10Max)}%` }}
                    />
                  </span>
                  <span className="mystats-hbar-value">{stat.count}</span>
                </li>
              ))}
            </ol>
          )}
        </article>
      </div>

      {/* 3행: 냥바구니별 레포지토리 수 */}
      <article className="mystats-card">
        <h3 className="mystats-card-title">
          냥바구니별 레포지토리 수
          <small>냥바구니 {baskets.length}개 · 레포지토리 {basketRepos.length}개</small>
        </h3>
        {basketStats.length === 0 ? (
          <p className="mystats-empty">아직 만든 냥바구니가 없습니다.</p>
        ) : (
          <div className="mystats-vbar" role="img" aria-label="냥바구니별 레포지토리 수 막대 차트">
            {basketStats.map((stat, index) => (
              <div
                key={stat.id}
                className="mystats-vbar-item"
                title={`${stat.name}: ${stat.count}개`}
                style={{ "--i": index }}
              >
                <span className="mystats-vbar-value">{stat.count}</span>
                <span className="mystats-vbar-track">
                  <span
                    className="mystats-vbar-fill"
                    style={{ height: `${percent(stat.count, basketMax)}%` }}
                  />
                </span>
                <span className="mystats-vbar-name">{stat.name}</span>
              </div>
            ))}
          </div>
        )}
      </article>

      {/* 4행: 모든 언어 통계 표 */}
      <article className="mystats-card">
        <h3 className="mystats-card-title">모든 언어 통계</h3>
        {languageStats.length === 0 ? (
          <p className="mystats-empty">아직 즐겨찾기한 레포지토리가 없습니다.</p>
        ) : (
          <div className="mystats-table-wrap">
            <table className="mystats-table">
              <thead>
                <tr>
                  <th scope="col">순위</th>
                  <th scope="col">언어</th>
                  <th scope="col" className="mystats-num">즐겨찾기</th>
                  <th scope="col" className="mystats-num">비율</th>
                  <th scope="col" className="mystats-num">냥바구니</th>
                </tr>
              </thead>
              <tbody>
                {languageStats.map((stat, index) => (
                  <tr key={stat.language}>
                    <td>{index + 1}</td>
                    <td>
                      <span className="mystats-dot" style={{ backgroundColor: colorOf(stat.language) }} />
                      {stat.language}
                    </td>
                    <td className="mystats-num">{stat.count}</td>
                    <td className="mystats-num">{percent(stat.count, total).toFixed(1)}%</td>
                    <td className="mystats-num">
                      {basketLanguageStats.find((b) => b.language === stat.language)?.count ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
};

export default MyStats;
