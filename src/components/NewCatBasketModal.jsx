import React, { use, useState } from "react";
import { createPortal } from "react-dom";
import "./NewCatBasketModal.css";

function NewCatBasketModal({ favorites, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectIds, setSelectIds] = useState([]); //여러 id들이 들어올 수 있으므로 배열

  //입력 내역 제출
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimName = name.trim();

    onCreate({
      name: trimName,
      description: description.trim(),
      repoIds: selectIds,
    });
  };

  const toggleRepo = (id) =>
    //이미 id 값이 있으면 목록에서 빼고, 선택 안된 레포지토리면 목록에 추가
    setSelectIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  // 패널의 blur(backdrop-filter) 안에 모달이 갇히지 않도록 body 에 바로 그림
  return createPortal(
    <div className="catBasket-modal-overlay">
      <div className="catBasket-total-modal">
        {/*모달 헤더 */}
        <div className="catBasket-modal-head">
          <h6 className="catBasket-modal-title">새 냥바구니</h6>
          {/*닫기 버튼*/}
          <button
            type="button"
            className="catBasket-modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/*입력 폼*/}
        <form className="catBasket-modal-body" onSubmit={handleSubmit}>
          <label htmlFor="basketName" className="catBasket-field-label">
            이름
          </label>
          <input
            id="basketName"
            className="catBasket-field-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="basketDescription" className="catBasket-field-label">
            한 줄 설명
          </label>
          <input
            id="basketDescription"
            className="catBasket-field-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/*좋아요한 레포지토리 목록들 중에서 확인*/}
          <p className="catBasket-field-label">레포지토리 목록</p>
          {/*삼항연산자 이용*/}
          {favorites.length === 0 ? (
            <p className="catBasket-empty-text">
              담을 수 있는 레포지토리가 없습니다.
            </p>
          ) : (
            <ul className="catBasket-repo-list">
              {favorites.map((repository) => (
                <li key={repository.id} className="catBasket-repo-item">
                  {/*checkbox로 냥바구니에 추가할 레포지토리 검색*/}
                  <label>
                    <input
                      type="checkbox"
                      checked={selectIds.includes(repository.id)}
                      onChange={() => toggleRepo(repository.id)}
                    />{" "}
                    {repository.name}{" "}
                  </label>
                  {repository.tag && (
                    <label>
                      <span className="newCatBasket-tag" data-tag={repository.tag}>#{repository.tag}</span>
                    </label>
                  )}
                </li>
              ))}
            </ul>
          )}

          <div className="catBasket-modal-foot">
            {/*냥바구니 생성 버튼*/}
            <button
              type="submit"
              className="catBasket-btn catBasket-btn-create"
            >
              만들기
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

export default NewCatBasketModal;
