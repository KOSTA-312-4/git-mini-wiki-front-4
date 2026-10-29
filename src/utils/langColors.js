// 언어 선택 드롭다운과 레포지토리 카드의 언어 색 점에 쓰는 색 (GitHub 언어 색 기준, 없으면 회색)
const LANG_COLORS = {
  JavaScript: "#F1E05A",
  TypeScript: "#3178C6",
  Python: "#3572A5",
  Java: "#B07219",
  Kotlin: "#A97BFF",
  "C++": "#F34B7D",
  C: "#555555",
  "C#": "#178600",
  Go: "#00ADD8",
  Rust: "#DEA584",
  HTML: "#E34C26",
  CSS: "#563D7C",
  Shell: "#89E051",
  Vue: "#41B883",
  Dart: "#00B4AB",
  Swift: "#F05138",
  Ruby: "#701516",
  PHP: "#4F5D95",
};

export const langColor = (language) => LANG_COLORS[language] ?? "#B3C0BA";

// GlassSelect 에 넘기는 언어 목록. 첫 항목(value "")의 글자만 화면마다 달라요. ("언어 선택" / "전체")
export const languageOptions = (firstLabel, languages = ["Java", "Kotlin", "JavaScript", "Python", "TypeScript"]) => [
  { value: "", label: firstLabel },
  ...languages.map((language) => ({ value: language, label: language, color: langColor(language) })),
];
