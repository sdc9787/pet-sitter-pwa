import React from "react";
import "./map.css";
import KakaoMap from "../../Component/kakaoMap/kakaoMap.jsx";
import MotionComponent from "../../Component/motion/motion.js";

const Map: React.FC = () => {
  return (
    <>
      <MotionComponent>
        <KakaoMap></KakaoMap>
      </MotionComponent>
    </>
  );
};

export default Map;
