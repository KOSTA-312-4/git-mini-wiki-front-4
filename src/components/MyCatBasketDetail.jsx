import React from "react";
import "./NewCatBasketModal.css";

function MyCatBasketDetail({
  basket,
  likes,
  onClose,
  onRemoveRepo,
  onAddRepository,
  onDelete,
}) {
  //좋아요 누른 레포지토리 중 바구니(컬렉션) 하나에 담긴 레포지토리 들
  const inBasket = likes.filter((repository) =>
    basket.repoIds.includes(repository.id),
  );

  //좋아요 누른 레포지토리 중 바구니에 담기지 않은 레포지토리 들
  const notInBasket = likes.filter(
    (repository) => !basket.repoIds.includes(repository.id),
  );

  //냥바구니 삭제
  const handelDelete = () => {
    onDelete();
  };

  return (
    <div className="catBasket-modal-overlay">
      <div className="catBasket-total-modal">
        {/*헤드*/}
        <div className="catBasket-modal-head">
          <h6 className="catBasket-modal-title">{basket.name}</h6>
          <button
            type="button"
            className="catBasket-modal-close"
            onClick={onClose}
          >
            x
          </button>
        </div>
        {/*본문*/}
        <div className="catBasket-modal-body">
          <p>{basket.description}</p>
          {/*목록 출력*/}
          <ul className="catBasket-repo-list">
            {inBasket.map((repository) => (
              <li key={repository.id} className="catBasket-repo-item">
                <span>{repository.name}</span>
                <button
                  type="button"
                  className="catBasket-btn"
                  onClick={() => onRemoveRepo(repository.id)}
                >
                  빼기
                </button>
              </li>
            ))}
          </ul>

          {/*생성된 레포지토리에 추가하거나 빼기*/}
          <p className="catBasket-field-label">추가하기</p>
          {notInBasket.length === 0 ? (
            <p className="catBasket-empty-test">
              더 담을 레포지토리가 없습니다.
            </p>
          ) : (
            <ul className="catBasket-repo-list">
              {notInBasket.map((repository) => (
                <li key={repository.id} className="catBasket-repo-item">
                  <span>{repository.name}</span>
                  <button
                    type="button"
                    className="catBasket-btn"
                    onClick={() => onAddRepository(repository.id)}
                  >
                    담기
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/*냥바구니 삭제*/}
          <div className="catBasket-modal-footer">
            <button
              type="button"
              className="catBasket-btn catBasket-btn-danger"
              onClick={handelDelete}
            >
              냥바구니 삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyCatBasketDetail;
