import React, { useState } from "react";
import "./MyCatBasket.css";
import NewCatBasketModal from "./NewCatBasketModal";

//목 데이터
const MOCK_LIKES = [
  { id: 1001, name: "repo-1", full_name: "user1/repo-1", language: "Java" },
  {
    id: 1002,
    name: "repo-2",
    full_name: "user2/repo-2",
    language: "JavaScript",
  },
  { id: 1003, name: "repo-3", full_name: "user3/repo-3", language: "Python" },
  {
    id: 1004,
    name: "repo-4",
    full_name: "user4/repo-4",
    language: "TypeScript",
  },
  { id: 1005, name: "repo-5", full_name: "user5/repo-5", language: null },
  { id: 1006, name: "repo-6", full_name: "user6/repo-6", language: "Java" },
];

const MOCK_BASKETS = [
  {
    id: 1,
    name: "프론트엔드",
    description: "화면 만들 때 보는 레포",
    repoIds: [1002, 1004],
  },
  {
    id: 2,
    name: "백엔드",
    description: "서버 관련",
    repoIds: [1001, 1006, 1003],
  },
];

function MyCatBasket() {
  //TODO: 실제 데이터로 교체해야 함
  const [likes, setLikes] = useState(MOCK_LIKES);
  const [baskets, setBaskets] = useState(MOCK_BASKETS);

  //새 냥바구니 버튼 감지
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  //냥바구니에 저장
  const saveBaskets = (next) => setBaskets(next);

  //새 냥바구니 만들기
  //name, description, repoIds(바구니에 담기로한 레포)는 모달을 통해 전달 받은 정보
  const handleCreate = ({ name, description, repoIds }) => {
    saveBaskets([...baskets, { id: Date.now(), name, description, repoIds }]); //기존 바구니 목록에서 새로운 냥바구니(컬렉션) 추가

    //모달 닫기
    setIsCreateOpen(false);
  };

  return (
    <div>
      {/*툴바*/}
      <div className="catBasket-toolbar">
        <h5>냥바구니</h5>
        <button
          type="button"
          className="catBasket-add-button"
          onClick={() => setIsCreateOpen(true)}
        >
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

      {/*냥바구니 만들기*/}
      {/*true이면 새 모달 열기*/}
      {isCreateOpen && (
        <NewCatBasketModal
          likes={likes}
          onClose={() => setIsCreateOpen(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}

export default MyCatBasket;
