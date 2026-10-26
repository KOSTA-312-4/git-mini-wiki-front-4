import React, { use, useState } from "react";
import "./NewCatBasketModal.css";

function NewCatBasketModal({ likes, onClose, onCreate }) {
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

  return (
    <div className="catBasket-modal-overlay">
      <div className="catBasket-total-modal">
        <div className="catBasket-modal-head">
          <h6 className="catBasket-modal-title">새 냥바구니</h6>
        </div>
        <button
          type="button"
          className="catBasket-modal-close"
          onClick={onClose}
        >
          x
        </button>
      </div>
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
          한줄 설명
        </label>
        <input
          id="basketDescription"
          className="catBasket-field-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </form>
    </div>
  );
}

export default NewCatBasketModal;
