import { useEffect, useState } from "react";
import "./routes-Styles/map.css";

function Map() {
  const [search, setSearch] = useState("");
  const [searchIcon, setSearchIcon] = useState("xi-maker");

  /* global kakao*/
  useEffect(() => {
    var container = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
    var options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
      level: 3, //지도의 레벨(확대, 축소 정도)
    };

    var map = new kakao.maps.Map(container as HTMLElement, options); //지도 생성 및 객체 리턴
    map;
  });

  return (
    <>
      <div id="map" className="kakao-map"></div>
      <div className="map-search">
        <div className={"map-search-recent" + search}>{/* <span className="map-search-recent-title">최근 검색</span> */}</div>
        <div className="map-search-icon">
          <i
            onClick={() => {
              setSearch("");
              setSearchIcon("xi-maker");
            }}
            className={searchIcon + " xi-2x"}></i>
          <input
            onClick={() => {
              setSearch(" map-search-recent-height");
              setSearchIcon("xi-angle-left-min");
            }}
            type="text"
            placeholder="검색어를 입력하세요"
            className="map-search-input"></input>
        </div>
      </div>
    </>
  );
}

export default Map;
