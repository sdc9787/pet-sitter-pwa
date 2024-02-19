import { useEffect } from "react";
import "./routes-Styles/map.css";

function Map() {
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
      <input type="text" placeholder="검색어를 입력하세요" className="map-search"></input>
    </>
  );
}

export default Map;
