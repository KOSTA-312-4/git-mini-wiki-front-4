import React, { useState } from "react";
import "./NewCatBasketModal.css";

function NewCatBasketModal({ likes, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  //저장
  const handleSubmit = (e) => {
    e.preventDefault(); //기본 제출 동작 차단하기

    onCreate({
      name: name.trim(),
      description: description.trim(),
    });
  };

  return (
    <div className="catBasket-modal-overlay">
      <div className="create-modal-body">
        <form onSubmit={handleSubmit}>
          <label htmlFor="basketName" className="catBasket-field-label">
            이름
          </label>
          <input
            id="basketName"
            type="text"
            className="catBasket-field-input"
            value={name}
            placeholder="프론트엔드"
          />

          <label htmlFor="basketDescription" className="catBasket-field-label">
            한줄 설명
          </label>
          <input
            id="basketDescription"
            className="catBasket-field-label"
            type="text"
            value={description}
            placeholder="화면 만들때 보는 레포지토리 모음"
          />

          <p className="catBasket-field-label">담을 레포지토리</p>
        </form>
      </div>
    </div>
  );
}

export default NewCatBasketModal;
