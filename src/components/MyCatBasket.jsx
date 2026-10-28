import React, { useState } from "react";
import "./MyCatBasket.css";
import NewCatBasketModal from "./NewCatBasketModal";
import MyCatBasketDetail from "./MyCatBasketDetail";
import { useDispatch, useSelector } from "react-redux";
import {
  addRepoToBasket,
  createBasket,
  deleteBasket,
  removeRepoFromBasket,
  selectMyBaskets,
  selectMyFavorites,
} from "../store/store";
import { alertError } from "../api/auth";

function MyCatBasket() {
  const dispatch = useDispatch();

  //새 냥바구니 버튼 감지
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  //생성된 냥바구니 중 사용자가 현재 선택하고 있는 컬렉션(즉 열려 있는 컬렉션)에 대한 id 값
  const [detailId, setDetailId] = useState(null);

  // //냥바구니에 저장
  // const saveBaskets = (next) => setBaskets(next);

  //로그인한 사용자의 favorites과 baskets
  const favorites = useSelector(selectMyFavorites);
  const baskets = useSelector(selectMyBaskets); //basket의 userId와 userEmail이 일치하는 바구니만

  //냥바구니에 있는 레포지토리
  //만약 레포지토리가 없으면 undefined로 저장됨(undefined인지 확인하는 로직 필요)
  const selectedBasket = baskets.find(
    (repository) => repository.id == detailId,
  );

  //새 냥바구니 만들기
  //name, description, repoIds(바구니에 담기로한 레포)는 모달을 통해 전달 받은 정보
  const handleCreate = async ({ name, description, repoIds }) => {
    // id 는 서버가 정하므로 저장이 끝난 뒤에 목록에 나타납니다.
    try {
      await dispatch(createBasket({ name, description, repoIds }));
    } catch (error) {
      alertError(error);
      return; // 실패하면 모달을 닫지 않아 입력한 내용이 남습니다.
    }

    //모달 닫기
    setIsCreateOpen(false);
  };

  //냥바구니에 레포지토리 추가하기
  const handleAddRepo = (basketId, newRepoId) => {
    {
      /*
      baskets 배열 형태
      id : 1,
      name : "프론트엔드",
      description: "설명",
      repoIds: [1001,1002]
    */
    }

    dispatch(addRepoToBasket({ basketId, repoId: newRepoId }));
    // setBaskets((prev) =>
    //   prev.map((basket) =>
    //     basket.id === basketId
    //       ? { ...basket, repoIds: [...basket.repoIds, newRepoId] }
    //       : basket,
    //   ),
    // );
  };

  //냥바구니에 레포지토리 빼기
  const handleRemoveRepo = (basketId, repoId) => {
    // setBaskets((prev) =>
    //   prev.map(
    //     (
    //       basket, //새 뱌열을 만듦
    //     ) =>
    //       basket.id === basketId //냥바구니 id 값이 일치하면
    //         ? {
    //             ...basket,
    //             repoIds: basket.repoIds.filter((id) => id !== repoId),
    //           } //필터로 repoId를 제외하고 새 배열을 반환한다
    //         : basket,
    //   ),
    // );
    dispatch(removeRepoFromBasket({ basketId, repoId }));
  };

  //냥바구니 삭제
  const handleDeleteBasket = (basket) => {
    // saveBaskets(baskets.filter((b) => b.id !== basket.id));
    dispatch(deleteBasket(basket.id));
    setDetailId(null);
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
            <span className="catBasket-card-count">ALL</span>
            {/*컬렉션 몇개 있는지 count*/}
          </div>
          <h6 className="catBasket-card-name">전체</h6>
          <p className="catBasket-card-description">좋아요한 모든 레포지토리</p>
        </div>

        {/*만든 냥바구니 보기*/}
        {baskets.map((basket) => (
          <div
            key={basket.id}
            className="catBasket-card catBasket-card-click"
            onClick={() => setDetailId(basket.id)}
          >
            <div className="catBasket-card-top">
              <i className="bi bi-folder"></i>
            </div>
            <h6 className="catBasket-card-name">{basket.name}</h6>
            <p className="catBasket-card-description">
              {basket.description || "설명 없음"}
            </p>
          </div>
        ))}

        {/*만약 냥바구니가 하나도 없을경우 보임*/}
        <div className="catBasket-card catBasket-card-empty">
          <button
            className="plus-button"
            type="button"
            onClick={() => setIsCreateOpen(true)}
          >
            +
          </button>
        </div>
      </div>

      {/*냥바구니 만들기*/}
      {/*true이면 새 모달 열기*/}
      {isCreateOpen && (
        <NewCatBasketModal
          favorites={favorites}
          onClose={() => setIsCreateOpen(false)}
          onCreate={handleCreate}
        />
      )}

      {/*냥바구니 선택해서 보기(들어가있는 레포 조회)*/}
      {/*true이면 컬렉션 모달 열기*/}
      {selectedBasket && (
        <MyCatBasketDetail
          basket={selectedBasket}
          favorites={favorites}
          onClose={() => setDetailId(null)}
          onAddRepository={(repoId) => handleAddRepo(selectedBasket.id, repoId)}
          onRemoveRepo={(repoId) => handleRemoveRepo(selectedBasket.id, repoId)}
          onDelete={() => handleDeleteBasket(selectedBasket)}
        />
      )}
    </div>
  );
}

export default MyCatBasket;
