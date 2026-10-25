import React from "react";
import "./MyCatBasket.css";

function MyCatBasket() {
  return (
    <div>
      {/*툴바*/}
      <div className="catBasket-toolbar">
        <h5>냥바구니</h5>
        <button type="button" className="catBasket-add-button">
          + 새 냥바구니
        </button>
      </div>

      {/*컬렉션 리스트*/}
      <div className="catBasket-list">
        {/*전체 냥바구니*/}
        <div className="catBasket-card">
          <div className="catBasket-card-top">
            <i className="bi bi-folder"></i> {/*아이콘(부트스트랩)*/}
            <span className="catBasket-card-count">0</span>
            {/*컬렉션 몇개 있는지 count*/}
          </div>
          <h6 className="catBasket-card-name">전체</h6>
          <p className="catBasket-card-description">
            좋아요한 모든 레포(카드 한줄 설명)
          </p>
        </div>
        {/*만약 냥바구니가 하나도 없을경우 보임*/}
        <div className="catBasket-card catBasket-card-empty">
          <i className="bi bi-plus-lg"></i>
        </div>
      </div>
    </div>
  );
}

export default MyCatBasket;
