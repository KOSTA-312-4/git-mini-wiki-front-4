import React from "react";
import "./Favorites.css";
import MyCatBasket from "../components/MyCatBasket";
import MyLikes from "../components/MyLikes";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function Favorites() {
  const loginUser = useSelector((s) => s.loginUser);

  if (!loginUser) {
    alert("로그인이 필요합니다.");
    return <Navigate to="/login" replace />;
  }
  return (
    <div>
      <div className="favorite-title">
        <h2 style={{ fontWeight: "bold" }}>즐겨찾기</h2>
        <h6 style={{ color: "gray", fontSize: "10px" }}>
          발견한 코드를 나만의 폴더로. 좋아하는 레포지토리를 모아 <b>“냥바구니”</b>에
          담아보세요.
        </h6>
      </div>
      <div className="favorite-collection">
        <MyCatBasket />
      </div>
      <div className="favorite-list">
        <MyLikes />
      </div>
    </div>
  );
}

export default Favorites;
