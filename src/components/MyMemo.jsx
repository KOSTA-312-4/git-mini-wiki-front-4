import { useState } from "react";

// Read memos from localStorage
function readMemos(storageKey) {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export default function MyMemo({ userId }) {
  const storageKey = `gitnyang-memos-${userId}`;

  const [memos, setMemos] = useState(() => readMemos(storageKey));

  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // State resets per user via the `key={user.id}` passed from MyPage

  // Add or update a memo
  const handleSave = (event) => {
    event.preventDefault();

    const content = text.trim();

    if (!content) {
      setError("메모 내용을 입력해주세요.");
      return;
    }

    if (content.length > 500) {
      setError("메모는 500자 이하로 입력해주세요.");
      return;
    }

    let updated;

    if (editingId !== null) {
      updated = memos.map((memo) =>
        memo.id === editingId ? { ...memo, content } : memo,
      );
    } else {
      const newMemo = {
        id: crypto.randomUUID(),
        content,
        createdAt: new Date().toISOString(),
      };

      updated = [newMemo, ...memos];
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));

      setMemos(updated);
      setText("");
      setEditingId(null);
      setError("");
    } catch {
      setError("메모 저장에 실패했습니다.");
    }
  };

  // Start editing a memo
  const handleEdit = (memo) => {
    setEditingId(memo.id);
    setText(memo.content);
    setError("");
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setText("");
    setError("");
  };

  // Delete a memo
  const handleDelete = (id) => {
    const confirmed = window.confirm("이 메모를 삭제하시겠습니까?");

    if (!confirmed) return;

    const updated = memos.filter((memo) => memo.id !== id);

    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));

      setMemos(updated);

      if (editingId === id) {
        setEditingId(null);
        setText("");
      }

      setError("");
    } catch {
      setError("메모 삭제에 실패했습니다.");
    }
  };

  return (
    <section className="mb-4">
      <h4 className="mb-3">내 메모</h4>

      {/* Memo input */}
      <form onSubmit={handleSave}>
        <textarea
          className="form-control"
          rows={3}
          maxLength={500}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="메모를 입력하세요."
          aria-label="메모 내용"
        />

        <div className="d-flex justify-content-between align-items-center mt-2">
          <small className="text-muted">{text.length}/500자</small>

          <div className="d-flex gap-2">
            {editingId !== null && (
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleCancel}
              >
                취소
              </button>
            )}

            <button type="submit" className="btn btn-primary btn-sm">
              {editingId !== null ? "수정 완료" : "메모 추가"}
            </button>
          </div>
        </div>
      </form>

      {/* Error message */}
      {error && (
        <p className="text-danger mt-2" role="alert">
          {error}
        </p>
      )}

      {/* Memo list */}
      <div className="mt-4">
        {memos.length === 0 ? (
          <p className="text-muted">아직 작성한 메모가 없습니다.</p>
        ) : (
          memos.map((memo) => (
            <div className="card mb-2" key={memo.id}>
              <div className="card-body">
                <p
                  className="mb-3"
                  style={{
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                  }}
                >
                  {memo.content}
                </p>

                <div className="d-flex gap-2 justify-content-end">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleEdit(memo)}
                  >
                    수정
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(memo.id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
